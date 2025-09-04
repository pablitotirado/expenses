import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { commonTags, appPort } from '../../configs/infrastructure';

export interface FargateServiceModuleArgs {
  vpcId: pulumi.Input<string>;
  privateSubnetIds: pulumi.Input<string[]>;
  albTargetGroupArn: pulumi.Input<string>;
  secretsManagerArn: pulumi.Input<string>;
  ecrRepositoryUrl: pulumi.Input<string>;
  ecrImageTag?: pulumi.Input<string>;
  albSecurityGroupId: pulumi.Input<string>;
}

export class FargateServiceModule extends pulumi.ComponentResource {
  public readonly cluster: aws.ecs.Cluster;
  public readonly taskDefinition: aws.ecs.TaskDefinition;
  public readonly service: aws.ecs.Service;
  public readonly securityGroup: aws.ec2.SecurityGroup;
  public readonly iamRole: aws.iam.Role;
  public readonly executionRole: aws.iam.Role;

  constructor(
    name: string,
    args: FargateServiceModuleArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('expense-manager:infra:compute:FargateServiceModule', name, {}, opts);

    this.cluster = new aws.ecs.Cluster(
      `${name}-cluster`,
      {
        name: `${name}-cluster`,
        settings: [
          {
            name: 'containerInsights',
            value: 'enabled',
          },
        ],
        tags: {
          ...commonTags,
          name: `${name}-cluster`,
        },
      },
      { parent: this },
    );

    this.securityGroup = new aws.ec2.SecurityGroup(
      `${name}-fargate-sg`,
      {
        vpcId: args.vpcId,
        description: 'Security group for Fargate tasks running NestJS app',
        ingress: [
          {
            protocol: 'tcp',
            fromPort: appPort,
            toPort: appPort,
            securityGroups: args.albSecurityGroupId
              ? [args.albSecurityGroupId]
              : [],
            description: 'Allow application traffic from ALB',
          },
        ],
        egress: [
          {
            protocol: '-1',
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ['0.0.0.0/0'],
            description: 'Allow all outbound traffic',
          },
        ],
        tags: {
          ...commonTags,
          name: `${name}-fargate-sg`,
        },
      },
      { parent: this },
    );

    this.executionRole = new aws.iam.Role(
      `${name}-execution-role`,
      {
        assumeRolePolicy: aws.iam
          .getPolicyDocument({
            statements: [
              {
                actions: ['sts:AssumeRole'],
                principals: [
                  {
                    type: 'Service',
                    identifiers: ['ecs-tasks.amazonaws.com'],
                  },
                ],
              },
            ],
          })
          .then((doc) => doc.json),
        managedPolicyArns: [
          'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
        ],
        tags: {
          ...commonTags,
          name: `${name}-execution-role`,
        },
      },
      { parent: this },
    );

    const ecrPolicy = new aws.iam.Policy(
      `${name}-ecr-policy`,
      {
        description: 'Policy for ECR access',
        policy: pulumi.jsonStringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'ecr:GetAuthorizationToken',
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
              ],
              Resource: '*',
            },
          ],
        }),
        tags: {
          ...commonTags,
          name: `${name}-ecr-policy`,
        },
      },
      { parent: this.executionRole },
    );

    new aws.iam.RolePolicyAttachment(
      `${name}-ecr-attachment`,
      {
        role: this.executionRole.name,
        policyArn: ecrPolicy.arn,
      },
      { parent: this.executionRole },
    );

    const secretsManagerPolicy = new aws.iam.Policy(
      `${name}-secrets-manager-policy`,
      {
        description: 'Policy for Secrets Manager access',
        policy: pulumi.all([args.secretsManagerArn]).apply(([secretArn]) =>
          pulumi.jsonStringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'secretsmanager:GetSecretValue',
                  'secretsmanager:DescribeSecret',
                ],
                Resource: secretArn,
              },
            ],
          }),
        ),
        tags: {
          ...commonTags,
          name: `${name}-secrets-manager-policy`,
        },
      },
      { parent: this.executionRole },
    );

    new aws.iam.RolePolicyAttachment(
      `${name}-secrets-manager-attachment`,
      {
        role: this.executionRole.name,
        policyArn: secretsManagerPolicy.arn,
      },
      { parent: this.executionRole },
    );

    this.iamRole = new aws.iam.Role(
      `${name}-task-role`,
      {
        assumeRolePolicy: aws.iam
          .getPolicyDocument({
            statements: [
              {
                actions: ['sts:AssumeRole'],
                principals: [
                  {
                    type: 'Service',
                    identifiers: ['ecs-tasks.amazonaws.com'],
                  },
                ],
              },
            ],
          })
          .then((doc) => doc.json),
        managedPolicyArns: [
          'arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy',
        ],

        tags: {
          ...commonTags,
          name: `${name}-task-role`,
        },
      },
      { parent: this },
    );

    this.taskDefinition = new aws.ecs.TaskDefinition(
      `${name}-task-def`,
      {
        family: `${name}-task`,
        networkMode: 'awsvpc',
        requiresCompatibilities: ['FARGATE'],
        cpu: '512',
        memory: '2048',
        executionRoleArn: this.executionRole.arn,
        taskRoleArn: this.iamRole.arn,
        containerDefinitions: pulumi.jsonStringify([
          {
            name: `${name}-container`,
            image: pulumi.interpolate`${args.ecrRepositoryUrl}:${args.ecrImageTag || 'latest'}`,
            essential: true,
            portMappings: [
              {
                containerPort: appPort,
                protocol: 'tcp',
              },
            ],
            environment: [
              {
                name: 'NODE_ENV',
                value: 'production',
              },
              {
                name: 'PORT',
                value: appPort.toString(),
              },
              {
                name: 'AWS_REGION',
                value: aws.config.region || 'us-east-1',
              },
            ],
            secrets: [
              {
                name: 'DATABASE_URL',
                valueFrom: pulumi.interpolate`${args.secretsManagerArn}:databaseUrl::`,
              },
              {
                name: 'JWT_SECRET',
                valueFrom: pulumi.interpolate`${args.secretsManagerArn}:jwtSecret::`,
              },
              {
                name: 'OPENAI_API_KEY',
                valueFrom: pulumi.interpolate`${args.secretsManagerArn}:openAiApiKey::`,
              },
            ],
            logConfiguration: {
              logDriver: 'awslogs',
              options: {
                'awslogs-group': `/ecs/${name}-task`,
                'awslogs-region': aws.config.region || 'us-east-1',
                'awslogs-stream-prefix': 'ecs',
              },
            },
            healthCheck: {
              command: [
                'CMD-SHELL',
                'wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1',
              ],
              interval: 30,
              timeout: 15,
              retries: 5,
              startPeriod: 180,
            },
          },
        ]),
        tags: {
          ...commonTags,
          name: `${name}-task-def`,
        },
      },
      { parent: this },
    );

    const logGroup = new aws.cloudwatch.LogGroup(
      `${name}-logs`,
      {
        name: `/ecs/${name}-task`,
        retentionInDays: 7,
        tags: {
          ...commonTags,
          name: `${name}-logs`,
        },
      },
      { parent: this },
    );

    this.service = new aws.ecs.Service(
      `${name}-service`,
      {
        name: `${name}-service`,
        cluster: this.cluster.id,
        taskDefinition: this.taskDefinition.arn,
        desiredCount: 1,
        launchType: 'FARGATE',
        networkConfiguration: {
          subnets: args.privateSubnetIds,
          securityGroups: [this.securityGroup.id],
          assignPublicIp: true,
        },
        loadBalancers: [
          {
            targetGroupArn: args.albTargetGroupArn,
            containerName: `${name}-container`,
            containerPort: appPort,
          },
        ],
        healthCheckGracePeriodSeconds: 300,
        deploymentMaximumPercent: 200,
        deploymentMinimumHealthyPercent: 100,
        waitForSteadyState: true,
        forceNewDeployment: true,
        tags: {
          ...commonTags,
          name: `${name}-service`,
        },
      },
      { parent: this },
    );

    this.registerOutputs({
      clusterId: this.cluster.id,
      serviceId: this.service.id,
      taskDefinitionArn: this.taskDefinition.arn,
      securityGroupId: this.securityGroup.id,
    });
  }
}

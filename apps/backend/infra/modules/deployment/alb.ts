import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { commonTags } from '../../configs/infrastructure';

export interface AlbModuleArgs {
  vpcId: pulumi.Input<string>;
  publicSubnetIds: pulumi.Input<string[]>;
  targetInstancePort: pulumi.Input<number>;
}

export class AlbModule extends pulumi.ComponentResource {
  public readonly alb: aws.lb.LoadBalancer;
  public readonly targetGroup: aws.lb.TargetGroup;
  public readonly listener: aws.lb.Listener;
  public readonly securityGroup: aws.ec2.SecurityGroup;
  public readonly albDnsName: pulumi.Output<string>;
  public readonly albZoneId: pulumi.Output<string>;
  public readonly listenerArn: pulumi.Output<string>;
  constructor(
    name: string,
    args: AlbModuleArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('expense-manager:infra:deployment:AlbModule', name, {}, opts);

    this.securityGroup = new aws.ec2.SecurityGroup(
      `${name}-sg`,
      {
        name: `${name}-sg`,
        description: 'Security Group for Application Load Balancer',
        vpcId: args.vpcId,
        ingress: [
          {
            protocol: 'tcp',
            fromPort: 80,
            toPort: 80,
            cidrBlocks: ['0.0.0.0/0'],
            description: 'Allow HTTP traffic from Internet',
          },
          {
            protocol: 'tcp',
            fromPort: 443,
            toPort: 443,
            cidrBlocks: ['0.0.0.0/0'],
            description: 'Allow HTTPS traffic from Internet',
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
          name: `${name}-sg`,
          ...commonTags,
        },
      },
      { parent: this },
    );

    this.alb = new aws.lb.LoadBalancer(
      `${name}-alb`,
      {
        name: `${name}-alb`,
        internal: false,
        loadBalancerType: 'application',
        securityGroups: [this.securityGroup.id],
        subnets: args.publicSubnetIds,
        enableDeletionProtection: false,
        tags: {
          name: `${name}-alb`,
          ...commonTags,
        },
      },
      { parent: this },
    );

    this.targetGroup = new aws.lb.TargetGroup(
      `${name}-tg`,
      {
        name: `${name}-tg`,
        port: args.targetInstancePort,
        protocol: 'HTTP',
        vpcId: args.vpcId,
        targetType: 'ip',
        healthCheck: {
          enabled: true,
          healthyThreshold: 2,
          interval: 30,
          matcher: '200',
          path: '/api/health',
          port: 'traffic-port',
          protocol: 'HTTP',
          timeout: 5,
          unhealthyThreshold: 2,
        },
        tags: {
          name: `${name}-tg`,
          ...commonTags,
        },
      },
      { parent: this },
    );

    this.listener = new aws.lb.Listener(
      `${name}-listener`,
      {
        loadBalancerArn: this.alb.arn,
        port: 80,
        protocol: 'HTTP',
        defaultActions: [
          {
            type: 'forward',
            targetGroupArn: this.targetGroup.arn,
          },
        ],
        tags: {
          name: `${name}-listener`,
          ...commonTags,
        },
      },
      { parent: this.targetGroup },
    );

    this.albDnsName = this.alb.dnsName;
    this.albZoneId = this.alb.zoneId;
    this.listenerArn = this.listener.arn;

    this.registerOutputs();
  }
}

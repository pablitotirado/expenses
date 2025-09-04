import * as pulumi from '@pulumi/pulumi';

import { VpcModule } from './modules/networking';
import { RdsModule } from './modules/database';
import {
  EcrModule,
  AlbModule,
  ApiGatewayModule,
  DockerBuildModule,
} from './modules/deployment';
import { CloudWatchModule } from './modules/monitoring';
import { SecretsManagerModule } from './modules/secrets';
import { FargateServiceModule } from './modules/compute/fargate';

import {
  dbName,
  dbUsername,
  dbPassword,
  jwtSecret,
  openAiApiKey,
  projectName,
  environment,
  commonTags,
} from './configs/infrastructure';

const vpc = new VpcModule('vpc', {});

const ecr = new EcrModule('ecr', {});

const buildTimestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, '-')
  .slice(0, 19);

const dockerBuild = new DockerBuildModule('docker-build', {
  ecrRepositoryUrl: ecr.repositoryUrl,
  ecrRegistryId: ecr.registryId,
  contextPath: '../../../',
  dockerfilePath: '../../../Dockerfile',
  imageTag: `build-${buildTimestamp}`,
});

const rds = new RdsModule('rds', {
  vpcId: vpc.vpc.id,
  privateSubnetIds: pulumi.all(vpc.privateSubnets.map((subnet) => subnet.id)),
  dbPassword,
});

const databaseUrl = pulumi.interpolate`postgresql://${dbUsername}:${dbPassword}@${rds.dbEndpoint}/${dbName}`;

const alb = new AlbModule('alb', {
  vpcId: vpc.vpc.id,
  publicSubnetIds: pulumi.all(vpc.publicSubnets.map((subnet) => subnet.id)),
  targetInstancePort: 3000,
});

const secretsManager = new SecretsManagerModule('secrets-manager', {
  secretName: `${projectName}-${environment}-secrets-for-app`,
  secretKeys: {
    databaseUrl: databaseUrl,
    jwtSecret: jwtSecret,
    openAiApiKey: openAiApiKey,
  },
  tags: commonTags,
});

const fargate = new FargateServiceModule(
  'fargate',
  {
    vpcId: vpc.vpc.id,
    privateSubnetIds: pulumi.all(vpc.privateSubnets.map((subnet) => subnet.id)),
    albTargetGroupArn: alb.targetGroup.arn,
    albSecurityGroupId: alb.securityGroup.id,
    secretsManagerArn: secretsManager.secretArn,
    ecrRepositoryUrl: ecr.repositoryUrl,
    ecrImageTag: dockerBuild.imageTag,
  },
  { dependsOn: [rds, secretsManager] },
);

const apiGateway = new ApiGatewayModule('api-gateway', {
  albDnsName: alb.albDnsName,
  albZoneId: alb.albZoneId,
  albListenerArn: alb.listenerArn,
  vpcId: vpc.vpc.id,
  privateSubnetIds: pulumi.all(vpc.privateSubnets.map((subnet) => subnet.id)),
});

const cloudWatch = new CloudWatchModule('cloudwatch', {
  ec2InstanceId: fargate.service.id,
  rdsInstanceId: rds.dbInstance.id,
});

export const vpcId = vpc.vpc.id;
export const vpcCidr = vpc.vpc.cidrBlock;
export const publicSubnetIds = vpc.publicSubnets.map((subnet) => subnet.id);
export const privateSubnetIds = vpc.privateSubnets.map((subnet) => subnet.id);

export const ecrRepositoryUrl = ecr.repositoryUrl;
export const ecrRepositoryName = ecr.repository.name;
export const ecrRegistryId = ecr.registryId;

export const dockerImageName = dockerBuild.imageName;
export const dockerImageTag = dockerBuild.imageTag;

export const rdsEndpoint = rds.dbEndpoint;
export const rdsPort = rds.dbPort;
export const rdsSecurityGroupId = rds.dbSecurityGroup.id;

export const fargateClusterId = fargate.cluster.id;
export const fargateServiceId = fargate.service.id;
export const fargateTaskDefinitionArn = fargate.taskDefinition.arn;
export const fargateSecurityGroupId = fargate.securityGroup.id;

export const albDnsName = alb.albDnsName;
export const albZoneId = alb.albZoneId;
export const albSecurityGroupId = alb.securityGroup.id;

export const apiGatewayUrl = apiGateway.apiUrl;
export const apiGatewayId = apiGateway.api.id;

export const cloudWatchLogGroupName = cloudWatch.logGroup.name;
export const cloudWatchDashboardName = cloudWatch.dashboard.dashboardName;

export const secretsManagerArn = secretsManager.secretArn;
export const secretsManagerName = secretsManager.secret.name;

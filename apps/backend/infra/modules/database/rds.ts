import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import {
  commonTags,
  projectName,
  dbInstanceClass,
  dbAllocatedStorage,
  dbName,
  dbUsername,
} from '../../configs/infrastructure';

export interface RdsModuleArgs {
  vpcId: pulumi.Input<string>;
  privateSubnetIds: pulumi.Input<string[]>;
  dbPassword: pulumi.Input<string>;
}

export class RdsModule extends pulumi.ComponentResource {
  public readonly dbInstance: aws.rds.Instance;
  public readonly dbSecurityGroup: aws.ec2.SecurityGroup;
  public readonly dbSubnetGroup: aws.rds.SubnetGroup;
  public readonly dbEndpoint: pulumi.Output<string>;
  public readonly dbPort: number = 5432;

  constructor(
    name: string,
    args: RdsModuleArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('expense-manager:infra:database:RdsModule', name, {}, opts);

    this.dbSecurityGroup = new aws.ec2.SecurityGroup(
      `${name}-db-sg`,
      {
        vpcId: args.vpcId,
        description: 'Security group for RDS PostgreSQL instance',
        ingress: [
          {
            protocol: 'tcp',
            fromPort: this.dbPort,
            toPort: this.dbPort,
            cidrBlocks: ['10.0.0.0/16'],
            description: 'Allow traffic from VPC on database port',
          },
          {
            protocol: 'tcp',
            fromPort: this.dbPort,
            toPort: this.dbPort,
            cidrBlocks: ['0.0.0.0/0'],
            description: 'Allow traffic from outside VPC on database port',
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
          name: `${name}-db`,
        },
      },
      { parent: this },
    );

    this.dbSubnetGroup = new aws.rds.SubnetGroup(
      `${name}-db-subnet-group`,
      {
        subnetIds: args.privateSubnetIds,
        tags: {
          ...commonTags,
          name: `${name}-db-subnet-group`,
        },
      },
      { parent: this },
    );

    this.dbInstance = new aws.rds.Instance(
      `${name}-db`,
      {
        engine: 'postgres',
        instanceClass: dbInstanceClass,
        allocatedStorage: dbAllocatedStorage,
        maxAllocatedStorage: dbAllocatedStorage * 2,
        dbName: dbName,
        username: dbUsername,
        password: args.dbPassword,
        skipFinalSnapshot: true,
        deletionProtection: false,
        backupRetentionPeriod: 7,
        backupWindow: '03:00-04:00',
        maintenanceWindow: 'sun:04:00-sun:05:00',
        dbSubnetGroupName: this.dbSubnetGroup.name,
        vpcSecurityGroupIds: [this.dbSecurityGroup.id],
        storageEncrypted: true,
        storageType: 'gp2',
        multiAz: false,
        publiclyAccessible: true,
        tags: {
          ...commonTags,
          name: `${projectName}-${name}-db`,
        },
      },
      { parent: this.dbSubnetGroup },
    );

    this.dbEndpoint = this.dbInstance.endpoint;

    this.registerOutputs();
  }
}

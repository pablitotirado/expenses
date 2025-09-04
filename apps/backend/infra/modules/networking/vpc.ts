import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import {
  commonTags,
  vpcCidr,
  publicSubnetCidrs,
  privateSubnetCidrs,
} from '../../configs/infrastructure';

export class VpcModule extends pulumi.ComponentResource {
  public readonly vpc: aws.ec2.Vpc;
  public readonly publicSubnets: aws.ec2.Subnet[];
  public readonly privateSubnets: aws.ec2.Subnet[];
  public readonly internetGateway: aws.ec2.InternetGateway;
  public readonly natGateway: aws.ec2.NatGateway;
  public readonly publicRouteTable: aws.ec2.RouteTable;
  public readonly privateRouteTable: aws.ec2.RouteTable;
  public readonly elasticIp: aws.ec2.Eip;

  constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
    super('expense-manager:infra:networking:VpcModule', name, {}, opts);

    this.vpc = new aws.ec2.Vpc(
      `${name}-vpc`,
      {
        cidrBlock: vpcCidr,
        enableDnsHostnames: true,
        enableDnsSupport: true,
        tags: {
          ...commonTags,
          name: `${name}-vpc`,
        },
      },
      { parent: this },
    );

    this.internetGateway = new aws.ec2.InternetGateway(
      `${name}-igw`,
      {
        vpcId: this.vpc.id,
        tags: {
          ...commonTags,
          name: `${name}-igw`,
        },
      },
      { parent: this.vpc },
    );

    this.publicSubnets = publicSubnetCidrs.map(
      (cidr, index) =>
        new aws.ec2.Subnet(
          `${name}-public-subnet-${index + 1}`,
          {
            vpcId: this.vpc.id,
            cidrBlock: cidr,
            availabilityZone: aws
              .getAvailabilityZones()
              .then((zones) => zones.names[index % zones.names.length]),
            mapPublicIpOnLaunch: true,
            tags: {
              ...commonTags,
              name: `${name}-public-subnet-${index + 1}`,
              type: 'public',
            },
          },
          { parent: this.vpc },
        ),
    );

    this.privateSubnets = privateSubnetCidrs.map(
      (cidr, index) =>
        new aws.ec2.Subnet(
          `${name}-private-subnet-${index + 1}`,
          {
            vpcId: this.vpc.id,
            cidrBlock: cidr,
            availabilityZone: aws
              .getAvailabilityZones()
              .then((zones) => zones.names[index % zones.names.length]),
            mapPublicIpOnLaunch: false,
            tags: {
              ...commonTags,
              name: `${name}-private-subnet-${index + 1}`,
              type: 'private',
            },
          },
          { parent: this.vpc },
        ),
    );

    this.elasticIp = new aws.ec2.Eip(
      `${name}-nat-eip`,
      {
        vpc: true,
        tags: {
          ...commonTags,
          name: `${name}-nat-eip`,
        },
      },
      { parent: this.vpc },
    );

    this.natGateway = new aws.ec2.NatGateway(
      `${name}-nat`,
      {
        allocationId: this.elasticIp.id,
        subnetId: this.publicSubnets[0].id,
        tags: {
          ...commonTags,
          name: `${name}-nat`,
        },
      },
      { parent: this.vpc, dependsOn: [this.internetGateway] },
    );

    this.publicRouteTable = new aws.ec2.RouteTable(
      `${name}-public-rt`,
      {
        vpcId: this.vpc.id,
        routes: [
          {
            cidrBlock: '0.0.0.0/0',
            gatewayId: this.internetGateway.id,
          },
        ],
        tags: {
          ...commonTags,
          name: `${name}-public-rt`,
        },
      },
      { parent: this.vpc },
    );

    this.privateRouteTable = new aws.ec2.RouteTable(
      `${name}-private-rt`,
      {
        vpcId: this.vpc.id,
        routes: [
          {
            cidrBlock: '0.0.0.0/0',
            natGatewayId: this.natGateway.id,
          },
        ],
        tags: {
          ...commonTags,
          name: `${name}-private-rt`,
        },
      },
      { parent: this.vpc },
    );

    this.publicSubnets.forEach((subnet, index) => {
      new aws.ec2.RouteTableAssociation(
        `${name}-public-rta-${index + 1}`,
        {
          subnetId: subnet.id,
          routeTableId: this.publicRouteTable.id,
        },
        { parent: this.publicRouteTable },
      );
    });

    this.privateSubnets.forEach((subnet, index) => {
      new aws.ec2.RouteTableAssociation(
        `${name}-private-rta-${index + 1}`,
        {
          subnetId: subnet.id,
          routeTableId: this.privateRouteTable.id,
        },
        { parent: this.privateRouteTable },
      );
    });

    this.registerOutputs();
  }
}

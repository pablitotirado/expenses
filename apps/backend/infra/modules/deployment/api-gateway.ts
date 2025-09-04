import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { commonTags, projectName } from '../../configs/infrastructure';

export interface ApiGatewayModuleArgs {
  albDnsName: pulumi.Input<string>;
  albZoneId: pulumi.Input<string>;
  albListenerArn: pulumi.Input<string>;
  vpcId: pulumi.Input<string>;
  privateSubnetIds: pulumi.Input<string[]>;
}

export class ApiGatewayModule extends pulumi.ComponentResource {
  public readonly api: aws.apigatewayv2.Api;
  public readonly vpcLink: aws.apigatewayv2.VpcLink;
  public readonly integration: aws.apigatewayv2.Integration;
  public readonly route: aws.apigatewayv2.Route;
  public readonly stage: aws.apigatewayv2.Stage;
  public readonly apiUrl: pulumi.Output<string>;

  constructor(
    name: string,
    args: ApiGatewayModuleArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('expense-manager:infra:deployment:ApiGatewayModule', name, {}, opts);

    this.api = new aws.apigatewayv2.Api(
      `${name}-api`,
      {
        protocolType: 'HTTP',
        name: `${projectName}-${name}-api`,
        description: 'HTTP API Gateway for Expense Manager Backend',
        corsConfiguration: {
          allowHeaders: ['*'],
          allowMethods: ['*'],
          allowOrigins: ['*'],
          exposeHeaders: ['*'],
          maxAge: 300,
        },
        tags: {
          ...commonTags,
          name: `${name}-api`,
        },
      },
      { parent: this },
    );

    this.vpcLink = new aws.apigatewayv2.VpcLink(
      `${name}-vpc-link`,
      {
        name: `${projectName}-${name}-vpc-link`,
        subnetIds: args.privateSubnetIds,
        securityGroupIds: [],
        tags: {
          ...commonTags,
          name: `${name}-vpc-link`,
        },
      },
      { parent: this.api },
    );

    this.integration = new aws.apigatewayv2.Integration(
      `${name}-integration`,
      {
        apiId: this.api.id,
        integrationType: 'HTTP_PROXY',
        integrationUri: args.albListenerArn,
        integrationMethod: 'ANY',
        connectionType: 'VPC_LINK',
        connectionId: this.vpcLink.id,
        requestParameters: {
          'overwrite:path': '/$request.path.proxy',
        },
      },
      { parent: this.vpcLink },
    );

    this.route = new aws.apigatewayv2.Route(
      `${name}-route`,
      {
        apiId: this.api.id,
        routeKey: 'ANY /{proxy+}',
        target: pulumi.interpolate`integrations/${this.integration.id}`,
      },
      { parent: this.integration },
    );

    this.stage = new aws.apigatewayv2.Stage(
      `${name}-stage`,
      {
        apiId: this.api.id,
        name: 'dev',
        autoDeploy: true,
        tags: {
          ...commonTags,
          name: `${name}-stage`,
        },
      },
      { parent: this.api },
    );

    this.apiUrl = pulumi.interpolate`${this.api.apiEndpoint}/${this.stage.name}`;

    this.registerOutputs();
  }
}

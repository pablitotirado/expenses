import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { commonTags, projectName } from '../../configs/infrastructure';

export interface CloudWatchModuleArgs {
  ec2InstanceId: pulumi.Input<string>;
  rdsInstanceId: pulumi.Input<string>;
}

export class CloudWatchModule extends pulumi.ComponentResource {
  public readonly logGroup: aws.cloudwatch.LogGroup;
  public readonly dashboard: aws.cloudwatch.Dashboard;

  constructor(
    name: string,
    args: CloudWatchModuleArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('expense-manager:infra:monitoring:CloudWatchModule', name, {}, opts);

    this.logGroup = new aws.cloudwatch.LogGroup(
      `${name}-logs`,
      {
        name: `/aws/ec2/${projectName}-backend`,
        retentionInDays: 30,
        tags: commonTags,
      },
      { parent: this },
    );

    this.dashboard = new aws.cloudwatch.Dashboard(
      `${name}-dashboard`,
      {
        dashboardName: `${projectName}-backend-dashboard`,
        dashboardBody: pulumi.interpolate`{
          "widgets": [
            {
              "type": "metric",
              "x": 0,
              "y": 0,
              "width": 12,
              "height": 6,
              "properties": {
                "metrics": [
                  ["AWS/EC2", "CPUUtilization", "InstanceId", "${args.ec2InstanceId}"],
                  [".", "NetworkIn", ".", "."],
                  [".", "NetworkOut", ".", "."]
                ],
                "period": 300,
                "stat": "Average",
                "region": "${aws.config.region}",
                "title": "EC2 Metrics"
              }
            },
            {
              "type": "metric",
              "x": 12,
              "y": 0,
              "width": 12,
              "height": 6,
              "properties": {
                "metrics": [
                  ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", "${args.rdsInstanceId}"],
                  [".", "DatabaseConnections", ".", "."],
                  [".", "FreeableMemory", ".", "."]
                ],
                "period": 300,
                "stat": "Average",
                "region": "${aws.config.region}",
                "title": "RDS Metrics"
              }
            }
          ]
        }`,
      },
      { parent: this },
    );

    this.registerOutputs();
  }
}

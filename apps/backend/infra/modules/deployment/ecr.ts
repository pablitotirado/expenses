import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { commonTags, projectName } from '../../configs/infrastructure';

export class EcrModule extends pulumi.ComponentResource {
  public readonly repository: aws.ecr.Repository;
  public readonly repositoryUrl: pulumi.Output<string>;
  public readonly registryId: pulumi.Output<string>;

  constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
    super('expense-manager:infra:deployment:EcrModule', name, {}, opts);

    this.repository = new aws.ecr.Repository(
      `${name}-repo`,
      {
        name: `${projectName}-${name}`,
        imageTagMutability: 'MUTABLE',
        imageScanningConfiguration: {
          scanOnPush: true,
        },
        encryptionConfigurations: [
          {
            encryptionType: 'AES256',
          },
        ],
        tags: {
          ...commonTags,
          name: `${name}-repo`,
        },
      },
      { parent: this },
    );

    this.repositoryUrl = this.repository.repositoryUrl;
    this.registryId = this.repository.registryId;

    new aws.ecr.LifecyclePolicy(
      `${name}-lifecycle`,
      {
        repository: this.repository.name,
        policy: JSON.stringify({
          rules: [
            {
              rulePriority: 1,
              description: 'Keep last 5 images',
              selection: {
                tagStatus: 'tagged',
                tagPrefixList: ['latest', 'v'],
                countType: 'imageCountMoreThan',
                countNumber: 5,
              },
              action: {
                type: 'expire',
              },
            },
          ],
        }),
      },
      { parent: this.repository },
    );

    this.registerOutputs();
  }
}

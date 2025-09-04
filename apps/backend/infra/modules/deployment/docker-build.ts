import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';
import * as aws from '@pulumi/aws';

export interface DockerBuildModuleArgs {
  ecrRepositoryUrl: pulumi.Input<string>;
  ecrRegistryId: pulumi.Input<string>;
  contextPath?: string;
  dockerfilePath?: string;
  imageTag?: string;
}

export class DockerBuildModule extends pulumi.ComponentResource {
  public readonly imageTag: pulumi.Output<string>;
  public readonly imageName: pulumi.Output<string>;

  constructor(
    name: string,
    args: DockerBuildModuleArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('custom:module:DockerBuildModule', name, {}, opts);

    const authToken = pulumi.output(args.ecrRegistryId).apply((registryId) =>
      aws.ecr.getAuthorizationToken({
        registryId: registryId,
      }),
    );
    const dockerImage = new docker.Image(
      `${name}-image`,
      {
        build: {
          context: args.contextPath ?? '../..',
          dockerfile: args.dockerfilePath ?? 'apps/backend/Dockerfile',
          args: {
            buildkitInlineCache: '1',
          },
        },
        imageName: pulumi.interpolate`${args.ecrRepositoryUrl}:${args.imageTag ?? 'latest'}`,
        registry: {
          server: pulumi.interpolate`${args.ecrRepositoryUrl}`,
          username: authToken.apply((token) => token.userName),
          password: authToken.apply((token) => token.password),
        },
      },
      { parent: this },
    );

    this.imageTag = pulumi.output(args.imageTag ?? 'latest');
    this.imageName = dockerImage.imageName;

    this.registerOutputs({
      imageTag: this.imageTag,
      imageName: this.imageName,
    });
  }
}

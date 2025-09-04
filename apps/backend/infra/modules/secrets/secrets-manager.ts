import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export interface SecretsManagerModuleArgs {
  secretName: string;
  secretKeys: {
    databaseUrl: pulumi.Output<string>;
    jwtSecret: pulumi.Output<string>;
    openAiApiKey: pulumi.Output<string>;
  };
  tags?: Record<string, string>;
}

export class SecretsManagerModule extends pulumi.ComponentResource {
  public readonly secret: aws.secretsmanager.Secret;
  public readonly secretVersion: aws.secretsmanager.SecretVersion;
  public readonly secretArn: pulumi.Output<string>;

  constructor(
    name: string,
    args: SecretsManagerModuleArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('custom:modules:SecretsManager', name, {}, opts);

    this.secret = new aws.secretsmanager.Secret(
      `${name}-secret-v4`,
      {
        name: args.secretName,
        description: `Secret for ${args.secretName}`,
        tags: args.tags || {},
      },
      { parent: this },
    );

    const secretValue = pulumi
      .all([
        args.secretKeys.databaseUrl,
        args.secretKeys.jwtSecret,
        args.secretKeys.openAiApiKey,
      ])
      .apply(([databaseUrl, jwtSecret, openAiApiKey]) => {
        return JSON.stringify({
          databaseUrl,
          jwtSecret,
          openAiApiKey,
        });
      });

    this.secretVersion = new aws.secretsmanager.SecretVersion(
      `${name}-secret-v4-version`,
      {
        secretId: this.secret.id,
        secretString: secretValue,
      },
      { parent: this },
    );

    this.secretArn = this.secret.arn;

    this.registerOutputs({
      secret: this.secret,
      secretVersion: this.secretVersion,
      secretArn: this.secretArn,
    });
  }
}

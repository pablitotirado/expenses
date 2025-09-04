import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config();

export const environment = config.get('environment') ?? 'dev';
export const projectName =
  config.get('projectName') ?? 'expense-manager-backend';

export const dbInstanceClass = config.get('dbInstanceClass') ?? 'db.t3.micro';
export const dbAllocatedStorage = config.getNumber('dbAllocatedStorage') ?? 20;
export const dbName = 'expense_manager';
export const dbUsername = 'expense_admin';
export const dbPassword = config.requireSecret('dbPassword');
export const jwtSecret = config.requireSecret('jwtSecret');
export const openAiApiKey = config.requireSecret('openAiApiKey');

export const appPort = 3000;

export const vpcCidr = '10.0.0.0/16';
export const publicSubnetCidrs = ['10.0.1.0/24', '10.0.2.0/24'];
export const privateSubnetCidrs = ['10.0.3.0/24', '10.0.4.0/24'];

export const commonTags = {
  project: projectName,
  environment: environment,
  managedBy: 'pulumi',
  owner: 'expense-manager-team',
};

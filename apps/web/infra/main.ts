import * as staticwebsite from '@pulumi/aws-static-website';

const website = new staticwebsite.Website('expenses-web', {
  sitePath: '../dist',
  withCDN: true,
  withLogs: false,
});

export const bucketName = website.bucketName;
export const bucketWebsiteUrl = website.websiteURL;
export const websiteUrl = website.cdnURL;

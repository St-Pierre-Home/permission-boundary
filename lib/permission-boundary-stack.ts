import * as cdk from "@aws-cdk/core";
import { Bucket, BlockPublicAccess, BucketEncryption } from "@aws-cdk/aws-s3";
import { CfnOutput, RemovalPolicy } from "@aws-cdk/core";
import { Effect, ManagedPolicy, PolicyStatement, User } from "@aws-cdk/aws-iam";
import iam = require("@aws-cdk/aws-iam");

export class PermissionBoundaryStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "testbucket", {
      bucketName: "stpierre-pb-2021",
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const pb_default = new ManagedPolicy(this, "pb-default", {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          resources: ["*"],
          actions: ["s3:*Object*", "s3:*List*"],
          conditions: {
            StringEquals: {
              "s3:RequestObjectTag/organization_guid":
                "${aws:PrincipalTag/organization_guid}",
            },
          },
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          resources: ["*"],
          actions: ["s3:*Object*", "s3:*List*"],
          conditions: {
            StringEquals: {
              "s3:ExistingObjectTag/organization_guid":
                "${aws:PrincipalTag/organization_guid}",
            },
          },
        }),
      ],
    });

    const userPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket",
        "s3:GetObjectTagging",
        "s3:PutObjectTagging",
        "s3:DeleteObject",
        "s3:GetObjectAcl",
        "s3:PutObjectAcl",
      ],
      resources: ["*"],
    });

    const user = new User(this, "MyUser", {
      permissionsBoundary: pb_default,
    });

    const accessKey = new iam.CfnAccessKey(this, "MyAccessKey", {
      userName: user.userName,
    });

    new CfnOutput(this, "accessKeyId", { value: accessKey.ref });
    new CfnOutput(this, "secretAccessKey", {
      value: accessKey.attrSecretAccessKey,
    });
    new CfnOutput(this, "bucket", { value: bucket.bucketName });

    user.addToPolicy(userPolicy);
    bucket.addToResourcePolicy(
      new PolicyStatement({
        principals: [user],
        resources: [bucket.arnForObjects("*")],
        actions: ["s3:DeleteObject"],
      })
    );
  }
}

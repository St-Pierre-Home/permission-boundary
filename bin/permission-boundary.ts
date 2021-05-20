#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PermissionBoundaryStack } from '../lib/permission-boundary-stack';
import { Tags } from '@aws-cdk/core';

const app = new cdk.App();
const myStack = new PermissionBoundaryStack(app, 'PermissionBoundaryStack');

Tags.of(myStack).add('organization_guid', '11a807b3-a96b-4a2d-bc23-ef9c3b2769b0');

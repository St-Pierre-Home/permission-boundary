#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PermissionBoundaryStack } from '../lib/permission-boundary-stack';

const app = new cdk.App();
new PermissionBoundaryStack(app, 'PermissionBoundaryStack');

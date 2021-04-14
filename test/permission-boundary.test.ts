import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as PermissionBoundary from '../lib/permission-boundary-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PermissionBoundary.PermissionBoundaryStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});

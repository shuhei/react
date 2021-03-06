/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactControlledComponent
 */

'use strict';

var invariant = require('invariant');

// Use to restore controlled state after a change event has fired.

var fiberHostComponent = null;

var ReactControlledComponentInjection = {
  injectFiberControlledHostComponent: function(hostComponentImpl) {
    // The fiber implementation doesn't use dynamic dispatch so we need to
    // inject the implementation.
    fiberHostComponent = hostComponentImpl;
  },
};

var needsRestoreState = false;

var ReactControlledComponent = {
  injection: ReactControlledComponentInjection,

  enqueueStateRestore() {
    needsRestoreState = true;
  },

  restoreStateIfNeeded(internalInstance) {
    if (!needsRestoreState) {
      return;
    }
    needsRestoreState = false;
    if (typeof internalInstance.tag === 'number') {
      invariant(
        fiberHostComponent &&
        typeof fiberHostComponent.restoreControlledState === 'function',
        'Fiber needs to be injected to handle a fiber target for controlled ' +
        'events.'
      );
      fiberHostComponent.restoreControlledState(internalInstance);
    }
    invariant(
      typeof internalInstance.restoreControlledState === 'function',
      'The internal instance must be a React host component.'
    );
    // If it is not a Fiber, we can just use dynamic dispatch.
    internalInstance.restoreControlledState();
  },
};

module.exports = ReactControlledComponent;

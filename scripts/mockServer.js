'use strict';

const { report } = require('../tests/config');
const fs = require('fs');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// Ensure environment variables are read.
require('../config/env');

const execSync = require('child_process').execSync;
const argv = process.argv.slice(2);

// build cucumber executive command
const mockServer = 'node --require @babel/register tests/mockServer/mock.js';

function runCrossPlatform() {
    try {
        execSync(mockServer);
        return true;
    } catch (e) {
        return false;
    }
}

// cucumber
runCrossPlatform();

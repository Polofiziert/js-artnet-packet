// These test should try to use the basic ArtNetPacket objects and test their functions
// It looks if vales are returned without errors and if they are as expected
// for futher infos https://nodejs.org/en/learn/test-runner/using-test-runner
// and https://nodejs.org/api/test.html#subtests

const assert = require('node:assert');
const test = require('node:test');
const describe = test.describe
const it = test.it
const before = test.before
const after = test.after

const { Buffer } = require('node:buffer');
const util = require('util');
const dgram = require('node:dgram')


const { jap } = require("../../jap")

describe('artnetProtocol Object sends Correctly', (t) => {

})
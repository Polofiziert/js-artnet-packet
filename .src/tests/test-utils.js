/**
 * Test utilities and helpers
 */

const assert = require('assert');

class TestRunner {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(description, testFn) {
    this.tests.push({ description, testFn });
  }

  async run() {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  ${this.name}`);
    console.log(`${'='.repeat(60)}\n`);

    for (const { description, testFn } of this.tests) {
      try {
        await testFn();
        console.log(`✓ ${description}`);
        this.passed++;
      } catch (err) {
        console.log(`✗ ${description}`);
        console.log(`  Error: ${err.message}`);
        this.failed++;
      }
    }

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Results: ${this.passed} passed, ${this.failed} failed`);
    console.log(`${'─'.repeat(60)}\n`);

    return this.failed === 0;
  }
}

function assertEqual(actual, expected, message) {
  assert.strictEqual(actual, expected, message);
}

function assertBuffer(actual, expected, message) {
  assert(Buffer.isBuffer(actual), 'Actual must be a Buffer');
  assert(Buffer.isBuffer(expected), 'Expected must be a Buffer');
  assert(actual.equals(expected), message || `Buffers not equal: ${actual.toString('hex')} !== ${expected.toString('hex')}`);
}

function assertBufferLength(buffer, length, message) {
  assert(Buffer.isBuffer(buffer), 'Must be a Buffer');
  assert.strictEqual(buffer.length, length, message || `Buffer length ${buffer.length} !== ${length}`);
}

function assertThrows(fn, message) {
  try {
    fn();
    throw new Error(message || 'Expected function to throw');
  } catch (err) {
    if (err.message === (message || 'Expected function to throw')) {
      throw err;
    }
    // Expected error was thrown
  }
}

function assertInstanceOf(obj, constructor, message) {
  assert(obj instanceof constructor, message || `Expected instance of ${constructor.name}`);
}

module.exports = {
  TestRunner,
  assertEqual,
  assertBuffer,
  assertBufferLength,
  assertThrows,
  assertInstanceOf,
};

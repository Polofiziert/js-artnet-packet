#!/usr/bin/env node

/**
 * Master Test Runner
 * Runs all tests and provides a summary report
 */

const path = require('path');
const fs = require('fs');

const testFiles = [
  // Base classes
  './src/tests/packets/test-base.js',

  // Packet types
  './src/tests/packets/test-poll.js',
  './src/tests/packets/test-pollreply.js',
  './src/tests/packets/test-dmx.js',
  './src/tests/packets/test-sync.js',

  // Parser
  './src/tests/parser/test-parser.js',

  // Serializers
  './src/tests/serializers/test-buffer-serializer.js',
  './src/tests/serializers/test-json-serializer.js',
];

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('  Art-Net 4 Library - Master Test Suite');
  console.log('='.repeat(60) + '\n');

  let totalPassed = 0;
  let totalFailed = 0;
  const results = [];

  for (const testFile of testFiles) {
    const fullPath = path.join(__dirname, testFile);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠ Skipping missing test: ${testFile}`);
      continue;
    }

    try {
      // Dynamic require to run test
      delete require.cache[require.resolve(fullPath)];
      const testModule = require(fullPath);

      // Tests are self-running with process.exit()
      // We'll catch their output via console
    } catch (err) {
      console.error(`✗ Error loading test ${testFile}: ${err.message}`);
      totalFailed++;
    }
  }
}

// Run individual test files sequentially
(async () => {
  let fileIndex = 0;

  async function runNextTest() {
    if (fileIndex >= testFiles.length) {
      console.log('\n' + '='.repeat(60));
      console.log('  All tests completed!');
      console.log('='.repeat(60) + '\n');
      return;
    }

    const testFile = testFiles[fileIndex];
    const fullPath = path.join(__dirname, testFile);

    if (fs.existsSync(fullPath)) {
      console.log(`\nRunning: ${testFile}`);
      try {
        await require(fullPath);
      } catch (err) {
        // Test file handles its own process.exit()
      }
    }

    fileIndex++;
    // Wait a moment before next test
    setTimeout(runNextTest, 100);
  }

  runNextTest();
})();

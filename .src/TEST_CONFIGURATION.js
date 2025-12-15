/**
 * Test Package.json scripts configuration
 * 
 * Add these to your package.json scripts section:
 * 
 * "scripts": {
 *   "test": "node run-tests.js",
 *   "test:base": "node src/tests/packets/test-base.js",
 *   "test:poll": "node src/tests/packets/test-poll.js",
 *   "test:pollreply": "node src/tests/packets/test-pollreply.js",
 *   "test:dmx": "node src/tests/packets/test-dmx.js",
 *   "test:sync": "node src/tests/packets/test-sync.js",
 *   "test:parser": "node src/tests/parser/test-parser.js",
 *   "test:serializers": "node src/tests/serializers/test-buffer-serializer.js && node src/tests/serializers/test-json-serializer.js"
 * }
 */

// Example for quick copy-paste:
const exampleScripts = {
  "test": "node run-tests.js",
  "test:base": "node src/tests/packets/test-base.js",
  "test:poll": "node src/tests/packets/test-poll.js",
  "test:pollreply": "node src/tests/packets/test-pollreply.js",
  "test:dmx": "node src/tests/packets/test-dmx.js",
  "test:sync": "node src/tests/packets/test-sync.js",
  "test:parser": "node src/tests/parser/test-parser.js",
  "test:serializers": "node src/tests/serializers/test-buffer-serializer.js && node src/tests/serializers/test-json-serializer.js"
};

module.exports = exampleScripts;

// These test should try to use the basic ArtNetPacket objects and test their functions
// It looks if vales are returned without errors and if they are as expected
// for futher infos https://nodejs.org/en/learn/test-runner/using-test-runner
// and https://nodejs.org/api/test.html#subtests

const assert = require('node:assert');
const test = require('node:test');

const { Buffer } = require('node:buffer');
const dgram = require('node:dgram')


const { jap } = require("../../jap")

test('jap wrapper Object works Correctly', (t) => {
    t.test('init of jap obj works corectly', (t) => {
        let actualJap = new jap
        let expectedJap = { 
            id: 'Art-Net' 
        }
        
        assert.deepEqual(actualJap, expectedJap)
    });

    t.test('createArtnetProtocol function works corectly', (t) => {
        t.test('create with owned Socket', (t) => {
            let justArtnet = new jap

            // this should work with no problem
            let artnetProtocol = justArtnet.createArtNetProtocol({
                host: "127.0.0.1", 
                port: 6454,
            })
        });

        t.test('create with owned Socket | wrong ip 127.0.1', (t) => {
            let justArtnet = new jap
            let options = {
                host: "127.0.1",  // => this is a malformed IP-Address
                port: 6454,
            }
            
            // should throw an error
            assert.throws(
            () => {
                justArtnet.createArtNetProtocol(options) 
            },
            {
                name: "ArtNetConfigurationError",
                message: "IpAddress not set correct! expected: {host:x.x.x.x}",
            }
            )

        });

        t.test('create with owned Socket | wrong ip 127.0.E.1', (t) => {
            let justArtnet = new jap
            let options = {
                host: "127.0.E.1",  // => this is a malformed IP-Address
                port: 6454,
            }
            
            // should throw an error
            assert.throws(
            () => {
                justArtnet.createArtNetProtocol(options) 
            },
            {
                name: "ArtNetConfigurationError",
                message: "IpAddress not set correct! expected: {host:x.x.x.x}",
            }
            )

        });

        t.test('create with owned Socket | missing ip', (t) => {
            let justArtnet = new jap
            let options = {
                port: 6454,
            }
            
            // should throw an error
            assert.throws(
            () => {
                justArtnet.createArtNetProtocol(options) 
            },
            {
                name: "ArtNetConfigurationError",
                message: "Options not set correct! expected: {host, port}",
            }
            )

        });

        t.test('create with owned Socket | wrong port 66666', (t) => {
            let justArtnet = new jap
            let options = {
                host: "127.0.0.1", 
                port: 66666, // => this is a malformed port
            }
            
            // should throw an error
            assert.throws(
            () => {
                justArtnet.createArtNetProtocol(options) 
            },
            {
                name: "ArtNetConfigurationError",
                message: "Port not set correct! expected: 0-65535",
            }
            )

        });

        t.test('create with owned Socket | wrong port 6bb66', (t) => {
            let justArtnet = new jap
            let options = {
                host: "127.0.0.1", 
                port: "6bb66", // => this is a malformed port
            }
            
            // should throw an error
            assert.throws(
            () => {
                justArtnet.createArtNetProtocol(options) 
            },
            {
                name: "ArtNetConfigurationError",
                message: "Port not set correct! expected: 0-65535",
            }
            )

        });

        t.test('create with owned Socket | missing', (t) => {
            let justArtnet = new jap
            let options = {
                host: "127.0.0.1", 
            }
            
            // should throw an error
            assert.throws(
            () => {
                justArtnet.createArtNetProtocol(options) 
            },
            {
                name: "ArtNetConfigurationError",
                message: "Options not set correct! expected: {host, port}",
            }
            )

        });

        t.test('create with given Socket', (t) => {
            let socket = dgram.createSocket('udp4')
            let justArtnet = new jap

            // this should work with no problem
            let artnetProtocol = justArtnet.createArtNetProtocol({socket})
        });

    });
});
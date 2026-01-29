// These test should try to use the basic ArtNetPacket objects and test their functions
// It looks if vales are returned without errors and if they are as expected
// for futher infos https://nodejs.org/en/learn/test-runner/using-test-runner
// and https://nodejs.org/api/test.html#subtests

const assert = require('node:assert');
const test = require('node:test');

const { Buffer } = require('node:buffer');
const dgram = require('node:dgram')


const { jap } = require("../../jap")

test('artnetProtocol Object works Correctly', (t) => {
    t.test('create with owned Socket', (t) => {
        let justArtnet = new jap
        // this should work with no problem
        let artnetProtocol = justArtnet.createArtNetProtocol({
            host: "127.0.0.1", 
            port: 6454,
        })
    });

    t.test('bind and close', (t) => {
        let justArtnet = new jap
        // this should work with no problem
        let artnetProtocol = justArtnet.createArtNetProtocol({
            host: "127.0.0.1", 
            port: 6454,
        })

        artnetProtocol.bind()
        artnetProtocol.on('listening', ()=>{
            artnetProtocol.close();
        });
    });

    t.test('bind and close', (t) => {
        let justArtnet = new jap
        // this should work with no problem
        let artnetProtocol = justArtnet.createArtNetProtocol({
            host: "127.0.0.1", 
            port: 6454,
        })

        artnetProtocol.bind()
        artnetProtocol.on('listening', ()=>{
            artnetProtocol.close();
        });
    });

});
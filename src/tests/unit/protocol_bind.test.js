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

describe('inspect bound protocolObj and bound socketObj', () => {

    let socket = dgram.createSocket('udp4')
    let justArtnet = new jap

    let options = {
        address: '127.0.0.1',
        port: 6454,
    } 

    let artnetProtocol = justArtnet.createArtNetProtocol({socket})

    before((t, done)=>{
        artnetProtocol.on("listening", ()=>{
            console.log("protocol listening")
            done()
        })
        artnetProtocol.on("error", (err)=>{
            done(err)
        })
        socket.on("error", (err)=>{
            done(err)
        })
        socket.on("listening", () => {
            console.log("socket listening")
            artnetProtocol.bind()
        })
        socket.bind(options)
    })
    
    after((t, done) => {
        socket.on("close", ()=>{
            console.log("socket close")
            done()
        })
        artnetProtocol.on("close", ()=>{
            console.log("protocol close")
            socket.close()
        })
        artnetProtocol.close()
    })

    it('should work', () => {
        console.log(5)
        assert.strictEqual(3, 3);
    });

    it('bound protocolObj: socketObj shoul have Listeners', (t) => {
        it('has close Listener', (t) => {
            let actual = util.inspect(socket.listeners('close'))
            let expectet = "[ [Function: bound _closeEmitHandler] ]"
                        
            // Socket should have no Listeners
            assert.deepEqual(actual, expectet)
        });
        it('has message Listener', (t) => {
            let actual = util.inspect(socket.listeners('message'))
            let expectet = "[ [Function: bound _msgEmitHandler] ]"
                        
            // Socket should have no Listeners
            assert.deepEqual(actual, expectet)
        });
        it('has error Listener', (t) => {
            let actual = util.inspect(socket.listeners('error'))
            let expectet = "[ [Function: bound _errorEmitHandler] ]"
                        
            // Socket should have no Listeners
            assert.deepEqual(actual, expectet)
        });

    });
});
    
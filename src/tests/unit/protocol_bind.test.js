// These test should try to use the basic ArtNetPacket objects and test their functions
// It looks if vales are returned without errors and if they are as expected
// for futher infos https://nodejs.org/en/learn/test-runner/using-test-runner
// and https://nodejs.org/api/test.html#subtests

const assert = require('node:assert');
const test = require('node:test');

const { Buffer } = require('node:buffer');
const util = require('util');
const dgram = require('node:dgram')


const { jap } = require("../../jap")

test('artnetProtocol Object works Correctly', (t) => {

    t.test('with own Socket', (t) => {

        t.test('create', (t) => {
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

    t.test('with given Socket', (t) => {

        t.test('create', (t) => {
            let socket = dgram.createSocket('udp4')
            let justArtnet = new jap

            // this should work with no problem
            let artnetProtocol = justArtnet.createArtNetProtocol({socket})
        });

        t.test('bind and close', (t) => {
            let socket = dgram.createSocket('udp4')
            let justArtnet = new jap

            let options = {
                address: 'localhost',
                port: 6454,
            } 

            let artnetProtocol = justArtnet.createArtNetProtocol({socket})

            socket.on('listening', ()=>{
                console.log("socket listening")
                artnetProtocol.bind()
            });
            socket.on('close', ()=>{
                console.log("socket close")
            });
            artnetProtocol.on('listening', ()=>{
                console.log("protocol listening")
                artnetProtocol.close();
            });
            artnetProtocol.on('close', ()=>{
                console.log("protocol close")
                socket.close();
            });
            
            socket.bind(options)
        });

        t.test('inspect bound protocol and socket', (t) => {
            let socket = dgram.createSocket('udp4')
            let justArtnet = new jap

            let options = {
                address: 'localhost',
                port: 6454,
            } 

            let artnetProtocol = justArtnet.createArtNetProtocol({socket})
            

            t.test('bind and close', (t) => {
                socket.on('listening', ()=>{
                    console.log("socket listening")
                    let actualCloseListener = util.inspect(socket.listeners('close'))
                    let expectetCloseListener = "[ [Function (anonymous)], [Function: bound _closeEmitHandler] ]"


                    assert.deepEqual(actualCloseListener, expectetCloseListener)
                    artnetProtocol.bind()
                });
                socket.on('close', ()=>{
                    console.log("socket close")
                });
                artnetProtocol.on('listening', ()=>{
                    console.log("protocol listening")
                    artnetProtocol.close();
                });
                artnetProtocol.on('close', ()=>{
                    console.log("protocol close")
                    socket.close();
                });
                
                socket.bind(options)
            });
        });

    });

});
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

describe('artnetProtocol Object binds Correctly', (t) => {

    describe('with own Socket', (t) => {

        it('create', (t) => {
            let justArtnet = new jap
            // this should work with no problem
            let artnetProtocol = justArtnet.createArtNetProtocol({
                host: "127.0.0.1", 
                port: 6454,
            })
        });

        it('bind', (t) => {
            let justArtnet = new jap
            // this should work with no problem
            let artnetProtocol = justArtnet.createArtNetProtocol({
                host: "127.0.0.1", 
                port: 6454,
            })

            artnetProtocol.on('listening', ()=>{
                artnetProtocol.close();
            });
            artnetProtocol.on('error', (e)=>{
                throw e
            });
            artnetProtocol.bind()
        });

        it('close', (t, done) => {
            let justArtnet = new jap
            // this should work with no problem
            let artnetProtocol = justArtnet.createArtNetProtocol({
                host: "127.0.0.1", 
                port: 6454,
            })

            artnetProtocol.on('listening', ()=>{
                artnetProtocol.close();
            });
            artnetProtocol.on('error', (e)=>{
                done(e)
            });
            artnetProtocol.on('close', ()=>{
                done()
            });
            artnetProtocol.bind()
        });

        describe('inspect unbound protocolObj', (t) => {
            let justArtnet = new jap

            let options = {
                host: "127.0.0.1", 
                port: 6454,
            } 

            let artnetProtocol = justArtnet.createArtNetProtocol(options)

            before( (t)=> {
                // console.log("unbound protocolObj: opening socket")
                //artnetProtocol.bind()
            })

            describe('unbound protocolObj: obj should not be receiving', (t) => {
                it('is not receiving', (t) => {
                        let actual = artnetProtocol.receiving;
                        let expected = false;

                        // Socket should have no Listeners
                        assert.deepEqual(actual, expected)
                });
                it('is owning socket', (t) => {
                        let actual = artnetProtocol.ownsSocket;
                        let expected = true;

                        // Socket should have no Listeners
                        assert.deepEqual(actual, expected)
                });
                it('know host ip for socket', (t) => {
                        let actual = artnetProtocol.host;
                        let expected = "127.0.0.1";

                        // Socket should have no Listeners
                        assert.deepEqual(actual, expected)
                });
                it('knows port for socket', (t) => {
                        let actual = artnetProtocol.port;
                        let expected = 6454;

                        // Socket should have no Listeners
                        assert.deepEqual(actual, expected)
                });
            });

            after( (t) => {
                // console.log("unbound protocolObj: closing socket")
                //artnetProtocol.close()
            })
        });

        describe('inspect bound protocolObj', () => {
        
            let justArtnet = new jap
        
            let options = {
                host: '127.0.0.1',
                port: 6454,
            } 
        
            let artnetProtocol = justArtnet.createArtNetProtocol(options)
        
            before((t, done)=>{
                artnetProtocol.on("listening", ()=>{
                    // console.log("protocol listening")
                    done()
                })
                artnetProtocol.on("error", (err)=>{
                    done(err)
                })
                artnetProtocol.bind()
            })
            
            after((t, done) => {
                artnetProtocol.on("close", ()=>{
                    // console.log("socket close")
                    done()
                })
                artnetProtocol.close()
            })
        
            it('bound protocolObj: socketObj shoul have Listeners', (t) => {
                it('has close Listener', (t) => {
                    let actual = util.inspect(artnetProtocol.socket.listeners('close'))
                    let expectet = "[ [Function: bound _closeEmitHandler] ]"
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
                it('has message Listener', (t) => {
                    let actual = util.inspect(artnetProtocol.socket.listeners('message'))
                    let expectet = "[ [Function: bound _msgEmitHandler] ]"
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
                it('has error Listener', (t) => {
                    let actual = util.inspect(artnetProtocol.socket.listeners('error'))
                    let expectet = "[ [Function: bound _errorEmitHandler] ]"
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
        
            });
        
            it('bound protocolObj: obj should be receiving', (t) => {
                it('is receiving', (t) => {
                    let actual = artnetProtocol.receiving
                    let expectet = true
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
                
                it('is owning socket', (t) => {
                    let actual = artnetProtocol.ownsSocket
                    let expectet = true
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
        
                it('knows ip from socket', (t) => {
                    let actual = artnetProtocol.host
                    let expectet = "127.0.0.1"
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
        
                it('knows port from socket', (t) => {
                    let actual = artnetProtocol.port
                    let expectet = 6454
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
                
            });
        });

    });

    describe('with given Socket', (t) => {

        it('create', (t) => {
            let socket = dgram.createSocket('udp4')
            let justArtnet = new jap

            // this should work with no problem
            let artnetProtocol = justArtnet.createArtNetProtocol({socket})
        });

        it('bind and close', (t) => {
            let socket = dgram.createSocket('udp4')
            let justArtnet = new jap

            let options = {
                address: 'localhost',
                port: 6454,
            } 

            let artnetProtocol = justArtnet.createArtNetProtocol({socket})

            socket.on('listening', ()=>{
                // console.log("socket listening")
                artnetProtocol.bind()
            });
            socket.on('close', ()=>{
                // console.log("socket close")
            });
            artnetProtocol.on('listening', ()=>{
                // console.log("protocol listening")
                artnetProtocol.close();
            });
            artnetProtocol.on('close', ()=>{
                // console.log("protocol close")
                socket.close();
            });
            
            socket.bind(options)
        });

        describe('inspect unbound protocolObj and bound socketObj', (t) => {
            let socket = dgram.createSocket('udp4')
            let justArtnet = new jap

            let options = {
                address: 'localhost',
                port: 6454,
            } 

            let artnetProtocol = justArtnet.createArtNetProtocol({socket})

            before( (t)=> {
                // console.log("unbound protocolObj: opening socket")
                socket.bind(options)
            })

            describe('unbound protocolObj: socketObj has no Listeners', (t) => {
                it('no close Listener', (t) => {
                        let actualCloseListener = util.inspect(socket.listeners('close'))
                        let expectetCloseListener = "[]"
                        
                        // Socket should have no Listeners
                        assert.deepEqual(actualCloseListener, expectetCloseListener)
                });
                it('no message Listener', (t) => {
                        let actualMsgListener = util.inspect(socket.listeners('message'))
                        let expectetMsgListener = "[]"                        
                                            
                        // Socket should have no Listeners
                        assert.deepEqual(actualMsgListener, expectetMsgListener)
                });

                it('no error Listener', (t) => {
                        let actualErrorListener = util.inspect(socket.listeners('error'))
                        let expectetErrorListener = "[]"
                        
                        // Socket should have no Listeners
                        assert.deepEqual(actualErrorListener, expectetErrorListener)
                });

                it('no listening Listener', (t) => {
                        let actualListeningListener = util.inspect(socket.listeners('listening'))
                        let expectetListeningListener = "[]"
                        
                        // Socket should have no Listeners
                        assert.deepEqual(actualListeningListener, expectetListeningListener)
                });
            });

            describe('unbound protocolObj: obj should not be receiving', (t) => {
                it('is not receiving', (t) => {
                        let actual = artnetProtocol.receiving;
                        let expected = 0;

                        // Socket should have no Listeners
                        assert.deepEqual(actual, expected)
                });
                it('is not owning socket', (t) => {
                        let actual = artnetProtocol.ownsSocket;
                        let expected = false;

                        // Socket should have no Listeners
                        assert.deepEqual(actual, expected)
                });
                it('doesnt know ip from socket', (t) => {
                        let actual = artnetProtocol.host;
                        let expected = null;

                        // Socket should have no Listeners
                        assert.deepEqual(actual, expected)
                });
                it('doesnt knows port from socket', (t) => {
                        let actual = artnetProtocol.port;
                        let expected = null;

                        // Socket should have no Listeners
                        assert.deepEqual(actual, expected)
                });
            });

            after( (t) => {
                // console.log("unbound protocolObj: closing socket")
                socket.close()
            })
        });

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
                    // console.log("protocol listening")
                    done()
                })
                artnetProtocol.on("error", (err)=>{
                    done(err)
                })
                socket.on("error", (err)=>{
                    done(err)
                })
                socket.on("listening", () => {
                    // console.log("socket listening")
                    socket.removeAllListeners()
                    artnetProtocol.bind()
                })
                socket.bind(options)
            })
            
            after((t, done) => {
                socket.on("close", ()=>{
                    // console.log("socket close")
                    done()
                })
                artnetProtocol.on("close", ()=>{
                    // console.log("protocol close")
                    socket.close()
                })
                artnetProtocol.close()
            })
        
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
        
            it('bound protocolObj: obj should be receiving', (t) => {
                it('is receiving', (t) => {
                    let actual = artnetProtocol.receiving
                    let expectet = true
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
                
                it('is not owning socket', (t) => {
                    let actual = artnetProtocol.ownsSocket
                    let expectet = false
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
        
                it('knows ip from socket', (t) => {
                    let actual = artnetProtocol.host
                    let expectet = "127.0.0.1"
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
        
                it('knows port from socket', (t) => {
                    let actual = artnetProtocol.port
                    let expectet = 6454
                                
                    // Socket should have no Listeners
                    assert.deepEqual(actual, expectet)
                });
                
            });
        });
    })
})


    
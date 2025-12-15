// AT = ArtNet

// Port-Address: 
// one of the 32,768 possible addresses to which a DMX frame can be
// directed. The Port-Address is a 15-bit number composed of Net+Sub-Net+Universe.
// 1 Sub-Net = 16 Universes
// 1 Net = 16 Sub-Nets
// => 1 Net = 16 x 16 = 256 Universes
// 0 111111      1111        1111
//    Net  +    Sub-Net +    Universe


// Port: 
// Actual data transmission on Art-Net uses the UDP protocol that operates ‘on top
// of’ the TCP/IP protocol. UDP data transfer operates by transferring data from a specific
// IP:Port on a Node or Controller to a second specific IP:Port on a second Node or
// Controller. Art-Net uses only one port of 0x1936.
AT_PORT = 6454; // Hex: 0x1936

// Directed Broadcast: 
// When a network first connects, the Controller does not know the
// number of Nodes on the network, nor does it know their IP addresses. The Directed
// broadcast address allows the Controller to send an ArtPoll to all Nodes on the network.
AT_DIRECT_BROADCAST_IP = "255.255.255.255";

// Limited Broadcast: 
// Art-Net packets should not be broadcast to the Limited Broadcast
// address of 255.255.255.255.
AT_DIRECT_BROADCAST_IP = net + ".255"


// The Controller may assume a maximum timeout of 3 seconds between sending ArtPoll 
// and receiving all ArtPollReply packets. If the Controller does not receive a response in 
// this time, it should consider the Node to have disconnected.
AT_ARTPOLL_TIMEOUT = 2.5 // 2.5sec

// The Controller that broadcasts an ArtPoll should also reply to its own message (by
// unicast) with an ArtPollReply. It is a requirement of Art-Net that all controllers broadcast
// an ArtPoll every 2.5 to 3 seconds. This ensures that any network devices can easily detect
// a disconnect.
AT_ARTPOLL_RYTHM = 2.5 // 2.5sec

// However, an input that is active but not changing, will re-transmit the last valid ArtDmx 
// packet at approximately 4-second intervals. (Note. In order to converge the needs of Art-
// Net and sACN it is recommended that Art-Net devices actually use a re-transmit time of 
// 800mS to 1000mS)
AT_ARTDMX_NC_RYTHM = 4 // 4sec

// If either (but not both) sources of ArtDmx stop, the failed source is held in the 
// merge buffer for 10 seconds. If, during the 10 second timeout, the failed source 
// returns, Merge mode continues. If the failed source does not recover, at the 
// end of the timeout period, the Node exits Merge mode
AT_ARTDMX_MERGE_TIMEOUT = 10 // 10sec

// In order to allow transition between synchronous and non-synchronous modes, a node 
// shall time out to non-synchronous operation if an ArtSync is not received for 4 seconds 
// or more.
AT_ARTSYNC_TIMEOUT = 4 // 4sec

// The controller allows a 30 second maximum delay for reception of the 
// ArtFirmwareReply.
AT_ARTFIRMWAREREPLY_TIMEOUT = 30 // 30sec

//Most Art-Net compliant equipment will provide some level of status indication. The 
// following format is suggested: Power LED (Pow), Communicatin LED (Com), DMX512 LED (DMX x)
// On if any Art-Net packets detected on 
// network, timeout after 6 seconds.
AT_DISPLAYOFSTATUS_COM_TIMEOUT = 6 // 6sec

// On if receiving ArtDmx for this 
// output. Timeout after 6 seconds.
AT_DISPLAYOFSTATUS_DMX_TIMEOUT = 6 // 6sec
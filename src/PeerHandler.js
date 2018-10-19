import SimplePeer from 'simple-peer';

let Peer;
export function createPeer() {
  Peer = new SimplePeer({ initiator: false, trickle: false });
  Peer.on('connect', function () {
    console.log('CONNECT')
    Peer.send('whatever' + Math.random())
  });
}

export { Peer };
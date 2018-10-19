const Hapi = require('hapi');
const inert = require('inert');
const socketIO = require('socket.io');
const generate = require('nanoid/generate');

const server = new Hapi.Server({
    host: 'localhost',
    port: 5000
});
const plugins = [inert];

let objOffers = {};

const start = async () => {
    await server.register(plugins);
    let io = socketIO(server.listener);
    io.on('connection', function (socket) {
        console.log('connection aaya');
        socket.emit('ready');

        // when offer received from initiator
        socket.on('offer', function (offerData, fn) {
            let peerId = offerData.peerId;            
            if(!peerId) {
                // generate new peer id
                peerId = generate('1234567890ABCDEF', 8) //=> "4f90d13a42"
                if(objOffers[peerId]) {
                    peerId = generate('1234567890ABCDEF', 10)
                }
            }
            
            objOffers[peerId] = {
                clientId: socket.id,
                offerData: offerData
            };
            console.log('got offer from: ' + peerId);
            fn({ id: peerId });
        });

        // when request received for offer 
        socket.on('DO_I_HAVE_A_OFFER', function (data, fn) {
          let peerId = data.peerId;

          if(!peerId) {
            return fn({ status: '400' });
          }

          if(!objOffers[peerId]) {
            return fn({ status: '404', data: peerId, objOffers: objOffers });
          }

          return fn(objOffers[peerId]);
        });

        socket.on('I_HAVE_AN_ANSWER', function(data, fn) {
          let socketId = objOffers[data.peerId].clientId;
          io.to(socketId).emit('I_HAVE_AN_ANSWER', data.answer);
        });
    });

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
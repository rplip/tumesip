var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent');



app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

let words = {};
let increment = 0;
let wordsInArray = [];
let players = {};
let i = 0;

io.sockets.on('connection', function (socket, pseudo) {
// Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('new_gamer', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new_gamer', pseudo);
    });

    socket.on('player_info', function(player) {

        i++;
        console.log(players);
        if (i < 5) { //limite à 4 joueurs
            players[i] = Object.assign({}, player)
            console.log(players[i]);
        }
        socket.broadcast.emit('players', {
            players: players,
        })

    });

    // Dès qu'on reçoit les mots
    socket.on('transfert_words', function (wordUser) {

        words[increment++] = wordUser;
        socket.words = words;
        if (Object.values(words).length > 4) { // Entre dans la boucle si 3 joueurs
            for (i = 0; i < Object.values(words).length; i++) {
                if (wordsInArray.length < 40) {
                wordsInArray = wordsInArray.concat(Object.values(words[i])); // Concatene les resultats en un seul array
                }
                socket.wordsInArray = wordsInArray;
            }
        }
        socket.broadcast.emit('global_words', {
            wordArray: socket.wordsInArray,
        })
    });
    
    socket.on('transfert_game_array', function (game_array) {
        socket.broadcast.emit('actual_game_array', game_array);
    });

});

//server.listen(80); //Prod
server.listen(8080); // Local
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
let gamer = {};
let player = 1;
let order = 1;
let increment = 0;
let wordsInArray = [];

io.sockets.on('connection', function (socket, pseudo) {
// Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('new_gamer', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new_gamer', pseudo);
    });

    // Dès qu'on reçoit les mots, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('transfert_words', function (wordUser) {

        //words[socket.pseudo] = wordUser;
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
        /*socket.broadcast.emit('transfert_words', {
            pseudo: socket.pseudo,
            wordUser: wordsInArray,
        });*/
    });
    
    socket.on('transfert_game_array', function (game_array) {
        socket.broadcast.emit('actual_game_array', game_array);
    });

    /*socket.on('choosing_team', function (myTeam) {

        gamer['player' + player++] = {
            name: socket.pseudo,
            team: myTeam, 
            order: order++,
        };

        socket.gamer = gamer;
        console.log(gamer);
        socket.broadcast.emit('gamer_data', {
            gamer : socket.gamer,
        });
    });*/

});


server.listen(8080);
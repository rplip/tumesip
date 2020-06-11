// Connexion à socket.io
//var socket = io.connect('http://tumesip.ddns.net/'); //Prod
var socket = io.connect('http://localhost:8080/'); //local

let formpseudo = document.getElementById("form_pseudo");
let formword = document.getElementById("form_addword");
let formteam = document.getElementById("form_chooseteam");
let formstart = document.getElementById("form_startgame");
let pregame = document.getElementById("section_pregame");
let game = document.getElementById("section_game");
let skip = document.getElementById("skip_word");
let validate = document.getElementById("validate_word");
let startgame = document.getElementById("start_game");
let startgametext = document.getElementById("start_game_text");
let readygame = document.getElementById("ready_game");
let readygametext = document.getElementById("ready_game_text");
let displayword = document.getElementById("display_word");
let endofturn = document.getElementById("end_of_turn");
let nextrow = document.getElementById("next_row");
let chronogame = document.getElementById("chrono_game");
let count_down = document.getElementById("countdown");
let progress_bar = document.getElementById("progress_bar");
let on_game_text = document.getElementById("on_game_text");
let chrono_text = document.getElementById("chrono_text");
let score_text = document.getElementById("score");
let firstdownside = document.getElementById("firstdownside");
let downside = document.getElementById("downside");
let score_table = document.getElementById("score_table");
let entrypoint = document.getElementById("table_entry_point");
let erase_array = document.getElementById("erase_array");

$('#form_pseudo').submit(function () {
    let player = {};
    player = {
        pseudo: $('#pseudo').val(),
        score: 0,
    }
    socket.emit('player_info', player);
    firstdownside.classList.add("d-none");
    downside.classList.remove("d-none");
    document.title = $('#pseudo').val() + ' - ' + document.title;
    return false;

});

$('#form_erase').submit(function() {
    socket.emit('erase_array', []);
    return false;
});

$('#form_addword').submit(function () { 
    let wordUser = {};
    wordUser = {
        word1: $('#word1').val(),
        word2: $('#word2').val(),
        word3: $('#word3').val(),
        word4: $('#word4').val(),
        word5: $('#word5').val(),
        word6: $('#word6').val(),
        word7: $('#word7').val(),
        word8: $('#word8').val(),
        word9: $('#word9').val(),
        word10: $('#word10').val(),
    };
    socket.emit('transfert_words', wordUser); // Transmet les mots aux autres
    formword.classList.add("d-none");
    pregame.classList.remove("d-none");
    return false; // Permet de bloquer l'envoi "classique" du formulaire
});

socket.on('global_words', function(data) {
    socket.emit('transfert_game_array', data.wordArray);
})
socket.on('actual_game_array' , function(array) {
    shuffleArray(array);
    console.log(array);
})

socket.on('players', function(data) {
    couting(data);
    
})

function couting(data) {
    console.log('undefined');
}

function shuffleArray(array) {
    let score = 0;
    score_text.innerHTML = "";
    for(k = array.length - 1; k > 0 ; k--) { // Melange (shuffle) les éléments de l'array
        const j = Math.floor(Math.random() * k)
        const temp = array[k]
        array[k] = array[j]
        array[j] = temp
    }
    loadword(array, "");
    skip.onclick = function () {  // bouton passer
        for(l = array.length - 1; l > 0 ; l--) { // Melange (shuffle) les éléments de l'array
            const m = Math.floor(Math.random() * l)
            const temp = array[l]
            array[l] = array[m]
            array[m] = temp
        }
        loadword(array, "skip");
        socket.emit('transfert_game_array', array);
    }
    validate.onclick = function () { // Bouton valider
        if(array.length == "1") {
                displayword.innerHTML = "";
                $('#display_word').append("Fin de partie");
            };
        array.splice(0, 1);
        score += 1;
        score_text.innerHTML = "";
        $('#score').append("score : " + score );
        socket.emit('transfert_score', score);
        loadword(array, "validate");
        socket.emit('transfert_game_array', array);
    }
}

function loadword(array, choice) { //Affichage des mots
        $.each( array, function( key, value ) {
            displayword.innerHTML = "";
            $('#display_word').append(value);
            return false;
        });
}

readygame.onclick = function () {
        socket.emit('transfert_words', {});
        readygame.classList.add("d-none");
        readygametext.classList.add("d-none");
        startgame.classList.remove("d-none");
        on_game_text.classList.remove("d-none");
        chrono_text.classList.remove("d-none");
        startgametext.classList.add("d-none");
        chronogame.classList.remove("d-none");
        score_table.classList.remove("d-none");
        //console.log(data);
        /*for (i = 1; i < 5; i++) {
            const entries = Object.entries(data.players[i]);
            console.log(entries[0][1]);
            $('#table_entry_point').append('<tr><td>' + entries[0][1] + '</td><td>' + entries[1][1] + '</td></tr>');
        };*/
    }

startgame.onclick = function () {
    game.classList.remove("d-none");
    pregame.classList.add('d-none');
    count_down.classList.remove('d-none');
    progress_bar.classList.remove('d-none'); 
    countdown();
}

nextrow.onclick = function () {
    readygame.classList.remove("d-none");
    readygametext.classList.remove("d-none");
    startgame.classList.add("d-none");
    score_table.classList.add("d-none");
    on_game_text.classList.add("d-none");
    chrono_text.classList.add("d-none");
    startgametext.classList.add("d-none");
    chronogame.classList.add("d-none");
    nextrow.classList.add("d-none");
    count_down.innerHTML = "";
}

endofturn.onclick = function () {
        game.classList.add("d-none");
        pregame.classList.remove("d-none");
        nextrow.classList.remove("d-none");
        readygametext.classList.add("d-none");
        startgametext.classList.add("d-none");
        count_down.classList.add('d-none');
        progress_bar.classList.add('d-none');
        count_down.innerHTML = "";
        let row = 0;
        row ++;
        socket.emit('row_number', row);
    }

/******* COMPTE A REBOUR ******/

let countdown_number = document.getElementById('countdown');
let progress_bar_active = document.getElementById('progress_bar_active')

function countdown () {
    
    let count = countdown_number.innerText;
    if(count == "") {
        count = '60';
    }
    count --;
    countdown_number.innerHTML = "";
    $('#countdown').append('<h4>' + count +'</h4>');
    progress_bar_active.style.width = (count*1.7) + "%";
    if (count >= 1) {
    setTimeout("countdown();", 1000);
    }
}

/******* CHRONOMETRE *******/

var startTime = 0
var start = 0
var end = 0
var diff = 0
var timerID = 0
window.onload = chronoStop;
function chrono(){
    end = new Date()
    diff = end - start
    diff = new Date(diff)
    var msec = diff.getMilliseconds()
    var sec = diff.getSeconds()
    var min = diff.getMinutes()
    var hr = diff.getHours()-1
    if (min < 10){
        min = "0" + min
    }
    if (sec < 10){
        sec = "0" + sec
    }
    if(msec < 10){
        msec = "00" +msec
    }
    else if(msec < 100){
        msec = "0" +msec
    }
    document.getElementById("chronotime").value = hr + ":" + min + ":" + sec + ":" + msec
    timerID = setTimeout("chrono()", 10)
}
function chronoStart(){
    document.chronoForm.startstop.value = "stop"
    document.chronoForm.startstop.onclick = chronoStop
    document.chronoForm.reset.onclick = chronoReset
    start = new Date()
    chrono()
}
function chronoContinue(){
    document.chronoForm.startstop.value = "stop"
    document.chronoForm.startstop.onclick = chronoStop
    document.chronoForm.reset.onclick = chronoReset
    start = new Date()-diff
    start = new Date(start)
    chrono()
}
function chronoReset(){
    document.getElementById("chronotime").value = "0:00:00:000"
    start = new Date()
}
function chronoStopReset(){
    document.getElementById("chronotime").value = "0:00:00:000"
    document.chronoForm.startstop.onclick = chronoStart
}
function chronoStop(){
    document.chronoForm.startstop.value = "start"
    document.chronoForm.startstop.onclick = chronoContinue
    document.chronoForm.reset.onclick = chronoStopReset
    clearTimeout(timerID)
}

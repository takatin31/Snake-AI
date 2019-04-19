var len = 30;
var Total = 600;
var players = [];
var savedPlayers = [];
var r = 20;
let slider;


function setup() {
    createCanvas(900, 900);
    slider = createSlider(1, 100, 1);
    for (let n = 0; n < Total; n++) {
        let i = floor(random(0, width / len));
        let j = floor(random(0, height / len));
        let target = newTarget();
        players[n] = new Snake(i, j, target);

    }
}

function init() {
    noFill();
    stroke(255);
    strokeWeight(2);
    for (var i = 0; i < width; i += len) {
        for (var j = 0; j < height; j += len) {
            rect(i, j, len, len);
        }
    }
}

function newTarget() {
    x = floor(random(0, width / len));
    y = floor(random(0, height / len));
    let target = new createVector(x, y);
    return target;
}

function draw() {
    //frameRate(5);


    for (let n = 0; n < slider.value(); n++) {
        for (var j = players.length - 1; j >= 0; j--) {
            if (players[j].stop || players[j].x * len < 0 || players[j].x * len >= width || players[j].y * len < 0 || players[j].y * len >= height) {

                savedPlayers.push(players.splice(j, 1)[0]);

            }
        }

        for (player of players) {
            player.update();
        }

        if (players.length == 0) {
            nextGeneration();
        }
    }

    background(51);
    init();
    for (player of players) {

        player.show();
        player.showTarget();
    }

}


function keyPressed() {

    if (keyCode == UP_ARROW) {
        player.changeDir(0);
    }
    if (keyCode == DOWN_ARROW) {
        player.changeDir(1);
    }
    if (keyCode == LEFT_ARROW) {
        player.changeDir(2);
    }
    if (keyCode == RIGHT_ARROW) {
        player.changeDir(3);
    }

}
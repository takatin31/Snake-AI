function mutate(x) {
    console.log("her");
    if (random(1) < 0.1) {
        let offset = randomGaussian() * 0.5;
        let newx = x + offset;
        return newx;
    } else {
        return x;
    }
}

function Snake(i, j, target, brain) {
    this.x = i;
    this.y = j;
    this.moves = [];
    this.dir = [false, false, false, false];
    if (brain) {
        this.brain = brain.copy();
    } else {
        this.brain = new NeuralNetwork(12, 4, 4);
    }
    this.count = 0;
    this.score = 0;
    this.fitness = 0;
    this.target = target;
    let move = createVector(this.x, this.y);
    this.moves.push(move);
    this.stop = false;
    this.cpt = 0;
}

Snake.prototype.showTarget = function() {
    noStroke();
    fill("#ff0000");

    ellipse(this.target.x * len + 15, this.target.y * len + 15, r, r);

}

Snake.prototype.mutate = function() {
    this.brain.mutate(0.1);
}

Snake.prototype.update = function() {
    this.think();
    this.cpt++;
    let l = ((width + height) / len + 1) * 3;
    if (this.cpt >= l) {
        this.stop = true;
    }




    if (this.dir[0]) //up
    {
        this.y--;
    } else {
        if (this.dir[1]) {
            this.y++;
        } else {
            if (this.dir[2]) {
                this.x--;
            } else {
                if (this.dir[3]) {
                    this.x++;
                }
            }
        }
    }




    if (this.moves.length > 1) {
        if (this.x == this.moves[this.moves.length - 2].x && this.y == this.moves[this.moves.length - 2].y) {
            this.count++;
        }
    }

    if (this.count > 4) {
        this.stop = true;
    }
    let move = createVector(this.x, this.y);
    //if (abs(move.dist(this.target)) < abs(this.moves[this.moves.length - 1].dist(this.target)))
    //this.score++;
    /* if (move.y == this.target.y) {
         if (abs(move.x - this.target.x) < abs(this.moves[this.moves.length - 1].x - this.target.x))
             this.score++;
     }
     if (move.x == this.target.x) {
         if (abs(move.y - this.target.y) < abs(this.moves[this.moves.length - 1].y - this.target.y))
             this.score++;
     }*/
    this.moves.push(move);

    /*let d = abs(move.dist(this.target));
    let l = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    this.score += map(d, l, 0, 0, 10);*/

    if (this.x == this.target.x && this.y == this.target.y) {
        this.score++;
        this.target = newTarget();
        this.count = 0;
        this.cpt = 0;

    }
}

Snake.prototype.think = function() {
    let inputs = [];
    let d = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    let move = createVector(this.x, this.y);

    if (this.y == this.target.y)
        inputs[0] = (this.x - this.target.x) * len / width;
    else
        inputs[0] = 0;

    if (this.x == this.target.x)
        inputs[1] = (this.y - this.target.y) * len / height;
    else
        inputs[1] = 0;


    inputs[2] = (width - this.x * len) / width;

    inputs[3] = (height - this.y * len) / height;


    inputs[4] = (this.x * len) / width;



    inputs[5] = (this.y * len) / height;


    if (this.y == this.target.y)
        inputs[6] = (this.target.x - this.x) * len / width;
    else
        inputs[6] = 0;

    if (this.x == this.target.x)
        inputs[7] = (this.target.y - this.y) * len / height;
    else
        inputs[7] = 0;

    if (this.x < this.target.x && this.y < this.target.y)
        inputs[8] = (this.target.dist(move)) / d;
    else
        inputs[8] = 0;

    if (this.x < this.target.x && this.y > this.target.y)
        inputs[9] = (this.target.dist(move)) / d;
    else
        inputs[9] = 0;

    if (this.x > this.target.x && this.y < this.target.y)
        inputs[10] = (this.target.dist(move)) / d;
    else
        inputs[10] = 0;

    if (this.x > this.target.x && this.y > this.target.y)
        inputs[11] = (this.target.dist(move)) / d;
    else
        inputs[11] = 0;



    let outputs = this.brain.predict(inputs);
    let max = 0;
    let index = -1;
    for (let i = 0; i < 4; i++) {
        if (outputs[i] > max) {
            max = outputs[i];
            index = i;
        }
    }

    this.changeDir(index);
}

Snake.prototype.changeDir = function(d) {
    for (var k = 0; k < 4; k++) {
        this.dir[k] = false;
    }
    this.dir[d] = true;
}

Snake.prototype.show = function() {
    fill("#ff80ff");
    noStroke();
    rect(this.x * len + 2, this.y * len + 2, len - 4, len - 4);
}
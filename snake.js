function mutate(x) {

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

    this.dir = [false, false, false, false];
    if (brain) {
        this.brain = brain.copy();
    } else {
        this.brain = new NeuralNetwork(16, 8, 4);
    }

    this.score = 0;
    this.fitness = 0;
    this.target = target;
    let move = createVector(this.x, this.y);

    this.stop = false;
    this.cpt = 0;
    this.length = 1;
    this.parts = [];
    this.parts.push(move);
    this.dirIndex = -1;
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







    /*let d = abs(move.dist(this.target));
    let l = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    this.score += map(d, l, 0, 0, 10);*/

    for (let i = 0; i < this.length - 1; i++) {
        this.parts[i] = this.parts[i + 1];
    }
    if (this.x == this.target.x && this.y == this.target.y) {
        this.score++;
        this.target = newTarget();
        this.count = 0;
        this.cpt = 0;
        this.length++;
    }




    this.parts[this.length - 1] = move;

    for (let i = 0; i < this.length - 1; i++) {
        if (move.x == this.parts[i].x && move.y == this.parts[i].y) {
            this.stop = true;
            break;
        }
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

    if (this.dir[3])
        inputs[2] = (width - this.x * len) / width;
    else
        inputs[2] = 0;

    if (this.dir[1])
        inputs[3] = (height - this.y * len) / height;
    else
        inputs[3] = 0;

    if (this.dir[2])
        inputs[4] = (this.x * len) / width;
    else
        inputs[4] = 0;

    if (this.dir[0])
        inputs[5] = (this.y * len) / height;
    else
        inputs[5] = 0;

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



    // inputs[12] = this.dirIndex / 4;

    inputs[13] = 0;

    if (this.dir[0]) {
        for (let i = this.parts.length - 2; i >= 0; i--) {
            if (this.parts[i].x == move.x && this.parts[i].y < move.y) {
                inputs[13] = (move.y - this.parts[i].y) / height;
                break;
            }
        }
    }

    inputs[14] = 0;

    if (this.dir[1]) {
        for (let i = this.parts.length - 2; i >= 0; i--) {
            if (this.parts[i].x == move.x && this.parts[i].y > move.y) {
                inputs[14] = (this.parts[i].y - move.y) / height;
                break;
            }
        }
    }

    inputs[15] = 0;

    if (this.dir[2]) {
        for (let i = this.parts.length - 2; i >= 0; i--) {
            if (this.parts[i].y == move.y && this.parts[i].x < move.x) {
                inputs[15] = (move.x - this.parts[i].x) / width;
                break;
            }
        }
    }

    inputs[12] = 0;

    if (this.dir[3]) {
        for (let i = this.parts.length - 2; i >= 0; i--) {
            if (this.parts[i].y == move.y && this.parts[i].x > move.x) {
                inputs[12] = (this.parts[i].x - move.x) / width;
                break;
            }
        }
    }



    let outputs = this.brain.predict(inputs);
    let max = 0;

    for (let i = 0; i < 4; i++) {
        if (outputs[i] > max) {
            max = outputs[i];
            this.dirIndex = i;
        }
    }
    //console.log(this.dirIndex);
    this.changeDir(this.dirIndex);
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
    for (part of this.parts) {
        rect(part.x * len + 2, part.y * len + 2, len - 4, len - 4);
    }

}
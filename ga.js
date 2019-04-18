function nextGeneration() {
    console.log("next generation");
    calculateFitness();

    for (let i = 0; i < Total; i++) {
        players[i] = poolSelection();
    }

    savedPlayers = [];
}

function poolSelection() {
    // Start at 0
    let index = 0;

    // Pick a random number between 0 and 1
    let r = random(1);

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
        r -= savedPlayers[index].fitness;
        // And move on to the next
        index += 1;
    }

    // Go back one
    index -= 1;

    let player = savedPlayers[index];
    let i = floor(random(0, width / len));
    let j = floor(random(0, height / len));
    let target = newTarget();
    let child = new Snake(i, j, target, player.brain);
    child.mutate();
    return child;

    // Make sure it's a copy!
    // (this includes mutation)

}

function calculateFitness() {
    let sum = 0;
    let max = 0;
    for (player of savedPlayers) {
        if (max < player.score) {
            max = player.score;
        }
        sum += player.score;
    }

    for (player of savedPlayers) {
        player.fitness = player.score / sum;
    }
    console.log(max);
}
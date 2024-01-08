class BoggleGame {
    constructor() {
        this.score = 0;
        this.timer = 60;
        this.interval = null;
        this.guessedWords = new Set(); // Maintain a set of guessed words
    }

    updateStatistics() {
        axios.get('/get_statistics')
            .then(response => {
                const highestScore = response.data.highestScore;
                const gamesPlayed = response.data.gamesPlayed;

                $('#highest-score').text(highestScore);
                $('#games-played').text(gamesPlayed);
            })
            .catch(error => {
                console.error('Error fetching statistics:', error);
            });
    }

    resetGame() {
        clearInterval(this.interval);
        $('input[name="guess"]').prop('disabled', false);
        $('input[type="submit"]').prop('disabled', false);
        $('#score').text('Score: 0');
        this.score = 0;
        this.updateStatistics();
    }

    updateTimer() {
        $('#time').text(this.timer); // Update timer display

        if (this.timer === 0) {
            clearInterval(this.interval);
            $('input[name="guess"]').prop('disabled', true); // Disable the input field
            $('input[type="submit"]').prop('disabled', true); // Disable the submit button

            axios.post('/update_statistics', { score: this.score })
                .then(response => {
                    console.log('Game ended. Statistics updated.');
                    this.resetGame(); // Reset the game
                })
                .catch(error => {
                    console.error('Error updating statistics:', error);
                });
        }

        this.timer--;
    }

    startGame() {
        this.updateStatistics();
        this.interval = setInterval(() => {
            this.updateTimer();
        }, 1000);

        $('form').submit(event => {
            event.preventDefault();
            let guess = $('input[name="guess"]').val().trim().toLowerCase();

            if (this.guessedWords.has(guess)) {
                alert('You have already submitted this word!');
                return;
            }

            axios.post('/check_guess', { guess: guess })
                .then(response => {
                    let result = response.data.result;

                    if (result === 'ok') {
                        this.score += guess.length;
                        $('#score').text('Score: ' + this.score);
                        this.guessedWords.add(guess); // Add the guessed word to the set
                        alert('Good guess!');
                    } else if (result === 'not-on-board') {
                        alert('Word not on the board!');
                    } else if (result === 'duplicate') {
                        alert('You have already submitted this word!');
                    } else {
                        alert('Not a word!');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    }
}

$(document).ready(function () {
    const boggleGame = new BoggleGame();
    boggleGame.startGame();
});

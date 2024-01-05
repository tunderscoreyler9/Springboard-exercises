// Wait for the document to be fully loaded
$(document).ready(function () {
    // Function to update the statistics displayed on the page
    function updateStatistics() {
        axios.get('/get_statistics')
            .then(function (response) {
                const highestScore = response.data.highestScore;
                const gamesPlayed = response.data.gamesPlayed;

                $('#highest-score').text(highestScore);
                $('#games-played').text(gamesPlayed);
            })
            .catch(function (error) {
                console.error('Error fetching statistics:', error);
            });
    }

    // Call the function to initially display statistics
    updateStatistics();

    // Initialize timer value and other variables
    let timer = 60;
    let score = 0;

    // Function to reset the game state
    function resetGame() {
        clearInterval(interval);
        $('input[name="guess"]').prop('disabled', false);
        $('input[type="submit"]').prop('disabled', false);
        $('#score').text('Score: 0');
        score = 0;
        updateStatistics();
    }

    // Function to update the timer display and handle game end
    function updateTimer() {
        $('#time').text(timer); // Update timer display

        if (timer === 0) {
            clearInterval(interval);
            $('input[name="guess"]').prop('disabled', true);
            $('input[type="submit"]').prop('disabled', true);

            // Send AJAX request to update statistics
            axios.post('/update_statistics', { score: score })
                .then(function (response) {
                    console.log('Game ended. Statistics updated.');
                    resetGame(); // Reset the game
                })
                .catch(function (error) {
                    console.error('Error updating statistics:', error);
                });
        }
        timer--;
    }

    // Call updateTimer function every second
    let interval = setInterval(updateTimer, 1000);

    // Handle form submission
    $('form').submit(function (event) {
        event.preventDefault();
        let guess = $('input[name="guess"]').val();
        console.log('Sending guess:', guess);

        // Post request to check the guess
        axios.post('/check_guess', { guess: guess })
            .then(function (response) {
                let result = response.data.result;

                // Handle different result cases
                if (result === 'ok') {
                    score += guess.length;
                    $('#score').text('Score: ' + score);
                    console.log(score);
                    alert('Good guess!');
                } else if (result === 'not-on-board') {
                    alert('Word not on the board!');
                } else {
                    alert('Not a word!');
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    });
});
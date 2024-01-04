
$(document).ready(function() {
    let score = 0;
    let timer = 60;

    // gotta update the timer display:
    function updateTimer() {
        $('#time').text(timer); // update timer display

        if(timer === 0) {
            $('input[name="guess"]').prop('disabled', true);
            $('input[type="submit"]').prop('disabled', true);
            clearInterval(interval);
        }
        timer --;
    }
    // Call updateTimer function every second
    let interval = setInterval(updateTimer, 1000);


    $('form').submit(function(event) {
        event.preventDefault();
        let guess = $('input[name="guess"]').val();
        console.log('Sending guess:', guess);

        // post request:
        axios.post('/check_guess', {guess: guess})
        .then(function(response) {
            // Handle response from the server
            let result = response.data.result;

            // If the word is valid, update the score and display it
            if(result === 'ok') {
                score += guess.length;
                $('#score').text('Score: ' + score);
                console.log(score);
                alert('Good guess!');
            } else if(result === 'not-on-board') {
                alert('Word not on the board!');
            } else {
                alert("Not a word!");
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    });
});
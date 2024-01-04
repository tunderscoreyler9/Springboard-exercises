
let score = 0;

$(document).ready(function() {
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
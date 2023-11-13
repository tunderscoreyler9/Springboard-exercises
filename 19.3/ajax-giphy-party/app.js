document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#search-form");
    form.addEventListener("submit", function (evt) {
        evt.preventDefault();
        const input = document.querySelector("#search");
        const keyword = input.value;
        searchGIF(keyword);
        input.value = '';
    });

    async function searchGIF(keyword) {
        const response = await axios.get(`http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=fXuYPBplCR6wWFW3Vd2zDm0GpV7js8Oi`);
        let results = response.data.data;
        console.log(results[(Math.floor(Math.random() * results.length))].url);
        let randomGifUrl = results[(Math.floor(Math.random() * results.length))].images.original.url;
        appendGif(randomGifUrl);
    }

    function appendGif(source) {
        const div = document.querySelector("#img-spot");
        const img = document.createElement('img');
        img.src = source;
        div.append(img);
    }

    // remove images:
    $("#remove-btn").click(function (evt) {
        $("#img-spot").empty();
    })
});
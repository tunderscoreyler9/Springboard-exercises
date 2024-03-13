$(document).ready(function () {
    fetchCupcakes();

    $("#cupcake-form").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        const flavor = $("#flavor").val();
        const size = $("#size").val();
        const rating = $("#rating").val();
        const image = $("#image").val() || "";

        // Use Axios to send a POST request to create a new cupcake
        axios.post("/api/cupcakes", { flavor, size, rating, image })
            .then(function (response) {
                // Add the new cupcake to the list
                const newCupcake = response.data.cupcake;
                addCupcakeToList(newCupcake);

                // Clear the form
                $("#cupcake-form").trigger("reset");
            })
            .catch(function (error) {
                console.error(error);
                alert("Error adding cupcake! Please try again.");
            });
    });

    // Handle search form submission
    $("#search-form").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        const searchTerm = $("#search-term").val();

        // Send a GET request to search endpoint with the search term
        axios.get(`/api/cupcakes/search?q=${searchTerm}`)
            .then(function (response) {
                const cupcakes = response.data.cupcakes;
                $("#cupcake-list").empty(); // Clear existing list items

                cupcakes.forEach(function (cupcake) {
                    addCupcakeToList(cupcake);
                });
            })
            .catch(function (error) {
                console.error(error);
                alert("Error searching for cupcakes! Please try again.");
            });
    });

});

// Function to fetch cupcakes from the API and update the list
function fetchCupcakes() {
    axios.get("/api/cupcakes")
        .then(function (response) {
            const cupcakes = response.data.cupcakes;
            $("#cupcake-list").empty(); // Clear existing list items

            cupcakes.forEach(function (cupcake) {
                addCupcakeToList(cupcake);
            });
        })
        .catch(function (error) {
            console.error(error);
            alert("Error fetching cupcakes! Please try again later.");
        });
}

// Function to add a cupcake to the list dynamically
function addCupcakeToList(cupcake) {
    const listItem = $(`<li>
      ${cupcake.flavor} - ${cupcake.size} (Rating: ${cupcake.rating})
      ${cupcake.image ? `<img src="${cupcake.image}" alt="Cupcake Image" style="max-width: 100px;">` : ""}
    </li>`);
    $("#cupcake-list").append(listItem);
}

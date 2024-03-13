class CupcakeService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async fetchAllCupcakes() {
        try {
            const response = await axios.get(`${this.baseUrl}/api/cupcakes`);
            return response.data.cupcakes;
        } catch (error) {
            console.error(error);
            throw new Error("Error fetching cupcakes!")
        }
    }

    async createCupcake(cupcakeData) {
        try {
            const response = await axios.post(`${this.baseUrl}/api/cupcakes`, cupcakeData);
            return response.data.cupcake;
        } catch (error) {
            console.error(error);
            throw new Error("Error creating cupcake!");
        }
    }

    async updateCupcake(cupcakeId, cupcakeData) {
        try {
            const response = await axios.patch(`${this.baseUrl}/api/cupcakes/${cupcakeId}`, cupcakeData);
            return response.data.cupcake;
        } catch (error) {
            console.error(error);
            throw new Error("Error updating cupcake!");
        }
    }

    async deleteCupcake(cupcakeId) {
        try {
            await axios.delete(`${this.baseUrl}/api/cupcakes/${cupcakeId}`);
        } catch (error) {
            console.error(error);
            throw new Error("Error deleting cupcake!");
        }
    }

    async searchCupcakes(searchTerm) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/cupcakes/search?q=${searchTerm}`);
            return response.data.cupcakes;
        } catch (error) {
            console.error(error);
            throw new Error("Error searching for cupcakes!");
        }
    }
}

$(document).ready(function () {
    const cupcakeService = new CupcakeService("http://127.0.0.1:5000");

    // Fetch all cupcakes on page load
    cupcakeService.fetchAllCupcakes()
        .then(cupcakes => {
            $("#cupcake-list").empty(); // Clear existing list items (if any)
            cupcakes.forEach(cupcake => addCupcakeToList(cupcake));
        })
        .catch(error => {
            console.error(error);
            alert("Error fetching cupcakes! Please try again.");
        });

    // Handle form submission for adding a new cupcake
    $("#cupcake-form").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const flavor = $("#flavor").val();
        const size = $("#size").val();
        const rating = parseInt($("#rating").val());
        const image = $("#image").val() || ""; // Handle empty image URL

        const cupcakeData = { flavor, size, rating, image };

        cupcakeService.createCupcake(cupcakeData)
            .then(cupcake => {
                addCupcakeToList(cupcake);
                $("#cupcake-form").trigger("reset"); // Clear form after successful creation
                alert("Cupcake created successfully!"); // Add success message
            })
            .catch(error => {
                console.error(error);
                alert("Error creating cupcake! Please try again.");
            });
    });

    // Handle search form submission
    $("#search-form").submit(function (event) {
        event.preventDefault();

        const searchTerm = $("#search-term").val();

        cupcakeService.searchCupcakes(searchTerm)
            .then(cupcakes => {
                $("#cupcake-list").empty(); // Clear existing list items
                cupcakes.forEach(cupcake => addCupcakeToList(cupcake));
            })
            .catch(error => {
                console.error(error);
                alert("Error searching for cupcakes! Please try again.");
            });
    });

    // Function to add cupcake to the list
    function addCupcakeToList(cupcake) {
        const imageSrc = cupcake.image || "https://tinyurl.com/demo-cupcake";
        const listItem = $(`<li>
        ${cupcake.flavor} - ${cupcake.size} (Rating: ${cupcake.rating})
        <img src="${imageSrc}" alt="Cupcake Image" style="width: 150px; height: 150px; class="cupcake-image">
      </li>`);
        $("#cupcake-list").append(listItem);
    }
});
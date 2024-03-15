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

    cupcakeService.fetchAllCupcakes()
        .then(cupcakes => {
            $("#cupcake-list").empty();
            cupcakes.forEach(cupcake => addCupcakeToList(cupcake));
        })
        .catch(error => {
            console.error(error);
            alert("Error fetching cupcakes! Please try again.");
        });



    $("#cupcake-form").submit(function (event) {
        event.preventDefault();

        const flavor = $("#flavor").val();
        const size = $("#size").val();
        const rating = parseInt($("#rating").val());
        const image = $("#image").val() || "";

        const cupcakeData = { flavor, size, rating, image };

        cupcakeService.createCupcake(cupcakeData)
            .then(cupcake => {
                addCupcakeToList(cupcake);
                $("#cupcake-form").trigger("reset");
                alert("Cupcake created successfully!");
            })
            .catch(error => {
                console.error(error);
                alert("Error creating cupcake! Please try again.");
            });
    });


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


    function addCupcakeToList(cupcake) {
        const imageSrc = cupcake.image || "https://tinyurl.com/demo-cupcake";
        const listItem = $(`<li data-cupcake-id=${cupcake.id}>
        ${cupcake.flavor} - ${cupcake.size} (Rating: ${cupcake.rating})
        <img src="${imageSrc}" alt="Cupcake Image" style="width: 150px; height: 150px; class="cupcake-image">
        <button class="delete-button">X</button>
      </li>`);
        $("#cupcake-list").append(listItem);
    };

    $(document).on("click", ".delete-button", async function (event) {
        const button = $(this);
        const cupcakeListItem = button.closest("li");
        const cupcakeId = cupcakeListItem.data("cupcake-id");

        
        if (confirm("Are you sure you want to delete this cupcake?")) {
            try {
                await cupcakeService.deleteCupcake(cupcakeId);
                cupcakeListItem.remove();
                alert("Cupcake deleted successfully!");
            } catch (error) {
                console.error(error);
                alert("Error deleting cupcake! Please try again.");
            }
        }
    });
});
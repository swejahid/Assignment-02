const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

let selectedDrinks = [];

window.onload = function () {
    loadDrinks("a");
};


async function loadDrinks(name) {

    try {

        const response = await fetch(API_URL + name);
        const data = await response.json();

        displayDrinks(data.drinks);

    } catch (error) {

        console.log(error);

    }

}


function searchDrink() {

    const text = document.getElementById("searchInput").value.trim();

    if (text === "") {

        loadDrinks("a");

    } else {

        loadDrinks(text);

    }

}


function displayDrinks(drinks) {

    const container = document.getElementById("drinkContainer");

    container.innerHTML = "";

    if (!drinks) {

        container.innerHTML = `
            <div class="no-data">
                No Drinks Found
            </div>
        `;

        return;
    }

    drinks.forEach(drink => {

        container.innerHTML += `

        <div class="col-md-6 col-lg-4">

            <div class="card h-100">

                <img src="${drink.strDrinkThumb}" class="card-img-top">

                <div class="card-body d-flex flex-column">

                    <h4 class="card-title">
                        ${drink.strDrink}
                    </h4>

                    <p class="category">
                        Category : ${drink.strCategory}
                    </p>

                    <p class="instruction">
                        ${drink.strInstructions.slice(0,15)}...
                    </p>

                    <div class="mt-auto">

                        <button
                        class="btn btn-add w-100 mb-2"
                        onclick="addToGroup('${drink.idDrink}','${drink.strDrink}','${drink.strDrinkThumb}')">

                            Add to Group

                        </button>

                        <button
                        class="btn btn-details w-100"
                        onclick="showDetails('${drink.idDrink}')">

                            Details

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}

function addToGroup(id, name, image) {

    if (selectedDrinks.length >= 7) {

        alert("You can't add more than 7 drinks!");

        return;

    }

    const alreadyExists = selectedDrinks.find(drink => drink.id === id);

    if (alreadyExists) {

        alert("This drink is already added!");

        return;

    }

    selectedDrinks.push({

        id,
        name,
        image

    });

    updateGroup();

}

function updateGroup() {

    document.getElementById("count").innerText = selectedDrinks.length;

    const group = document.getElementById("groupContainer");

    group.innerHTML = "";

    selectedDrinks.forEach((drink,index)=>{

        group.innerHTML += `

        <div class="group-item">

            <strong>${index+1}.</strong>

            <img src="${drink.image}">

            <h6>${drink.name}</h6>

        </div>

        `;

    });

}

async function showDetails(id){

    const response = await fetch(

    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`

    );

    const data = await response.json();

    const drink = data.drinks[0];

    document.getElementById("modalBody").innerHTML = `

        <img src="${drink.strDrinkThumb}" class="img-fluid">

        <h3>${drink.strDrink}</h3>

        <hr>

        <p><strong>Category :</strong> ${drink.strCategory}</p>

        <p><strong>Alcoholic :</strong> ${drink.strAlcoholic}</p>

        <p><strong>Glass :</strong> ${drink.strGlass}</p>

        <p><strong>IBA :</strong> ${drink.strIBA || "N/A"}</p>

        <p><strong>Instructions :</strong></p>

        <p>${drink.strInstructions}</p>

    `;

    const modal = new bootstrap.Modal(

        document.getElementById("detailsModal")

    );

    modal.show();

}

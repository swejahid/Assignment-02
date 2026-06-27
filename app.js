const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const LOOKUP_URL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";

let selectedDrinks = [];


window.onload = () => {
    loadDrinks("a");

    // Search when Enter key is pressed
    document
        .getElementById("searchInput")
        .addEventListener("keypress", function (event) {

            if (event.key === "Enter") {
                searchDrink();
            }

        });
};


async function loadDrinks(searchText) {

    try {

        const response = await fetch(API_URL + searchText);

        const data = await response.json();

        displayDrinks(data.drinks);

    } catch (error) {

        console.log(error);

    }

}

function searchDrink() {

    const text = document
        .getElementById("searchInput")
        .value
        .trim();

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

            <h2>No Drinks Found</h2>

        </div>

        `;

        return;

    }

    drinks.forEach(drink => {

        container.innerHTML += `

        <div class="col-md-6 col-lg-4">

            <div class="card h-100">

                <img
                src="${drink.strDrinkThumb}"
                class="card-img-top">

                <div class="card-body">

                    <h4 class="card-title">

                        ${drink.strDrink}

                    </h4>

                    <p class="category">

                        Category :
                        ${drink.strCategory}

                    </p>

                    <p class="instruction">

                        ${drink.strInstructions.slice(0,15)}...

                    </p>

                    <div class="mt-auto">

                        <button
                        class="btn btn-add w-100 mb-2"
                        onclick="addToGroup(
                        '${drink.idDrink}',
                        '${drink.strDrink}',
                        '${drink.strDrinkThumb}')">

                            Add To Group

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

function addToGroup(id,name,image){

    if(selectedDrinks.length>=7){

        alert("You can't add more than 7 drinks!");

        return;

    }

    const exists=selectedDrinks.find(drink=>drink.id===id);

    if(exists){

        alert("Drink already selected!");

        return;

    }

    selectedDrinks.push({

        id:id,
        name:name,
        image:image

    });

    updateGroup();

}

function updateGroup(){

    document.getElementById("count").innerText=selectedDrinks.length;

    document.getElementById("countText").innerText=selectedDrinks.length;

    const group=document.getElementById("groupContainer");

    group.innerHTML="";

    if(selectedDrinks.length===0){

        group.innerHTML=`

        <div class="empty-group">

            <h1>🍹</h1>

            <p>No drinks selected.</p>

        </div>

        `;

        return;

    }

    selectedDrinks.forEach((drink,index)=>{

        group.innerHTML+=`

        <div class="group-item">

            <strong>${index+1}.</strong>

            <img src="${drink.image}">

            <div>

                <h6>${drink.name}</h6>

            </div>

        </div>

        `;

    });

}


async function showDetails(id){

    const response=await fetch(LOOKUP_URL+id);

    const data=await response.json();

    const drink=data.drinks[0];

    document.getElementById("modalBody").innerHTML=`

        <img
        src="${drink.strDrinkThumb}"
        class="img-fluid">

        <h2 class="mt-3">

            ${drink.strDrink}

        </h2>

        <hr>

        <p>

            <strong>Category:</strong>

            ${drink.strCategory}

        </p>

        <p>

            <strong>Alcoholic:</strong>

            ${drink.strAlcoholic}

        </p>

        <p>

            <strong>Glass:</strong>

            ${drink.strGlass}

        </p>

        <p>

            <strong>IBA:</strong>

            ${drink.strIBA || "N/A"}

        </p>

        <p>

            <strong>Instructions:</strong>

        </p>

        <p>

            ${drink.strInstructions}

        </p>

    `;

    const modal=new bootstrap.Modal(

        document.getElementById("detailsModal")

    );

    modal.show();

}


function clearGroup(){

    selectedDrinks=[];

    updateGroup();

}

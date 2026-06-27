let group = [];
let currentDrinks = [];

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const drinksContainer = document.getElementById('drinksContainer');
const groupContainer = document.getElementById('groupContainer');
const groupCount = document.getElementById('groupCount');
const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDetails = document.getElementById('modalDetails');
const modalCloseBtn = document.getElementById('modalCloseBtn');


window.onload = function () {
    loadDefaultDrinks();
};


searchBtn.addEventListener('click', searchDrinks);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') searchDrinks();
});

modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});


async function loadDefaultDrinks() {
    try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita');
        const data = await response.json();
        currentDrinks = data.drinks || [];
        renderDrinks(currentDrinks);
    } catch (error) {
        drinksContainer.innerHTML =
            '<div class="not-found"><div class="not-found-icon">😕</div>Failed to load drinks. Please try again.</div>';
    }
}


async function searchDrinks() {
    const query = searchInput.value.trim();
    drinksContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Searching...</p></div>';

    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        const data = await response.json();
        currentDrinks = data.drinks;

        if (!currentDrinks) {
            drinksContainer.innerHTML = `<div class="not-found"><div class="not-found-icon">🔍</div>No drinks found for "${query}"</div>`;
            return;
        }

        renderDrinks(currentDrinks);
    } catch (error) {
        drinksContainer.innerHTML = '<div class="not-found"><div class="not-found-icon">😕</div>Error searching drinks.</div>';
    }
}


function renderDrinks(drinks) {
    if (!drinks || drinks.length === 0) {
        drinksContainer.innerHTML = '<div class="not-found"><div class="not-found-icon">🔍</div>No drinks found.</div>';
        return;
    }

    drinksContainer.innerHTML = drinks.map(drink => {
        const instructions = drink.strInstructions ? drink.strInstructions.substring(0, 15) + '...' : 'No instructions';
        const drinkJSON = JSON.stringify(drink).replace(/"/g, '&quot;');
        return `
            <div class="drink-card">
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <div class="drink-card-body">
                    <div class="drink-name">${drink.strDrink}</div>
                    <div class="drink-category">${drink.strCategory || 'Unknown Category'}</div>
                    <div class="drink-instructions">${instructions}</div>
                    <div class="drink-buttons">
                        <button class="btn btn-add" onclick='addToGroup("${drinkJSON}")'>➕ Add to Group</button>
                        <button class="btn btn-details" onclick='showDetails("${drinkJSON}")'>ℹ️ Details</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}


function addToGroup(drinkJSON) {
    const drink = JSON.parse(drinkJSON.replace(/&quot;/g, '"'));

    if (group.length >= 7) {
        alert('⚠️ You cannot add more than 7 drinks to a group!');
        return;
    }

    if (group.find(d => d.idDrink === drink.idDrink)) {
        alert('This drink is already in your group!');
        return;
    }

    group.push(drink);
    updateGroupDisplay();
}


function removeFromGroup(idDrink) {
    group = group.filter(d => d.idDrink !== idDrink);
    updateGroupDisplay();
}

function updateGroupDisplay() {
    groupCount.textContent = group.length;

    if (group.length === 0) {
        groupContainer.innerHTML = '<div class="empty-group">No drinks added yet.<br>Click "Add to Group" to add drinks!</div>';
        return;
    }

    groupContainer.innerHTML = group.map(drink => `
        <div class="group-item">
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            <span class="group-item-name">${drink.strDrink}</span>
            <button class="group-item-remove" onclick="removeFromGroup('${drink.idDrink}')">&times;</button>
        </div>
    `).join('');
}

function showDetails(drinkJSON) {
    const drink = JSON.parse(drinkJSON.replace(/&quot;/g, '"'));

    modalImage.src = drink.strDrinkThumb;
    modalTitle.textContent = drink.strDrink;
    modalCategory.textContent = drink.strCategory || 'Unknown Category';

    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient}`);
        }
    }

    modalDetails.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Category:</span>
            <span class="detail-value">${drink.strCategory || 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Alcoholic:</span>
            <span class="detail-value">${drink.strAlcoholic || 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Glass:</span>
            <span class="detail-value">${drink.strGlass || 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Instructions:</span>
            <span class="detail-value">${drink.strInstructions || 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Ingredients:</span>
            <div class="ingredients-list">
                ${ingredients.length > 0 ? ingredients.map(ing => `<span class="ingredient-tag">${ing}</span>`).join('') : 'N/A'}
            </div>
        </div>
        <div class="detail-row">
            <span class="detail-label">IBA:</span>
            <span class="detail-value">${drink.strIBA || 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Tags:</span>
            <span class="detail-value">${drink.strTags || 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Video:</span>
            <span class="detail-value">${drink.strVideo ? `<a href="${drink.strVideo}" target="_blank">Watch Video</a>` : 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">ID:</span>
            <span class="detail-value">${drink.idDrink}</span>
        </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

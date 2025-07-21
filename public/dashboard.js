console.log("📦 dashboard.js loaded and executing.");

document.addEventListener('DOMContentLoaded', () => fetchRecipes());

async function fetchRecipes(url = 'http://localhost:3000/recipe') {
  try {
    const res = await axios.get(url);
    console.log("Full response:", res);
    const recipes = res.data.recipes;
    console.log("Recipes fetched:", recipes); 
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = '';
   console.log("Recipes fetched:", recipes);
console.log("Type of recipes:", typeof recipes);
console.log("recipes.length:", recipes.length);
    recipes.forEach(recipe => {
      console.log("Appending recipe:", recipe.title);
      const col = document.createElement('div');
      col.className = 'col-md-3 mb-4';

      const card = document.createElement('div');
      card.className = 'card recipe-card p-2';

      const imgSrc = recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
      const avgRating = recipe.averageRating ? `⭐ ${recipe.averageRating.toFixed(1)}/5` : 'No ratings yet';

      card.innerHTML = `
        <img src="${imgSrc}" alt="${(recipe.title)}" class="recipe-img card-img-top">
        <div class="card-body text-center">
          <h5 class="recipe-title" onclick="toggleDetails(${recipe.id})">${(recipe.title)}</h5>
          <p>${avgRating}</p>
          <div id="details-${recipe.id}" class="details" style="display:none;">
           
            <p><strong>Cooking Time:</strong> ${recipe.cookingTime} min</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <p><strong>Ingredients:</strong> ${(recipe.ingredients)}</p>
            <p><strong>Instructions:</strong> ${(recipe.instructions)}</p>
            <p><strong>Level:</strong> ${(recipe.level || 'N/A')}</p>
            <p><strong>Diet:</strong> ${(recipe.diet || 'N/A')}</p>
          </div>
          <button class="btn btn-outline-danger btn-sm mt-2" onclick="saveFavorite(${recipe.id})">❤️ Save to Favorites</button>
        </div>
      `;

      col.appendChild(card);
      grid.appendChild(col);
    });
  } catch (error) {
    console.error(error);
    alert('Failed to load recipes.');
  }
}

function toggleDetails(id) {
  const details = document.getElementById(`details-${id}`);
  details.style.display = (details.style.display === 'none' || details.style.display === '') ? 'block' : 'none';
}

async function saveFavorite(recipeId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to save favorites.');
    return;
  }

  try {
    await axios.post('http://localhost:3000/favorites', { recipeId }, {
      headers: { Authorization: token }
    });
    alert('Recipe saved to favorites!');
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to save favorite.');
  }
}

function handleNavbarSearch() {

  const query = document.getElementById('navbarSearchInput').value.trim();
  const level = document.getElementById('difficultySelect').value;
  const diet = document.getElementById('dietSelect').value;

  let url ;

  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (level) params.append('level', level);
  if (diet) params.append('diet', diet);

  if (params.toString()) {
    url = `http://localhost:3000/recipe/search?${params.toString()}`;
  }else{
    url= `http://localhost:3000/recipe`;
  }
console.log("🔍 Fetching recipes from URL:", url);
  fetchRecipes(url);
}

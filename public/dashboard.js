console.log("📦 dashboard.js loaded and executing.");

document.addEventListener('DOMContentLoaded', () => fetchRecipes());

async function fetchRecipes(url = 'http://localhost:3000/recipe') {
  try {
    const res = await axios.get(url);
    const recipes = res.data.recipes;
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = '';
    recipes.forEach(recipe => {
      console.log("Appending recipe:", recipe.title);
      const col = document.createElement('div');
      col.className = 'col-md-3 mb-4';

      const card = document.createElement('div');
      card.className = 'card recipe-card p-2';

      const imgSrc = recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
      const avgRating = recipe.averageRating !== null && recipe.averageRating !== undefined
  ? `⭐ ${Number(recipe.averageRating).toFixed(1)}/5`
  : 'No ratings yet';

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
          
           <button class="btn btn-sm btn-primary my-1" onclick="loadReviews(${recipe.id})">📖 Reviews</button>
          <div id="reviews-${recipe.id}" class="text-start"></div>
          <button class="btn btn-sm btn-success my-1" onclick="showReviewForm(${recipe.id})">✏️ Add Review</button>
         <div id="review-form-${recipe.id}" style="display:none;">
        <input type="number" id="review-rating-${recipe.id}" class="form-control my-1" placeholder="Rating (1-5)" min="1" max="5">
        <textarea id="review-comment-${recipe.id}" class="form-control my-1" placeholder="Your comment"></textarea>
        <button class="btn btn-sm btn-success" onclick="submitReview(${recipe.id})">Submit Review</button>
      </div>
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

function showReviewForm(recipeId) {
  const form = document.getElementById(`review-form-${recipeId}`);
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function submitReview(recipeId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to submit a review.');
    return;
  }

  const rating = parseInt(document.getElementById(`review-rating-${recipeId}`).value);
  const comment = document.getElementById(`review-comment-${recipeId}`).value.trim();

  if (!rating || rating < 1 || rating > 5 || !comment) {
    alert('Please enter a valid rating (1-5) and comment.');
    return;
  }

  try {
    await axios.post('/reviews', { recipeId, rating, comment }, {
      headers: { Authorization: token }
    });
    alert('Review submitted!');
    loadReviews(recipeId);
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to submit review.');
  }
}

async function loadReviews(recipeId) {
  try {
    const res = await axios.get(`/reviews/${recipeId}`);
    const reviews = res.data.reviews;
    const avg = res.data.averageRating;

    const container = document.getElementById(`reviews-${recipeId}`);
    container.innerHTML = `<strong>Average Rating:</strong> ⭐ ${avg ? avg.toFixed(1) : 'N/A'}/5<br><br>`;

    if (reviews.length === 0) {
      container.innerHTML += '<p>No reviews yet.</p>';
    } else {
      reviews.forEach(r => {
        const div = document.createElement('div');
        div.className = 'border p-2 mb-2';
        div.innerHTML = `
          <strong>${r.User?.username || 'Anonymous'}</strong> ⭐ ${r.rating}/5
          <p>${r.comment}</p>
        `;
        container.appendChild(div);
      });
    }
  } catch (error) {
    console.error(error);
    alert('Failed to load reviews.');
  }
}


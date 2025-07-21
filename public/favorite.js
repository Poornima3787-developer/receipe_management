document.addEventListener('DOMContentLoaded', fetchFavorites);

async function fetchFavorites() {
  const token = localStorage.getItem('token');
  if (!token) return alert('Login required');

  try {
    const res = await axios.get('/favorites', {
      headers: { Authorization: token }
    });

    const favorites = res.data.favorites;
    const grid = document.getElementById('favoriteGrid');
    grid.innerHTML = '';

    if (favorites.length === 0) {
      grid.innerHTML = '<p>No favorite recipes yet.</p>';
      return;
    }

    favorites.forEach(fav => {
      const recipe = fav.Recipe;
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      const image = recipe.imageUrl || 'https://via.placeholder.com/300x200';

      card.innerHTML = `
        <div class="card h-100">
          <img src="${image}" class="card-img-top" alt="${recipe.title}">
          <div class="card-body">
            <h5 class="card-title">${recipe.title}</h5>
            <p><strong>Time:</strong> ${recipe.cookingTime} min</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <button class="btn btn-outline-danger" onclick="removeFavorite(${recipe.id})">Remove ❤️</button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    alert('Failed to load favorites');
  }
}

async function removeFavorite(recipeId) {
  const token = localStorage.getItem('token');
  if (!token) return;

  if (!confirm("Remove this from favorites?")) return;

  try {
    await axios.delete(`/favorites/${recipeId}`, {
      headers: { Authorization: token }
    });
    alert('Removed from favorites');
    fetchFavorites(); 
  } catch (err) {
    alert('Failed to remove');
  }
}

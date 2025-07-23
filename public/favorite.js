document.addEventListener('DOMContentLoaded', () => {
  loadCollections();
  fetchFavorites();
  document.getElementById('collectionSelect').addEventListener('change', fetchFavorites);
});

async function loadCollections() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await axios.get('/collections', {
      headers: { Authorization: token }
    });
    const collections = res.data.collections;
    const select = document.getElementById('collectionSelect');
    select.innerHTML = '<option value="">All Favorites</option>';

    collections.forEach(col => {
      const option = document.createElement('option');
      option.value = col.id;
      option.textContent = col.name;
      select.appendChild(option);
    });

    select.addEventListener('change', fetchFavorites);
  } catch (err) {
    alert('Failed to load collections');
  }
}

async function fetchFavorites() {
  const token = localStorage.getItem('token');
  if (!token) return alert('Login required');

  const collectionId = document.getElementById('collectionSelect').value;
  let url = collectionId ? `/collections/${collectionId}/favorites` : '/favorites';

  try {
    const res = await axios.get(url, { headers: { Authorization: token } });
    const favorites = res.data.favorites || res.data.collection?.Favorites || [];
    const grid = document.getElementById('favoriteGrid');
    grid.innerHTML = '';

    if (favorites.length === 0) {
      grid.innerHTML = '<p>No favorite recipes yet in this collection.</p>';
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
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <p><strong>Level:</strong> ${recipe.level || 'N/A'}</p>
            <p><strong>Diet:</strong> ${recipe.diet || 'N/A'}</p>
            <button class="btn btn-outline-danger btn-sm mb-1" onclick="removeFavorite(${fav.id})">❤️ Remove</button>
            <button class="btn btn-outline-primary btn-sm" onclick="addFavoriteToCollection(${fav.id})">➕ Add to Collection</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    alert('Failed to load favorites');
  }
}

async function removeFavorite(favoriteId) {
  const token = localStorage.getItem('token');
  if (!token) return;

  if (!confirm("Remove this from favorites?")) return;

  try {
    await axios.delete(`/favorites/${favoriteId}`, {
      headers: { Authorization: token }
    });
    alert('Removed from favorites');
    fetchFavorites();
  } catch (err) {
    alert('Failed to remove');
  }
}

async function createCollection() {
    const collectionName = prompt("Enter collection name:");
    if (!collectionName) return;

    const token = localStorage.getItem('token');
    if (!token) return alert('Login required');

    try {
        const res = await axios.post('/collections', { name: collectionName }, {
            headers: { Authorization: token }
        });
        alert('Collection created!');

        await loadCollections(); // reload the dropdown

        // Auto-select the newly created collection
        const select = document.getElementById('collectionSelect');
        select.value = res.data.collection.id; // ensure your backend returns the created collection in response
        fetchFavorites(); // refresh favorites to reflect any association if needed
    } catch (err) {
        alert('Failed to create collection');
    }
}


async function addFavoriteToCollection(favoriteId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first!');
        return;
    }

    try {
        // Fetch available collections for this user dynamically
        const res = await axios.get('/collections', {
            headers: { Authorization: token }
        });
        const collections = res.data.collections;

        if (collections.length === 0) {
            alert('No collections found. Please create a collection first.');
            return;
        }

        // Build a prompt string for user selection
        let promptMsg = "Select a collection by number:\n";
        collections.forEach((col, index) => {
            promptMsg += `${index + 1}. ${col.name}\n`;
        });

        const selection = prompt(promptMsg);
        const index = parseInt(selection) - 1;

        if (isNaN(index) || index < 0 || index >= collections.length) {
            alert('Invalid selection.');
            return;
        }

        const collectionId = collections[index].id;

        // Now send the request to add to selected collection
        await axios.post(`/collections/${collectionId}/favorites`, { favoriteId }, {
            headers: { Authorization: token }
        });

        alert(`Added to collection: ${collections[index].name}`);
        fetchFavorites();

    } catch (err) {
        alert(err.response?.data?.message || 'Failed to add to collection.');
    }
}


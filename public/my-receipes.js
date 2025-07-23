
// Fetch and display all recipes belonging to the logged-in user
async function fetchMyRecipes() {
  const token = localStorage.getItem('token');

  try {
    const res = await axios.get('/recipe/my', {
      headers: { Authorization: token }
    });

    const recipes = res.data.recipes;
    const list = document.getElementById('recipeList');
    list.innerHTML = '';

    recipes.forEach(recipe => {
      const item = document.createElement('li');
      item.setAttribute('id', `recipe-${recipe.id}`);
      item.innerHTML = `
        <strong>${(recipe.title)}</strong> - ${recipe.cookingTime} min, ${recipe.servings} servings
        <button onclick='editRecipe(${recipe.id})'>Edit</button>
        <button onclick='deleteRecipe(${recipe.id})'>Delete</button>
      `;
      list.appendChild(item);
    });
  } catch (error) {
    alert('Failed to fetch recipes.');
  }
}

// Replace the recipe view with editable fields
async function editRecipe(id) {
  const token = localStorage.getItem('token');

  try {
    const res = await axios.get(`/recipe/${id}`, {
      headers: { Authorization: token }
    });

    const recipe = res.data.recipe;
    const item = document.querySelector(`#recipe-${id}`);

    item.innerHTML = `
      <input type="text" id="title-${id}" value="${(recipe.title)}" placeholder="Title"/><br/>
      <textarea id="ingredients-${id}" placeholder="Ingredients">${(recipe.ingredients)}</textarea><br/>
      <textarea id="instructions-${id}" placeholder="Instructions">${(recipe.instructions)}</textarea><br/>
      <input type="number" id="time-${id}" value="${recipe.cookingTime}" placeholder="Cooking Time"/> min<br/>
      <input type="number" id="servings-${id}" value="${recipe.servings}" placeholder="Servings"/> servings<br/>
      <input type="text" id="imageUrl-${id}" value="${(recipe.imageUrl || '')}" placeholder="Image URL (optional)"/><br/>
      <button id="save-button-${id}" onclick="saveRecipe(${id})">Save</button>
      <button onclick="fetchMyRecipes()">Cancel</button>
    `;
  } catch (error) {
    alert('Failed to load recipe.');
  }
}

// Save the edited recipe
async function saveRecipe(id) {
  const token = localStorage.getItem('token');

  const title = document.getElementById(`title-${id}`).value.trim();
  const ingredients = document.getElementById(`ingredients-${id}`).value.trim();
  const instructions = document.getElementById(`instructions-${id}`).value.trim();
  const cookingTime = parseInt(document.getElementById(`time-${id}`).value);
  const servings = parseInt(document.getElementById(`servings-${id}`).value);
  const imageUrl = document.getElementById(`imageUrl-${id}`).value.trim();

  if (!title || !ingredients || !instructions || !cookingTime || !servings) {
    alert('All fields except Image URL are required.');
    return;
  }

  try {
    const saveButton = document.querySelector(`#save-button-${id}`);
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    await axios.put(`/recipe/${id}`, {
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      imageUrl
    }, {
      headers: { Authorization: token }
    });

    alert('Recipe updated.');
    fetchMyRecipes();
  } catch (error) {
    alert('Failed to update recipe.');
  }
}

// Delete a recipe
async function deleteRecipe(id) {
  const token = localStorage.getItem('token');

  try {
    if (confirm('Are you sure you want to delete this recipe?')) {
      await axios.delete(`/recipe/${id}`, {
        headers: { Authorization: token }
      });
      alert('Recipe deleted.');
      fetchMyRecipes();
    }
  } catch (error) {
    alert('Failed to delete recipe.');
  }
}

// Initial load
fetchMyRecipes();

window.addEventListener('load', fetchMyRecipes);


async function fetchMyRecipes() {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get('http://localhost:3000/recipe/my', {
      headers: { Authorization: token }
    });

    const recipes = res.data.recipes;
    const list = document.getElementById('recipeList');
    list.innerHTML = '';

    recipes.forEach(recipe => {
  const item = document.createElement('li');
  item.setAttribute('id', `recipe-${recipe.id}`);
  item.className = 'list-group-item';

  item.innerHTML = `
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
      <div>
        <strong>${recipe.title}</strong> - ${recipe.cookingTime} min, ${recipe.servings} servings
      </div>
      <div class="mt-2 mt-md-0">
        <button class="btn btn-sm btn-primary me-2" onclick='editRecipe(${recipe.id})'>✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick='deleteRecipe(${recipe.id})'>🗑️ Delete</button>
      </div>
    </div>
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
    const res = await axios.get(`http://localhost:3000/recipe/${id}`, {
      headers: { Authorization: token }
    });

    const recipe = res.data.recipe;

    const item = document.querySelector(`#recipe-${id}`);

   item.innerHTML = `
  <div class="mb-2">
    <input type="text" class="form-control mb-2" id="title-${id}" value="${recipe.title}" placeholder="Title"/>
    <textarea class="form-control mb-2" id="ingredients-${id}" placeholder="Ingredients">${recipe.ingredients}</textarea>
    <textarea class="form-control mb-2" id="instructions-${id}" placeholder="Instructions">${recipe.instructions}</textarea>
    <input type="number" class="form-control mb-2" id="time-${id}" value="${parseInt(recipe.cookingTime)}" placeholder="Cooking Time (min)"/>
    <input type="number" class="form-control mb-2" id="servings-${id}" value="${recipe.servings}" placeholder="Servings"/>
    <input type="file" id="imageFile-${id}" class="form-control mb-2" accept="image/*"/>
    <input type="text" class="form-control mb-2" id="level-${id}" value="${recipe.level || ''}" placeholder="Level (easy/medium/hard)"/>
    <input type="text" class="form-control mb-2" id="diet-${id}" value="${recipe.diet || ''}" placeholder="Diet (vegan, vegetarian, etc)"/>
  </div>
  <div>
    <button id="save-button-${id}" class="btn btn-success me-2" onclick="saveRecipe(${id})">💾 Save</button>
    <button class="btn btn-secondary" onclick="fetchMyRecipes()">Cancel</button>
  </div>
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
  const level = document.getElementById(`level-${id}`).value.trim();
  const diet = document.getElementById(`diet-${id}`).value.trim();

  const imageFileInput = document.getElementById(`imageFile-${id}`);
  const imageFile = imageFileInput.files[0];

  if (!title || !ingredients || !instructions || !cookingTime || !servings) {
    alert('All fields except image are required.');
    return;
  }

  try {
    const saveButton = document.querySelector(`#save-button-${id}`);
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    let imageUrl = '';

    if (imageFile) {
      // Get signed URL
      const { data: presignedData } = await axios.get('http://localhost:3000/s3url', {
        headers: { Authorization: token },
        params: { contentType: imageFile.type }
      });

      imageUrl = presignedData.url.split('?')[0];

      // Upload to S3
      await axios.put(presignedData.url, imageFile, {
        headers: { 'Content-Type': imageFile.type }
      });
    } else {
      // Fetch the existing recipe to get current imageUrl
      const { data } = await axios.get(`http://localhost:3000/recipe/${id}`, {
        headers: { Authorization: token }
      });
      imageUrl = data.recipe.imageUrl || '';
    }

    // Update recipe
    await axios.put(`http://localhost:3000/recipe/${id}`, {
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      level,
      diet,
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
      await axios.delete(`http://localhost:3000/recipe/${id}`, {
        headers: { Authorization: token }
      });
      alert('Recipe deleted.');
      fetchMyRecipes();
    }
  } catch (error) {
    alert('Failed to delete recipe.');
  }
}


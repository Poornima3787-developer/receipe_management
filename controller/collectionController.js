 (Express)
```js
// GET /recipe - get all recipes
router.get('/', async (req, res) => {

### Frontend (recipes.html)
```html
<input type="text" id="searchInput" placeholder="Search recipes..." />
<select id="dietSelect">
  <option value="">All</option>
  <option value="vegan">Vegan</option>
  <option value="vegetarian">Vegetarian</option>
</select>
<select id="difficultySelect">
  <option value="">All</option>
  <option value="easy">Easy</option>
  <option value="medium">Medium</option>
  <option value="hard">Hard</option>
</select>
<input type="number" id="maxTime" placeholder="Max Time (min)" />
<button onclick="searchRecipes()">Search</button>
<div id="recipeResults"></div>
```

```js
async function searchRecipes() {
  const query = document.getElementById('searchInput').value;
  const diet = document.getElementById('dietSelect').value;
  const difficulty = document.getElementById('difficultySelect').value;
  const maxTime = document.getElementById('maxTime').value;

  let url = '/recipe/search?query=' + encodeURIComponent(query);
  if (diet || difficulty || maxTime) {
    url = `/recipe/filter?diet=${diet}&difficulty=${difficulty}&maxTime=${maxTime}`;
  }

  const res = await axios.get(url);
  const recipes = res.data.recipes;

  const container = document.getElementById('recipeResults');
  container.innerHTML = '';

  recipes.forEach(recipe => {
    const div = document.createElement('div');
    div.innerHTML = `<h4>${recipe.title}</h4><p>${recipe.ingredients}</p>`;
    container.appendChild(div);
  });
}
```

Let me know when you're ready for the full backend+frontend implementation of the next feature:

1. Favorites
2. Collections
3. Rating & Reviews
4. Follow + Feed
5. Admin Dashboard

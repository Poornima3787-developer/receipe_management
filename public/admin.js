const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
  if (!token) {
    alert("Login required");
    window.location.href = "/login.html";
    return;
  }
  loadUsers();
  loadRecipes();
});

async function loadUsers() {
  try {
    const res = await axios.get('/admin/users', {
      headers: { Authorization: token }
    });
    const container = document.getElementById('userList');
    container.innerHTML = '';
    res.data.users.forEach(user => {
      const div = document.createElement('div');
      div.className = 'border p-2 mb-2 d-flex justify-content-between align-items-center';
      div.innerHTML = `
        <div><strong>${user.name}</strong> (${user.email}) - ${user.status}</div>
        <div>
          <button class="btn btn-sm btn-warning" onclick="changeStatus('${user.id}', 'banned')">Ban</button>
          <button class="btn btn-sm btn-success" onclick="changeStatus('${user.id}', 'approved')">Approve</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

async function changeStatus(userId, status) {
  try {
    await axios.put(`/admin/users/${userId}/status`, { status }, {
      headers: { Authorization: token }
    });
    loadUsers();
  } catch (err) {
    alert("Failed to update user status.");
  }
}

async function deleteUser(userId) {
  try {
    await axios.delete(`/admin/users/${userId}`, {
      headers: { Authorization: token }
    });
    loadUsers();
  } catch (err) {
    alert("Failed to delete user.");
  }
}

async function loadRecipes() {
  try {
    const res = await axios.get('/admin/recipes', {
      headers: { Authorization: token }
    });
    const container = document.getElementById('recipeList');
    container.innerHTML = '';
    res.data.recipes.forEach(recipe => {
      const div = document.createElement('div');
      div.className = 'border p-2 mb-2 d-flex justify-content-between align-items-center';
      div.innerHTML = `
        <div>
          <strong>${recipe.title}</strong> by ${recipe.User?.name || 'Unknown'}
        </div>
        <button class="btn btn-sm btn-danger" onclick="deleteRecipe('${recipe.id}')">Delete</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

async function deleteRecipe(recipeId) {
  try {
    await axios.delete(`/admin/recipes/${recipeId}`, {
      headers: { Authorization: token }
    });
    loadRecipes();
  } catch (err) {
    alert("Failed to delete recipe.");
  }
}

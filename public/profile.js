const backendUrl = 'http://localhost:3000/users'; // Update for production if needed

document.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();
  loadUsersToFollow();
});

async function loadUserProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first.');
    window.location.href = '/login.html';
    return;
  }
  try {
    const response = await axios.get(`${backendUrl}/profile`, {
      headers: { Authorization: token }
    });
    const user = response.data.user;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userEmail').innerText = user.email;
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to load profile.');
  }
}

async function updateProfileForm(event) {
  event.preventDefault();
  const name = event.target.name.value.trim();
  const email = event.target.email.value.trim();
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first.');
    window.location.href = "/login.html";
    return;
  }
  try {
    await axios.put(`${backendUrl}/profile`, { name, email }, {
      headers: { Authorization: token }
    });
    alert('Profile updated successfully.');
    location.reload();
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to update profile.');
  }
}

async function loadUsersToFollow() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const res = await axios.get(`${backendUrl}/all`, { headers: { Authorization: token } });
    const users = res.data.users;
    const container = document.getElementById('userList');
    container.innerHTML = '';
    users.forEach(user => {
      const div = document.createElement('div');
      div.className = 'card p-3 mb-2';
      div.innerHTML = `
        <h5>${user.username}</h5>
        <button class="btn btn-sm btn-primary" onclick="followUser(${user.id})">Follow</button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error(error);
    alert('Failed to load users.');
  }
}

async function followUser(userId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to follow users.');
    return;
  }
  try {
    await axios.post(`/follow/${userId}`, {}, { headers: { Authorization: token } });
    alert('You are now following this user.');
    loadUsersToFollow(); // Refresh list to disable already followed users if you update backend to reflect
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to follow user.');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
}

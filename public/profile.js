const backendUrl = 'http://localhost:3000/users';

document.addEventListener('DOMContentLoaded', async () => {
  const userId = new URLSearchParams(window.location.search).get('id');
  if (userId) {
    await loadOtherUserProfile(userId);
  } else {
    await loadUserProfile();
  }
});

async function loadUserProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first.');
    window.location.href = '/login';
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

async function loadOtherUserProfile(userId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first.');
    window.location.href = '/login';
    return;
  }

  try {
    const response = await axios.get(`${backendUrl}/${userId}`, {
      headers: { Authorization: token }
    });
    const user = response.data.user;

    document.getElementById('userName').innerText = user.name;
    document.getElementById('userEmail').innerText = user.email;
    if (user.profileImageUrl) {
      document.getElementById('userImage').src = user.profileImageUrl;
    }

    // Hide update form for other profiles
    document.getElementById('updateForm').style.display = 'none';

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to load user profile.');
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



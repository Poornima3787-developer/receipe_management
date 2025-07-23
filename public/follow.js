document.addEventListener('DOMContentLoaded', loadUsers);

async function loadUsers() {
  const token = localStorage.getItem('token');
  const userList = document.getElementById('userList');

  try {
    const res = await axios.get('/users/all', {
      headers: { Authorization: token }
    });

    const followRes = await axios.get('/follow/following', {
      headers: { Authorization: token }
    });

    const followingIds = followRes.data.following.map(f => f.Following.id);

    res.data.users.forEach(user => {
      const isFollowing = followingIds.includes(user.id);
      const div = document.createElement('div');
      div.className = 'd-flex justify-content-between align-items-center border p-2 mb-2 rounded';

      div.innerHTML = `
        <div><strong>${user.name}</strong></div>
        <button class="btn ${isFollowing ? 'btn-danger' : 'btn-primary'}" onclick="${isFollowing ? 'unfollowUser' : 'followUser'}(${user.id}, this)">
          ${isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      `;

      userList.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    userList.innerHTML = '<p>Error loading users.</p>';
  }
}

async function followUser(userId, btn) {
  const token = localStorage.getItem('token');
  try {
    await axios.post(`follow/follow/${userId}`, {}, {
      headers: { Authorization: token }
    });
    alert('You are now following this user!');
    window.location.href = '/feed';
    btn.textContent = 'Unfollow';
    btn.className = 'btn btn-danger';
    btn.setAttribute('onclick', `unfollowUser(${userId}, this)`);
  } catch (err) {
    alert('Failed to follow user');
  }
}

async function unfollowUser(userId, btn) {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`follow/unfollow/${userId}`, {
      headers: { Authorization: token }
    });
    btn.textContent = 'Follow';
    btn.className = 'btn btn-primary';
    btn.setAttribute('onclick', `followUser(${userId}, this)`);
  } catch (err) {
    alert('Failed to unfollow user');
  }
}

async function loadActivityFeed() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to view the activity feed.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await axios.get('/activity-feed', {
      headers: { Authorization: token }
    });
    const { recipes, reviews } = res.data;
    const container = document.getElementById('activityFeed');
    container.innerHTML = '';

    if (recipes.length === 0 && reviews.length === 0) {
      container.innerHTML = '<p class="text-center">No recent activities from users you follow.</p>';
      return;
    }

    recipes.forEach(r => {
      const div = document.createElement('div');
      div.className = 'feed-item';
      div.innerHTML = `🍽️ <strong>${r.User.username}</strong> added a new recipe: <strong>${r.title}</strong>`;
      container.appendChild(div);
    });

    reviews.forEach(rv => {
      const div = document.createElement('div');
      div.className = 'feed-item';
      div.innerHTML = `⭐ <strong>${rv.User.username}</strong> reviewed <strong>${rv.Recipe.title}</strong>: ${rv.rating}/5 - "${rv.comment}"`;
      container.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    alert('Failed to load activity feed.');
  }
}

loadActivityFeed();
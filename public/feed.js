document.addEventListener('DOMContentLoaded', loadActivityFeed);

async function loadActivityFeed() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to view the activity feed.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await axios.get('/follow/activity-feed', {
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
      div.innerHTML = `
        🍽️ <strong>${r.User.username || r.User.name}</strong> added a new recipe: 
        <strong class="text-primary" style="cursor:pointer;" onclick="toggleFeedDetails(${r.id})">${r.title}</strong>
        ${r.imageUrl ? `<img src="${r.imageUrl}" class="img-fluid rounded mt-2" style="max-height:200px;">` : ''}
        <div id="feed-details-${r.id}" style="display:none; margin-top:5px;">
          <p><strong>Cooking Time:</strong> ${r.cookingTime} min</p>
          <p><strong>Servings:</strong> ${r.servings}</p>
          <p><strong>Ingredients:</strong> ${r.ingredients}</p>
          <p><strong>Instructions:</strong> ${r.instructions}</p>
          <p><strong>Level:</strong> ${r.level || 'N/A'}</p>
          <p><strong>Diet:</strong> ${r.diet || 'N/A'}</p>
        </div>
      `;
      container.appendChild(div);
    });

    reviews.forEach(rv => {
      const div = document.createElement('div');
      div.className = 'feed-item';
      div.innerHTML = `
        ⭐ <strong>${rv.User.username || rv.User.name}</strong> reviewed 
        <strong>${rv.Recipe.title}</strong>: ${rv.rating}/5 - "${rv.comment}"`;
      container.appendChild(div);
    });

  } catch (error) {
    alert('Failed to load activity feed.');
  }
}

function toggleFeedDetails(id) {
  const details = document.getElementById(`feed-details-${id}`);
  details.style.display = (details.style.display === 'none' || details.style.display === '') ? 'block' : 'none';
}

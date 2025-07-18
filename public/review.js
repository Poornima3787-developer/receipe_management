async function submitReview(recipeId) {
  const token = localStorage.getItem('token');
  const rating = parseInt(document.getElementById('reviewRating').value);
  const comment = document.getElementById('reviewComment').value.trim();

  if (!rating || !comment) {
    alert('Please enter rating and comment.');
    return;
  }

  try {
    await axios.post('/reviews', { recipeId, rating, comment }, {
      headers: { Authorization: token }
    });
    alert('Review submitted!');
    loadReviews(recipeId);
  } catch (error) {
    console.error(error);
    alert('Failed to submit review.');
  }
}

async function loadReviews(recipeId) {
  try {
    const res = await axios.get(`/reviews/${recipeId}`);
    const reviews = res.data.reviews;
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = '';

    if (reviews.length === 0) {
      container.innerHTML = '<p>No reviews yet.</p>';
    } else {
      reviews.forEach(r => {
        const div = document.createElement('div');
        div.className = 'border p-2 mb-2';
        div.innerHTML = `
          <strong>${r.User.username}</strong> ⭐ ${r.rating}/5
          <p>${r.comment}</p>
        `;
        container.appendChild(div);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

const backendUrl = 'http://localhost:3000/recipe';

async function recipeForm(event) {
  event.preventDefault();
  const form = event.target;

  const title = form.title.value;
  const ingredients = form.ingredients.value;
  const instructions = form.instructions.value;
  const cookingTime = form.cookingTime.value;
  const servings = form.servings.value;
  const level = form.level.value;
  const diet = form.diet.value;
  const imageFile = form.image.files[0];

  const token = localStorage.getItem('token');


  try {
    // Step 1: Get signed URL from backend
    const { data: presignedData } = await axios.get('http://localhost:3000/s3url', {
      headers: { Authorization: token },
      params: { contentType: imageFile.type }
    });

    const imageUrl = presignedData.url.split('?')[0];

    // Step 2: Upload image to S3
  
  await axios.put(presignedData.url, imageFile, {
    headers: { 'Content-Type': 'image/jpeg' }
  });

    // Step 3: Post recipe with image URL
    await axios.post(backendUrl, {
      title, ingredients, instructions, cookingTime, servings, image: imageUrl, level, diet
    }, {
      headers: { Authorization: token }
    });

    alert('Recipe created successfully!');
    form.reset();
  } catch (error) {
    console.error(error);
    alert('Error creating recipe.');
  }
}

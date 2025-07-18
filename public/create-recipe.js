const backendUrl = 'http://localhost:3000/recipe';

async function recipeForm(event){
  event.preventDefault();

  const title=event.target.title.value;
  const ingredients=event.target.ingredients.value;
  const instructions=event.target.instructions.value;
  const cookingTime=event.target.cookingTime.value;
  const servings=event.target.servings.value;
  const image=event.target.image.value;
  const level=event.target.level.value;
  const diet=event.target.diet.value;

  const token = localStorage.getItem('token'); 

  try {
    const response=await axios.post(`${backendUrl}`,{title,ingredients,instructions,cookingTime,servings,image,level,diet},{headers:{Authorization:token}});
    alert('Recipe created successfully!');
    form.reset();
  } catch (error) {
   console.error(error);
   alert('Error creating recipe.'); 
  }
}
const backendUrl = 'http://localhost:3000/users';

async function loginForm(event) {
  event.preventDefault();

  const email=event.target.email.value;
  const password=event.target.password.value;

  try {
    const response=await axios.post(`${backendUrl}/login`,{email,password});
    const token=response.data.token;
    localStorage.setItem('token',token);
    alert("Login Successful!");
   window.location.href = '/create-recipe.html'
  } catch (error) {
    alert(error.response?.data?.message || "Login failed!");
  }
  
}
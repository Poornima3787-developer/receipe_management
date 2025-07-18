const backendUrl = 'http://localhost:3000/users';

async function registerForm(event){
  event.preventDefault();

  const name=event.target.name.value;
  const email=event.target.email.value;
  const password=event.target.password.value;

  try {
    const response=await axios.post(`${backendUrl}/register`,{name,email,password});

    alert('successfully registered');

    window.location.href="/login"
    
  } catch (error) {
    alert('Registration failed');
    console.error(error);
  }
}
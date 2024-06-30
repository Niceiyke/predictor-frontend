//const baseUrl = 'http://127.0.0.1:8000/api/';
const baseUrl ='https://predictor-backend-omega.vercel.app/api/'

export const loginUser = async (data: UserLogin) => {
  try {
    const res = await fetch(`${baseUrl}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (data: UserRegistration) => {
  try {
    const res = await fetch(`${baseUrl}auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const baseUrl='https://predictor-backend-omega.vercel.app'

export const loginUser =async(data:UserLogin)=>{
    const res =await fetch(`${baseUrl}/auth/login`,{
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
       
        body: JSON.stringify(data), 
      
    })
    return res
    
}  

export const registerUser =async(data:UserRegistration)=>{
  const res =await fetch(`${baseUrl}auth/register`,{
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
     
      body: JSON.stringify(data), 
    
  })
  return res
  
}  
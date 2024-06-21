import axios from 'axios';


export const axiosInstance =axios.create({
    baseURL:"http://127.0.0.1:8000/api"
})

axiosInstance.interceptors.request.use(
    (config) => {

        const headers= {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${JSON.parse(localStorage.getItem("pred-token"))}`
        }
        // Modify the req
        config.headers.Authorization=headers.Authorization
        config.headers['Content-Type']=headers['Content-Type']
               
        return config;
      },
      (error) => {
        // Handle request errors here
    
        return Promise.reject(error);
      }
)
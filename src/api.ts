import { AxiosRequestConfig } from 'axios';


const serverBaseUrl : string = import.meta.env.VITE_SERVER_BASE_URL
export const userAuthUrl: string = `${serverBaseUrl}/auth`
export const userBaseUrl: string = `${serverBaseUrl}/users`
export const taskBaseUrl: string = `${serverBaseUrl}/tasks`


export const token = localStorage.getItem('token')
export const header:AxiosRequestConfig = {
    headers :{
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`}:{})
        
    },
    // withCredentials: true // 🔥 KEY: allows cookies to be sent/received
}
import Axios from "axios"
import {env} from "./env"

export const url = env.IS_API_URL
export const token = env.IS_API_TOKEN

console.info("Creating API client for Impressive Strawberry at", url)

export const api = Axios.create({
    baseURL: url,
    headers: {
        "Authorization": `Bearer ${token}`
    }
})

console.info("Creation complete!")

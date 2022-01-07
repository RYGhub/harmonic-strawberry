import {Axios} from "axios"

export const url = process.env.HS_API_URL
export const token = process.env.HS_API_TOKEN

console.info("Creating API client for Impressive Strawberry at", url)

export const api = new Axios({
    baseURL: url,
    headers: {
        "Authorization": `Bearer ${token}`
    }
})

console.info("Creation complete!")

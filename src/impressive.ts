import {Axios} from "axios"


export const api = new Axios({
    baseURL: process.env.HS_API_URL,
    headers: {
        "Authorization": `Bearer ${process.env.HS_API_TOKEN}`
    }
})

import Axios from "axios"
import {env} from "./env"

export const url = env.IS_API_URL
export const token = env.IS_API_TOKEN

export const rest = Axios.create({
    baseURL: url,
    headers: {
        "Authorization": `Bearer ${token}`
    }
})

export async function editResource<T>(url, data, options) {
    const initialResponse = await rest.get<T>(url, options)
    return await rest.put<T>(url, {...initialResponse.data, ...data}, options)
}
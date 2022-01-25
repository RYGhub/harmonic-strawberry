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

export async function editResource<T extends {}>(url: string, data: Partial<T>, options): Promise<T> {
    console.debug("[Impressive] Editing resource:", url)
    const initialResponse = await rest.get<T>(url, options)

    const newObject = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
    const secondResponse = await rest.put<T>(url, {...initialResponse.data, ...newObject}, options)

    return secondResponse.data
}
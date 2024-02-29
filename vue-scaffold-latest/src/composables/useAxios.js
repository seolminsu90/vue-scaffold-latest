import axios from 'axios'

const env = import.meta.env

export const useAxios = () => {
    const createAxios = (env) => {
        let options = {
            baseURL: '',
            timeout: 60000,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
        }

        options.baseURL = env.VITE_API_HOST
        return axios.create(options)
    }

    return createAxios(env)
}

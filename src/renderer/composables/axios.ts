import {AxiosRequestConfig, AxiosResponse} from "axios";
import {app} from "@/renderer";
import {useSessionStore} from "@/renderer/store/session";
import {useToast} from "vue-toastification";
import log from 'electron-log/renderer';

export interface UseAxios {
    init(): void
    setBearerToken(token: string): void
    removeBearerToken(): void
    get<D>(url: string): Promise<AxiosResponse<D>>
    post<T,D>(url: string, data?: T, params?: AxiosRequestConfig<T>): Promise<AxiosResponse<D>>
    put<T,D>(url: string, data?: T, params?: AxiosRequestConfig<T>): Promise<AxiosResponse<D>>
    patch<T,D>(url: string, data?: T, params?: AxiosRequestConfig<T>): Promise<AxiosResponse<D>>
    delete<D>(url: string): Promise<AxiosResponse<D>>
}

export function useAxios(): UseAxios {
    const toast = useToast()
    const store = useSessionStore()
    const {clearSession} = store

    const init = () => {
        log.info('🚀 Axios initialized')
        app.axios.defaults.baseURL = 'https://sendcrypt.sib.swiss/api/v1'
        app.axios.defaults.timeout = 3000
        app.axios.defaults.headers.common['Content-Type'] = 'application/json'
        app.axios.defaults.headers.common['Accept'] = 'application/json'

        app.axios.interceptors.response.use(
            (response) => {
                return response
            },
            (error) => {
                if (error.code === 'ERR_NETWORK') {
                    toast.error('Server is not reachable, please check your connection', {
                        timeout: 0,
                    })
                    log.error(error)
                    return
                }

                if (error.code === 'ECONNABORTED') {
                    toast.error('Request timeout, please check your connection', {
                        timeout: 0,
                    })
                    log.error(error)
                    return
                }

                if (error.response?.status === 401) {
                    removeBearerToken()
                    clearSession()
                    toast.error('Session expired, please login again', {
                        timeout: 0,
                    })
                    log.error(error)
                    return
                }

                return Promise.reject(error)
            }
        )
    }

    const setBearerToken = (token: string) => {
        app.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    const removeBearerToken = () => {
        delete app.axios.defaults.headers.common['Authorization']
    }

    const get = <D>(url: string): Promise<AxiosResponse<D>> => {
        return app.axios.get(url)
    }

    const post = <T,D>(url: string, data?: T, params?: AxiosRequestConfig<T>): Promise<AxiosResponse<D>> => {
        return app.axios.post(url, data, params)
    }

    const put = <T,D>(url: string, data?: T, params?: AxiosRequestConfig<T>): Promise<AxiosResponse<D>> => {
        return app.axios.put(url, data, params)
    }

    const patch = <T,D>(url: string, data?: T, params?: AxiosRequestConfig<T>): Promise<AxiosResponse<D>> => {
        return app.axios.patch(url, data, params)
    }

    const delete_ = <D>(url: string): Promise<AxiosResponse<D>> => {
        return app.axios.delete(url)
    }

    return {
        init,
        setBearerToken,
        removeBearerToken,
        get,
        post,
        put,
        patch,
        delete: delete_
    }
}
import {useSessionStore} from "@/renderer/store/session";
import {useAxios} from "@/renderer/composables/axios";
import {storeToRefs} from "pinia";
import log from 'electron-log/renderer';

interface LoginRequest {
    email: string
    password: string
    device_name: string
}

interface LoginResponse {
    token: string
    email: string
    expires_at: string | null
}

interface UserResponse {
    name: string
    full_name: string
    email: string
}

export interface UseAuthenticator {
    login(params: LoginRequest): Promise<LoginResponse>

    logout(): Promise<void>

    check(): void
}

export function useAuthenticator(): UseAuthenticator {
    const {get, post, setBearerToken, removeBearerToken} = useAxios()
    const store = useSessionStore()
    const {setSession, clearSession} = store
    const {isAuthenticated} = storeToRefs(store)

    const login = async (body: LoginRequest) => {
        return post<LoginRequest, LoginResponse>('/login', body)
            .then((response) => {
                setSession(response.data)
                setBearerToken(response.data.token)
                return Promise.resolve(response.data)
            })
            .catch((error) => {
                return Promise.reject(error)
            })
    }

    const logout = async () => {
        return post<undefined, void>('/logout').then(() => {
            return Promise.resolve()
        }).finally(() => {
            clearSession()
            removeBearerToken()
        })
    }

    const check = () => {
        if (!isAuthenticated.value) {
            return
        }
        log.info('🌐 Checking session')
        return get<UserResponse>('/user')
    }

    return {
        login,
        logout,
        check
    }
}

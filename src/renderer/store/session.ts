import {defineStore} from "pinia";
import {Ref, ref, computed} from "vue";
import {useAxios} from "@/renderer/composables/axios";
import log from 'electron-log/renderer';

declare interface Session {
    token: string | null
    email: string | null
    expires_at: string | null
}

export const useSessionStore = defineStore('session', () => {
    const passphrase: Ref<string> = ref('')
    const session: Ref<Session | null> = ref(null)
    const isAuthenticated = computed(() => session.value !== null)
    const email = computed(() => session.value?.email)

    function savePassphrase(input: string) {
        passphrase.value = input
    }

    function hasPassphrase() {
        return passphrase.value !== null || passphrase.value !== ''
    }

    function setSession(data: Session) {
        session.value = data
        localStorage.setItem('session', JSON.stringify(data))
    }

    function loadSession() {
        log.info('🔒 Session initialized')
        const { setBearerToken } = useAxios()
        const data = localStorage.getItem('session')
        if (data) {
            session.value = JSON.parse(data)
            setBearerToken(session.value.token)
        }
    }

    function clearSession() {
        session.value = null
        localStorage.removeItem('session')
    }

    return {
        passphrase,
        savePassphrase,
        hasPassphrase,
        session,
        isAuthenticated,
        email,
        loadSession,
        setSession,
        clearSession,
    }
})
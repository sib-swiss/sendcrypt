import {defineStore} from "pinia";
import {computed, Ref, ref} from "vue";
import {Settings, Theme} from "@/types";
import {useTheme} from "vuetify";
import {useToast} from "vue-toastification";
import log from 'electron-log/renderer';

const ipcRenderer = window.ipcRenderer
const toast = useToast()

export const useSettingsStore = defineStore('settings', () => {
    const vuetifyTheme = useTheme()


    const settings: Ref<Settings> = ref({
        sshPrivateKeyPath: null,
        sshPublicKeyPath: null,
        sshPassphrase: null,
        tmpDir: null,
        signMetadata: null,
        theme: null,
        selectedProfile: null,
        signingKey: null,
        X25519PublicSessionKey: null,
        X25519PrivateSessionKey: null,
    })

    const isDarkTheme = computed(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        return mq.matches
    })

    const loadSettings = () => {
        log.info('⚙️ Settings loaded')
        ipcRenderer.invoke('settings:all').then((data: Settings) => {
            settings.value = data
            activateTheme()
        })
    }

    const setSetting = (key: keyof Settings, value: boolean | string | number | null) => {
        ipcRenderer.invoke('settings:set', key, value).then((storedValue: never) => {
            if (storedValue !== undefined) {
                settings.value[key] = storedValue
                toast.success('Settings updated')
            }
        })
    }

    const activateTheme = (theme?: Theme) => {
        if (theme === undefined) {
            theme = settings.value.theme
        }
        vuetifyTheme.global.name.value = theme
    }

    const generateSshKey = async () => {
        ipcRenderer.invoke('ssh:generate').then((data: {sshPrivateKeyPath: string, sshPublicKeyPath: string}) => {
            settings.value.sshPrivateKeyPath = data.sshPrivateKeyPath
            settings.value.sshPublicKeyPath = data.sshPublicKeyPath
            toast.success('SSH keys generated')
        })
    }

    return { settings, isDarkTheme, loadSettings, setSetting, activateTheme, generateSshKey }
})
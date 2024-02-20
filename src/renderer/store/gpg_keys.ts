import {defineStore} from "pinia";
import {computed, Ref, ref} from "vue";
import {GpgKeyIdentity} from "@/types";
import {useSettingsStore} from "@/renderer/store/settings";
import {useToast} from "vue-toastification";
import {decryptKey, generateKey, readPrivateKey} from "openpgp";
import {useSessionStore} from "@/renderer/store/session";
import {useErrors} from "@/renderer/composables/errors";
import log from 'electron-log/renderer';

const ipcRenderer = window.ipcRenderer
const toast = useToast()

export const useGpgKeyStore = defineStore('gpg_keys', () => {
    const settings = useSettingsStore()
    const session = useSessionStore()
    const {savePassphrase} = session
    const {formatError} = useErrors()

    const gpgKeys: Ref<Array<GpgKeyIdentity>> = ref([])

    const gpgKeysList = computed(() => {
        const list = gpgKeys.value.map(gpgKey => {
            return {id: gpgKey.id, identity: `${gpgKey.uid} - ${gpgKey.fingerprint}`}
        })
        list.unshift({id: null, identity: '<None>'})
        return list
    })

    const loadGpgKeys = () => {
        log.info('🔑 GPG keys loaded')
        ipcRenderer.invoke('gpg:list').then((storeGpgKeys: Array<GpgKeyIdentity>) => {
            gpgKeys.value = storeGpgKeys
        })
    }

    const currentGpgKey = computed(() => {
        const selectedGpgKey = settings.settings.signingKey

        if (selectedGpgKey === null) {
            return null
        }

        return gpgKeys.value.find(gpgKey => gpgKey.id === settings.settings.signingKey)
    })

    const importGpgKey = () => {
        ipcRenderer.invoke('gpg:import').then((keys: GpgKeyIdentity | undefined) => {
            if (keys === undefined) {
                return
            }
            gpgKeys.value.push(keys)
            settings.setSetting('signingKey', keys.id)
            toast.success('GPG key successfully imported')
        }).catch((error: Error) => {
            toast.error(formatError(error.message), {
                timeout: 0,
            })
            log.error(error)
        })
    }

    const generateGpgKey = async (email: string, passphrase: string) => {
        const {privateKey, publicKey} = await generateKey({
            type: 'rsa',
            rsaBits: 4096,
            userIDs: [{name: 'SendCrypt', email: email}],
            passphrase: passphrase,
            format: 'armored'
        })

        const loadedPrivateKey = await readPrivateKey({armoredKey: privateKey})

        const keys = {
            private_key: privateKey,
            public_key: publicKey,
            uid: `SendCrypt <${email}>`,
            fingerprint: loadedPrivateKey.getFingerprint()
        }

        ipcRenderer.invoke('gpg:add', JSON.stringify(keys)).then((id: number) => {
            const storedKeys = {id, ...keys}
            gpgKeys.value.push(storedKeys)
            settings.setSetting('signingKey', id as number)
            toast.success('GPG keys successfully generated')
        }).catch((error: Error) => {
            toast.error(formatError(error.message), {
                timeout: 0,
            })
            log.error(error)
        })
    }

    const loadGpgKey = (id: number) => {
        ipcRenderer.invoke('gpg:load', id).then(() => {
            settings.setSetting('signingKey', id as number)
        })
    }

    const verifyPassphrase = async (passphrase: string, privateKeyArmored?: string): Promise<boolean> => {
        if (privateKeyArmored === undefined) {
            privateKeyArmored = currentGpgKey.value?.private_key
        }

        if (privateKeyArmored === undefined) {
            return true
        }

        try {
            await decryptKey({
                privateKey: await readPrivateKey({armoredKey: privateKeyArmored}),
                passphrase: passphrase
            })
            return true
        } catch (error) {
            if (error.message === 'Error decrypting private key: Key packet is already decrypted.') {
                savePassphrase(undefined)
                return true
            }
            return false
        }
    }


    return {gpgKeys, gpgKeysList, loadGpgKeys, currentGpgKey, importGpgKey, generateGpgKey, loadGpgKey, verifyPassphrase}
})
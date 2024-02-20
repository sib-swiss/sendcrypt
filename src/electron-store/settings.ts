import Store from 'electron-store';
import {app, safeStorage} from "electron";
import {Settings} from "@/types";
import path from "node:path";
import {Keys} from "@/lib/keys";

const store = new Store<Settings>({
    name: 'sendcrypt-settings',
    watch: true,
    encryptionKey: 'this_only_obfuscates',
    defaults: {
        sshPrivateKeyPath: path.join(app.getPath('home'), '.ssh', 'id_rsa'),
        sshPublicKeyPath: path.join(app.getPath('home'), '.ssh', 'id_rsa.pub'),
        sshPassphrase: null,
        tmpDir: app.getPath('temp'),
        signMetadata: false,
        selectedProfile: null,
        signingKey: null,
        theme: 'system',
        X25519PrivateSessionKey: null,
        X25519PublicSessionKey: null,
    }
})

export const initializeSessionKeys = async () => {
    const keys = new Keys()
    const { sessionPrivateKey, sessionPublicKey} = await keys.generateSessionKeys()
    setSetting('X25519PrivateSessionKey', sessionPrivateKey)
    setSetting('X25519PublicSessionKey', sessionPublicKey)
}

export const setSetting = (key: keyof Settings, value: string | boolean | number | Uint8Array) => {

    if (value === undefined || value === null || value === '') {
        store.set(key, null)
        return null;
    }

    if (!safeStorage.isEncryptionAvailable()) {
        throw new Error('Encryption is not available')
    }

    if (key === 'sshPassphrase' && typeof value === 'string') {
        const buffer = safeStorage.encryptString(value)
        const encryptedSshPassphrase = buffer.toString('latin1')
        store.set(key, encryptedSshPassphrase)
        return null;
    }

    store.set(key, value)
    return value
}

export const getSetting = (key: keyof Settings) => store.get(key)

export const getEncryptedSetting = (key: keyof Settings) => {
    const encrypted = store.get(key)

    if (encrypted === null || encrypted === undefined) {
        return undefined
    }

    const buffer = Buffer.from(encrypted.toString(), 'latin1')
    return safeStorage.decryptString(buffer)
}

export const getSettings = () => {
    const settings = store.store
    settings.sshPassphrase = null
    return settings
}
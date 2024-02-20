<script setup lang="ts">
import {ref} from "vue";
import SettingsSection from "@/renderer/views/Settings/components/SettingsSection.vue";
import SettingsRow from "@/renderer/views/Settings/components/SettingsRow.vue";
import {Theme} from "@/types";
import validation from "@/renderer/validation";
import {useSessionStore} from "@/renderer/store/session"
import {storeToRefs} from "pinia";
import {VForm} from "vuetify/components";
import {useSettingsStore} from "@/renderer/store/settings";
import {useClipboard} from "@vueuse/core";
import {useGpgKeyStore} from "@/renderer/store/gpg_keys";
import {useToast} from "vue-toastification";
import {useErrors} from "@/renderer/composables/errors";
import log from 'electron-log/renderer';

const ipcRenderer = window.ipcRenderer
const { copy, isSupported } = useClipboard()
const sessionStore = useSessionStore()
const {session, isAuthenticated} = storeToRefs(sessionStore)
const settingsStore = useSettingsStore()
const {settings} = storeToRefs(settingsStore)
const {activateTheme, setSetting, generateSshKey} = settingsStore
const gpgKeysStore = useGpgKeyStore()
const {gpgKeysList} = storeToRefs(gpgKeysStore)
const {importGpgKey, generateGpgKey} = gpgKeysStore
const {formatError} = useErrors()
const toast = useToast()
const gpgForm = ref(null as VForm)
const sshPassphrase = ref('')
const gpgPassphrase = ref('')
const isGeneratingGpgKey = ref(false)
const isGeneratingSshKey = ref(false)

const themes: Array<Theme> = [
    'system',
    'light',
    'dark',
]

const switchTheme = (theme: Theme) => {
    setSetting('theme', theme)
    activateTheme(theme)
}

function updatePassphrase(value: string) {
    setSetting('sshPassphrase', value)
    sshPassphrase.value = ''
}

function updateTmpDir() {
    setSetting('tmpDir', 'select')
}

function updateSshPrivateKeyPath() {
    setSetting('sshPrivateKeyPath', 'select')
}

function updateSshPublicKeyPath() {
    setSetting('sshPublicKeyPath', 'select')
}

function selectSigningKey(key: string) {
    setSetting('signingKey', key)
}

function copySshPublicKey() {
    ipcRenderer.invoke('ssh:copy').then((sshPublicKey: string) => {
        if(isSupported) {
            copy(sshPublicKey)
        }
    }).catch((error: Error) => {
        toast.error(formatError(error.message), {
            timeout: 0
        })
        log.error(error)
    })
}

function copyGpgPublicKey() {
    ipcRenderer.invoke('gpg:copy').then((gpgPublicKey: string) => {
        if(isSupported) {
            copy(gpgPublicKey)
        }
    }).catch((error: Error) => {
        toast.error(formatError(error.message), {
            timeout: 0
        })
        log.error(error)
    })
}

async function generateGpgKeys() {
    const { valid } = await gpgForm.value.validate()

    if (valid) {
        isGeneratingGpgKey.value = true
        await generateGpgKey(session.value.email, gpgPassphrase.value)
        gpgPassphrase.value = ''
        isGeneratingGpgKey.value = false
    }
}

async function generateSshKeys() {
    isGeneratingSshKey.value = true
    await generateSshKey()
    isGeneratingSshKey.value = false
}
</script>

<template>
    <v-container
        :fluid="true"
        class="pa-0"
    >
        <h2 class="font-weight-medium">
            General
        </h2>
        <v-divider class="my-2" />
        <SettingsSection>Appearance</SettingsSection>
        <SettingsRow
            v-model="settings.theme"
            description="Change the theme of the application"
            variant="select"
            :items="themes"
            @update:model-value="switchTheme($event)"
            @change="switchTheme($event)"
        >
            Theme
        </SettingsRow>
        <SettingsSection class="mt-2">
            Storage
        </SettingsSection>
        <SettingsRow
            v-model="settings.tmpDir"
            description="Temporary directory used by SendCrypt to compress, encrypt and generate temporary files before any transfer."
            variant="button"
            @click="updateTmpDir"
        >
            {{ settings.tmpDir }}
            <template #label>
                Change location
            </template>
        </SettingsRow>
    </v-container>
    <v-container
        :fluid="true"
        class="pa-0 mt-10"
    >
        <h2 class="font-weight-medium">
            SSH
        </h2>
        <v-divider class="my-2" />
        <SettingsSection>Authentication</SettingsSection>
        <SettingsRow
            v-model="settings.sshPrivateKeyPath"
            :description="settings.sshPrivateKeyPath"
            variant="button"
            @click="updateSshPrivateKeyPath"
        >
            SSH private key
        </SettingsRow>
        <SettingsRow
            v-model="settings.sshPublicKeyPath"
            :copy="true"
            :description="settings.sshPublicKeyPath"
            variant="button"
            @click="updateSshPublicKeyPath"
            @copy="copySshPublicKey"
        >
            SSH public key
        </SettingsRow>
        <SettingsRow
            v-model="sshPassphrase"
            description="Leave empty if your private key is not protected with a passphrase."
            variant="password"
        >
            <template #button>
                <v-btn
                    variant="flat"
                    color="base"
                    class="border-sm"
                    @click="updatePassphrase(sshPassphrase)"
                >
                    {{ sshPassphrase ? 'Save' : 'Reset' }}
                </v-btn>
            </template>
            Passphrase
        </SettingsRow>
        <SettingsRow
            :model-value="''"
            description="This will create a RSA 4096 bit key pair and set it as your active SSH key pair."
            variant="button"
            :loading="isGeneratingSshKey"
            @click="generateSshKeys"
        >
            Generate new SSH key pair
            <template #label>
                Generate
            </template>
        </SettingsRow>
    </v-container>
    <v-container
        :fluid="true"
        class="pa-0 mt-10"
    >
        <h2 class="font-weight-medium">
            PGP
        </h2>
        <v-divider class="my-2" />
        <SettingsSection>
            Signature
        </SettingsSection>
        <SettingsRow
            v-model="settings.signingKey"
            :copy="settings.signingKey !== null"
            description="Select the PGP private key to use for signing."
            variant="select"
            :items="gpgKeysList"
            item-title="identity"
            item-value="id"
            @copy="copyGpgPublicKey"
            @update:model-value="selectSigningKey($event)"
            @change="selectSigningKey($event)"
        >
            Signing key
        </SettingsRow>
        <SettingsRow
            :model-value="''"
            description="You can import your own PGP private key by importing a file containing your private key in ASCII armored format."
            variant="button"
            @click="importGpgKey"
        >
            Import your PGP private key
            <template #label>
                Import
            </template>
        </SettingsRow>
        <v-form
            v-if="isAuthenticated"
            ref="gpgForm"
            validate-on="submit lazy"
            @submit.prevent="generateGpgKeys"
        >
            <SettingsRow
                v-model="gpgPassphrase"
                description="This will create a RSA 4096 bit key pair with your email address that expires in 2 years. This will also be set as your active private signing key."
                variant="password"
                :rules="[validation.required, validation.password]"
            >
                Generate new PGP key pair

                <template #button>
                    <v-btn
                        variant="flat"
                        color="base"
                        class="border-sm"
                        :loading="isGeneratingGpgKey"
                        type="submit"
                    >
                        Generate
                    </v-btn>
                </template>
            </SettingsRow>
        </v-form>
    </v-container>
</template>

<style scoped>

</style>
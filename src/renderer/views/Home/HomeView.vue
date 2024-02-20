<script setup lang="ts">

import FilesTable from "@/renderer/views/Home/components/FilesTable.vue";
import {useFormatter} from "@/renderer/composables/format";
import {useFilesStore} from "@/renderer/store/files";
import {storeToRefs} from "pinia";
import PassphraseDialog from "@/renderer/components/dialogs/PassphraseDialog.vue";
import {computed, ref} from "vue";
import NoProfileAlert from "@/renderer/components/alerts/NoProfileAlert.vue";
import {useProfilesStore} from "@/renderer/store/profiles";
import {useGpgKeyStore} from "@/renderer/store/gpg_keys";
import {useSessionStore} from "@/renderer/store/session";
import LoadingDialog from "@/renderer/components/dialogs/LoadingDialog.vue";
import {useSendcryptAPI} from "@/renderer/composables/api";
import {useToast} from "vue-toastification";
import {Metadata} from "@/types";
import log from 'electron-log/renderer';

const ipcRenderer = window.ipcRenderer
const sessionStore = useSessionStore()
const {passphrase, isAuthenticated} = storeToRefs(sessionStore)
const filesStore = useFilesStore()
const { formatFileSize } = useFormatter()
const {files, mappedFiles} = storeToRefs(filesStore)
const {addFilesFromFinder, removeFiles, clearFiles} = filesStore
const profilesStore = useProfilesStore()
const { currentProfile } = storeToRefs(profilesStore)
const gpgKeysStore = useGpgKeyStore()
const {verifyPassphrase} = gpgKeysStore
const {storeUpload} = useSendcryptAPI()
const toast = useToast()

const isLoading = ref(false)
const isPassphraseRequired = ref(false)
const headers = [
    {
        key: 'name',
        title: 'Name',
        width: '70%',
    },
    {
        key: 'size',
        title: 'Size',
        value: (item: File) => formatFileSize(item.size),
        width: '20%',
    },
    {
        key: 'actions',
        title: '...',
        sortable: false,
        width: '10%',
    }
]

const isDisabled = computed(() => {
    return mappedFiles.value.length === 0 || currentProfile.value === null
})

async function checkPassphrase() {
    const isPassphraseValid = await verifyPassphrase(passphrase.value)
    if (!isPassphraseValid) {
        isPassphraseRequired.value = true
    } else {
        await send()
    }
}
async function send() {
    const filesToBeSent = files.value
    isLoading.value = true
    ipcRenderer.invoke('file:send', JSON.stringify(filesToBeSent), passphrase.value)
        .then(async (metadata: Metadata) => {
            toast.success('Files sent successfully', {
                timeout: 0
            })
            clearFiles()
            if (isAuthenticated.value) {
                await storeUpload(currentProfile.value.url, metadata)
            }
        })
        .catch((error: Error) => {
            toast.error(error.message, {
                timeout: 0,
            })
            log.error(error)
        })
        .finally(() => {
            isLoading.value = false
        })
}
</script>

<template>
    <v-row class="mx-0">
        <v-spacer />
        <v-btn
            color="base"
            class="mr-2 border-sm"
            @click="clearFiles"
        >
            Reset
        </v-btn>
        <v-btn
            color="success"
            @click="addFilesFromFinder"
        >
            <v-icon class="mr-1">
                mdi-plus-circle-outline
            </v-icon>
            Add files
        </v-btn>
    </v-row>
    <v-row class="mx-0">
        <v-col
            cols="12"
            class="px-0"
        >
            <files-table
                :headers="headers"
                :items="mappedFiles"
                @items:remove="removeFiles($event)"
            />
        </v-col>
        <v-col
            cols="12"
            class="px-0"
        >
            <v-btn
                :disabled="isDisabled"
                :block="true"
                :color="isDisabled ? undefined : 'base'"
                class="border-sm"
                @click="checkPassphrase"
            >
                Send {{ mappedFiles.length > 0 ? `(${mappedFiles.length} files)` : null }}
            </v-btn>

            <no-profile-alert />
        </v-col>
    </v-row>
    <passphrase-dialog
        v-model="isPassphraseRequired"
        @confirm="send"
    />
    <loading-dialog v-model="isLoading" />
</template>

<style scoped>

</style>
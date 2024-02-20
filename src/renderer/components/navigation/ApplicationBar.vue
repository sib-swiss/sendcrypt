<script setup lang="ts">

import SendcryptLogo from "@/renderer/components/logo/SendcryptLogo.vue";
import {useSessionStore} from "@/renderer/store/session";
import LoginDialog from "@/renderer/components/dialogs/LoginDialog.vue";
import UserMenu from "@/renderer/components/navigation/UserMenu.vue";
import {onMounted, onUnmounted, ref} from "vue";
import {storeToRefs} from "pinia";
import log from 'electron-log/renderer';
import {useAxios} from "@/renderer/composables/axios";

const ipcRenderer = window.ipcRenderer

const sessionStore = useSessionStore()
const {isAuthenticated} = storeToRefs(sessionStore)
const {setSession} = sessionStore
const {setBearerToken} = useAxios()

const isDialogOpen = ref(false)
const loginUrl = ref('')

async function login() {
    await ipcRenderer.invoke('login')
    loginUrl.value = await ipcRenderer.invoke('login:url')
    isDialogOpen.value = true
}

async function register() {
    await ipcRenderer.invoke('register')
}

onMounted(() => {
    ipcRenderer.on('login', (_event, data) => {
        setSession(data)
        setBearerToken(data.token)
        isDialogOpen.value = false
        log.info('logged in')
    })
})

onUnmounted(() => {
    ipcRenderer.removeAllListeners('login')
})
</script>

<template>
    <v-app-bar
        :flat="true"
        border="sm"
        height="48"
        theme="dark"
    >
        <sendcrypt-logo class="ml-5" />
        <v-spacer />
        <v-btn
            v-if="!isAuthenticated"
            theme="dark"
            variant="flat"
            class="mr-2"
            @click="login"
        >
            Sign in
        </v-btn>
        <v-btn
            v-if="!isAuthenticated"
            theme="dark"
            variant="outlined"
            class="mr-5"
            @click="register"
        >
            Sign up
        </v-btn>
        <UserMenu
            v-if="isAuthenticated"
        />
    </v-app-bar>
    <LoginDialog
        v-model="isDialogOpen"
        :url="loginUrl"
    />
</template>

<style scoped>

</style>
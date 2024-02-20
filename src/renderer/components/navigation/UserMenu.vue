<script setup lang="ts">
import {useAuthenticator} from "@/renderer/composables/auth";
import {useSessionStore} from "@/renderer/store/session";
import {storeToRefs} from "pinia";

const ipcRenderer = window.ipcRenderer
const store = useSessionStore()
const {email} = storeToRefs(store)

const emit = defineEmits(['logout'])

const { logout } = useAuthenticator()

const help = async () => {
    await ipcRenderer.invoke('help')
}

const disconnect = () => {
    logout().finally(() => {
        emit('logout')
    })
}
</script>

<template>
    <v-menu
        location="bottom"
    >
        <template #activator="{ props }">
            <v-btn
                v-bind="props"
                variant="text"
                rounded="pill"
                class="mr-5"
                append-icon="mdi-menu-down"
            >
                <div class="font-weight-medium text-body-2">
                    {{ email }}
                </div>
            </v-btn>
        </template>
        <v-list
            :nav="true"
            density="compact"
            class="pa-1"
            elevation="3"
            rounded="lg"
            border="sm"
        >
            <v-list-item
                title="Help"
                class="text-body-1"
                :link="true"
                density="compact"
                @click="help"
            >
                <template #title="{ title }">
                    <div class="text-body-2 font-weight-regular">
                        <v-icon class="mr-1">
                            mdi-help-circle-outline
                        </v-icon>
                        {{ title }}
                    </div>
                </template>
            </v-list-item>
            <v-list-item
                title="Log out"
                class="text-body-1"
                :link="true"
                density="compact"
                @click="disconnect"
            >
                <template #title="{ title }">
                    <div class="text-body-2 font-weight-regular">
                        <v-icon class="mr-1">
                            mdi-logout
                        </v-icon>
                        {{ title }}
                    </div>
                </template>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<style scoped>

</style>
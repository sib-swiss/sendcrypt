<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import {useProfilesStore} from "@/renderer/store/profiles";
import {storeToRefs} from "pinia";

const profilesStore = useProfilesStore()
const { currentProfile } = storeToRefs(profilesStore)

const isConnected = ref(navigator.onLine);

const checkConnection = () => {
    isConnected.value = navigator.onLine;
}

onMounted(() => {
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
})

onUnmounted(() => {
    window.removeEventListener('online', checkConnection);
    window.removeEventListener('offline', checkConnection);
})
</script>

<template>
    <v-footer
        :app="true"
        :height="32"
        class="border-t-sm px-0"
    >
        <v-btn
            variant="text"
            rounded="0"
            class="text-footer"
            @click="checkConnection"
        >
            <template #prepend>
                <v-icon
                    size="small"
                    :color="isConnected ? 'success' : 'error'"
                >
                    mdi-circle
                </v-icon>
            </template>
            <span class="font-weight-regular">{{ isConnected ? 'Online' : 'Offline' }}</span>
        </v-btn>
        <v-spacer />
        <div
            class="mr-3 text-footer"
        >
            <span class="font-weight-regular">Current project: <b>{{ currentProfile?.name || 'Undefined' }}</b></span>
        </div>
    </v-footer>
</template>

<style scoped>
.text-footer {
  font-size: 10px !important;
}
</style>
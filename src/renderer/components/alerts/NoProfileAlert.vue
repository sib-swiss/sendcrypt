<script setup lang="ts">
import {useProfilesStore} from "@/renderer/store/profiles";
import {storeToRefs} from "pinia";

const profilesStore = useProfilesStore()
const { currentProfile } = storeToRefs(profilesStore)
</script>

<template>
    <v-alert
        v-if="currentProfile === null"
        variant="tonal"
        type="warning"
        class="mt-3 text-body-2"
        rounded="lg"
    >
        <span>
            No project selected. Please select a project in the
            <router-link
                :to="{ name: 'projects' }"
                class="text-warning text-decoration-none font-weight-bold"
            >
                projects
            </router-link>
            section.
        </span>
    </v-alert>
</template>

<style scoped>

</style>
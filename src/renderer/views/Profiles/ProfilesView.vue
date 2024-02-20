<script setup lang="ts">
import {ref} from "vue";
import ProfilesTable from "@/renderer/views/Profiles/components/ProfilesTable.vue";
import {Profile} from "@/types";
import {useSessionStore} from "@/renderer/store/session";
import {storeToRefs} from "pinia";
import EditProfileDialog from "@/renderer/views/Profiles/components/EditProfileDialog.vue";
import EditRemoteProfileDialog from "@/renderer/views/Profiles/components/EditRemoteProfileDialog.vue";
import {useProfilesStore} from "@/renderer/store/profiles";

const sessionStore = useSessionStore()
const {isAuthenticated} = storeToRefs(sessionStore)
const profilesStore = useProfilesStore()
const {loadProfile, storeProfile, updateProfile, removeProfile} = profilesStore
const { profiles, currentProfile } = storeToRefs(profilesStore)

const headers = [
    {
        key: 'name',
        title: 'Name',
        width: '30%',
    },
    {
        key: 'host',
        title: 'Host',
        width: '30%',
    },
    {
        key: 'username',
        title: 'Username',
        width: '30%',
    },
    {
        key: 'actions',
        title: '',
        sortable: false,
        width: '10%',
    }
]

const isDialogOpen = ref(false)
const isRemoteDialogOpen = ref(false)
const selectedProfile = ref<Profile>({
    id: 0,
    name: '',
    url: '',
    gpg_key: '',
    host: '',
    port: 22,
    remote_path: '',
    username: '',
})

const resetProfile = () => {
    selectedProfile.value = {
        id: 0,
        name: '',
        url: '',
        gpg_key: '',
        host: '',
        port: 22,
        remote_path: '',
        username: '',
    }
}

const openDialog = () => {
    resetProfile()
    isDialogOpen.value = true
}

const openRemoteDialog = () => {
    resetProfile()
    isRemoteDialogOpen.value = true
}

const editProfile = (profile: Profile) => {
    selectedProfile.value = profile
    isDialogOpen.value = true
}

const submit = ($event: Profile) => {
    if ($event.id === 0) {
        storeProfile($event)
    } else {
        updateProfile($event)
    }
}
</script>

<template>
    <v-row class="mx-0">
        <v-spacer />
        <v-btn
            v-if="isAuthenticated"
            variant="flat"
            color="base"
            class="align-end mr-3 border-sm"
            @click="openRemoteDialog"
        >
            <v-icon class="mr-1">
                mdi-web-plus
            </v-icon>
            Add remote project
        </v-btn>
        <v-btn
            variant="flat"
            color="base"
            class="align-end border-sm"
            @click="openDialog"
        >
            <v-icon class="mr-1">
                mdi-folder-plus
            </v-icon>
            Add project
        </v-btn>
    </v-row>
    <v-row class="mx-0">
        <v-col
            cols="12"
            class="px-0"
        >
            <ProfilesTable
                :headers="headers"
                :items="profiles"
                :selected="currentProfile?.id"
                @select:item="loadProfile($event.id)"
                @edit:item="editProfile"
                @remove:item="removeProfile($event.id)"
            />
        </v-col>
    </v-row>
    <edit-profile-dialog
        v-model:model-value="isDialogOpen"
        v-model:model-form="selectedProfile"
        @submit="submit"
    />
    <edit-remote-profile-dialog
        v-if="isAuthenticated"
        v-model:model-value="isRemoteDialogOpen"
        v-model:model-form="selectedProfile"
        @submit="submit"
    />
</template>

<style scoped>
:deep(th) {
  height: calc(var(--v-table-header-height) - 16px) !important;
}

td {
  height: 50px !important;
}
</style>
import {defineStore} from "pinia";
import {computed, Ref, ref} from "vue";
import {Profile} from "@/types";
import {useSettingsStore} from "@/renderer/store/settings";
import log from 'electron-log/renderer';

const ipcRenderer = window.ipcRenderer


export const useProfilesStore = defineStore('profiles', () => {
    const settings = useSettingsStore()

    const profiles: Ref<Array<Profile>> = ref([])

    const loadProfiles = () => {
        log.info('👥 Profiles loaded')
        ipcRenderer.invoke('profile:list').then((storedProfiles: Array<Profile>) => {
            profiles.value = storedProfiles
        })
    }

    const currentProfile = computed(() => {
        const selectedProfile = settings.settings.selectedProfile

        if (selectedProfile === null) {
            return null
        }

        return profiles.value.find(profile => profile.id === settings.settings.selectedProfile)
    })

    const storeProfile = (profile: Profile) => {
        const json = JSON.stringify(profile)
        ipcRenderer.invoke('profile:store', json).then((id: number) => {
            const storedProfile = {...profile, id}
            profiles.value = [...profiles.value, storedProfile]
        })
    }

    const updateProfile = (profile: Profile) => {
        const json = JSON.stringify(profile)
        ipcRenderer.invoke('profile:update', json).then(() => {
            profiles.value = profiles.value.map(storedProfile => {
                if (storedProfile.id === profile.id) {
                    return profile
                }
                return storedProfile
            })
        })
    }

    const removeProfile = (id: number) => {
        ipcRenderer.invoke('profile:remove', id).then(() => {
            profiles.value = profiles.value.filter(profile => profile.id !== id)
        })
    }

    const loadProfile = (id: number) => {
        ipcRenderer.invoke('profile:load', id).then(() => {
            settings.setSetting('selectedProfile', id as never)
        })
    }

    return { profiles, loadProfiles, currentProfile, storeProfile, updateProfile, removeProfile, loadProfile }
})
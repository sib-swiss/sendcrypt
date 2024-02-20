<script setup lang="ts">
import {computed, Ref, ref, watch} from "vue";
import {Profile} from "@/types";
import ProfileTextInput from "@/renderer/views/Profiles/components/ProfileTextInput.vue";
import ProfileTextarea from "@/renderer/views/Profiles/components/ProfileTextarea.vue";
import {useToast} from "vue-toastification";
import {useSessionStore} from "@/renderer/store/session";
import {storeToRefs} from "pinia";
import ProfileSelectInput from "@/renderer/views/Profiles/components/ProfileSelectInput.vue";
import {VForm} from "vuetify/components";
import {useSendcryptAPI} from "@/renderer/composables/api";
import log from 'electron-log/renderer';

interface Props {
  modelValue: boolean
  modelForm: Profile | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'update:modelForm', 'submit'])
const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
const form = computed({
    get() {
        return props.modelForm
    },
    set(value) {
        emit('update:modelForm', value)
    }
})
const toast = useToast()
const store = useSessionStore()
const {isAuthenticated} = storeToRefs(store)
const {queryProjects} = useSendcryptAPI()


const profileForm = ref(null as VForm)
const profile: Ref<null | Profile> = ref(null)
const profiles: Ref<Array<Profile>> = ref([])

watch(value, (value: boolean) => {
    if (value) {
        if (isAuthenticated.value) query()
        profile.value = null
    }
})

function query() {
    queryProjects().then((response) => {
        profiles.value = response
    }).catch((error) => {
        toast.error('SendCrypt server connection failed', {
            timeout: 0,
        })
        log.error(error)
    })
}

function resetForm() {
    form.value = {
        id: 0,
        url: '',
        name: '',
        gpg_key: '',
        host: '',
        port: 22,
        remote_path: '',
        username: '',
    }
}

function selectRemoteProfile(profile: Profile | null) {
    if (profile === null) {
        resetForm()
    } else {
        form.value = {
            id: 0,
            url: profile.url,
            name: profile.name,
            gpg_key: profile.gpg_key,
            host: profile.host,
            port: profile.port,
            remote_path: profile.remote_path,
            username: profile.username,
        }
    }
}

async function submit() {
    emit('submit', form.value)
    value.value = false
}
</script>

<template>
    <v-dialog
        v-model="value"
        :fullscreen="true"
        :eager="true"
    >
        <template #default>
            <v-card
                v-if="form !== null"
                variant="flat"
                :flat="true"
            >
                <v-form
                    ref="profileForm"
                    validate-on="submit lazy"
                    @submit.prevent
                >
                    <v-card-item>
                        <v-card-title class="font-weight-medium text-body-1 d-flex">
                            {{ form.id === 0 ? 'New' : 'Edit' }} remote project
                            <v-spacer />
                            <v-btn
                                icon="mdi-close"
                                variant="text"
                                size="x-small"
                                rounded="lg"
                                @click="value = false"
                            />
                        </v-card-title>
                        <v-card-subtitle class="mb-3 text-pre-wrap text-body-2">
                            Select a remote project to add by clicking on the input field below.
                        </v-card-subtitle>
                    </v-card-item>
                    <v-card-text>
                        <ProfileSelectInput
                            v-model="profile"
                            :items="profiles"
                            placeholder="Select a remote project"
                            label="Project name"
                            @update:model-value="selectRemoteProfile($event)"
                            @click:clear="resetForm"
                        />
                        <ProfileTextInput
                            v-model="form.username"
                            placeholder=""
                            label="Username"
                            type="text"
                            :disabled="true"
                        />
                        <ProfileTextInput
                            v-model="form.url"
                            placeholder=""
                            label="API URL"
                            type="text"
                            :disabled="true"
                        />
                        <ProfileTextInput
                            v-model="form.host"
                            placeholder=""
                            label="Host"
                            type="text"
                            :disabled="true"
                        />
                        <ProfileTextInput
                            v-model="form.port"
                            placeholder=""
                            label="Port"
                            type="number"
                            :disabled="true"
                        />
                        <ProfileTextInput
                            v-model="form.remote_path"
                            placeholder=""
                            label="Remote path"
                            type="text"
                            :disabled="true"
                        />
                        <ProfileTextarea
                            v-model="form.gpg_key"
                            placeholder=""
                            label="Public PGP key"
                            :disabled="true"
                        />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            variant="flat"
                            type="button"
                            class="mr-2 border-sm"
                            @click="value = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            variant="flat"
                            type="button"
                            color="success"
                            class="mr-2 border-sm"
                            @click="submit"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>

</style>
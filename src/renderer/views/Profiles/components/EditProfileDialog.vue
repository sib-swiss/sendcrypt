<script setup lang="ts">
import {computed, ref} from "vue";
import {Profile} from "@/types";
import rules from "@/renderer/validation"
import ProfileTextInput from "@/renderer/views/Profiles/components/ProfileTextInput.vue";
import ProfileTextarea from "@/renderer/views/Profiles/components/ProfileTextarea.vue";
import {VForm} from "vuetify/components";

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
const profileForm = ref(null as VForm)

async function submit() {
    const { valid } = await profileForm.value.validate()

    if (valid) {
        emit('submit', form.value)
        value.value = false
    }
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
            >
                <v-form
                    ref="profileForm"
                    validate-on="submit lazy"
                    @submit.prevent
                >
                    <v-card-item>
                        <v-card-title class="font-weight-medium text-body-1 d-flex">
                            {{ form.id === 0 ? 'New' : 'Edit' }} project
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
                            Make changes to your project
                            here. Click save to
                            apply changes.
                        </v-card-subtitle>
                    </v-card-item>
                    <v-card-text>
                        <ProfileTextInput
                            v-model="form.name"
                            :rules="[rules.required, rules.min, rules.max]"
                            placeholder="My project"
                            label="Project name"
                            type="text"
                        />
                        <ProfileTextInput
                            v-model="form.username"
                            :rules="[rules.required]"
                            placeholder="user"
                            label="Username"
                            type="text"
                        />
                        <ProfileTextInput
                            v-model="form.url"
                            :rules="[rules.required, rules.url]"
                            placeholder="https://sendcrypt.sib.swiss/api/v1/test"
                            label="API URL"
                            type="text"
                        />
                        <ProfileTextInput
                            v-model="form.host"
                            placeholder="example.com"
                            label="Host"
                            type="text"
                        />
                        <ProfileTextInput
                            v-model="form.port"
                            :rules="[rules.required, rules.number]"
                            placeholder="22"
                            label="Port"
                            type="number"
                        />
                        <ProfileTextInput
                            v-model="form.remote_path"
                            :rules="[rules.required, rules.path]"
                            placeholder="/data"
                            label="Remote path"
                            type="text"
                        />
                        <ProfileTextarea
                            v-model="form.gpg_key"
                            :rules="[rules.required]"
                            placeholder="Paste your PGP key here"
                            label="Public PGP key"
                        />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            variant="flat"
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
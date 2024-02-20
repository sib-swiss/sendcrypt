<script setup lang="ts">
import {computed, Ref, ref, watch} from "vue";
import {VForm} from "vuetify/components";
import {useSessionStore} from "@/renderer/store/session";
import TextHiddenInput from "@/renderer/components/forms/TextHiddenInput.vue";
import {useGpgKeyStore} from "@/renderer/store/gpg_keys";
import ErrorAlert from "@/renderer/components/alerts/ErrorAlert.vue";

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'confirm'])
const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
watch(value, (value: boolean) => {
    if (value) {
        passphrase.value = ''
        error.value = null
    }
})
const sessionStore = useSessionStore()
const {savePassphrase} = sessionStore
const gpgKeysStore = useGpgKeyStore()
const {verifyPassphrase} = gpgKeysStore
const isLoading = ref(false)
const passphrase = ref('')
const error: Ref<string | undefined> = ref(undefined)
const hasError = computed(() => error.value !== null)

async function submit() {
    isLoading.value = true

    const requirePassphrase = await verifyPassphrase(passphrase.value)

    if (requirePassphrase === false) {
        error.value = 'Invalid passphrase'
        isLoading.value = false
        return
    }

    isLoading.value = false
    value.value = false
    savePassphrase(passphrase.value)
    passphrase.value = ''

    emit('confirm')
}
</script>

<template>
    <v-dialog
        v-model="value"
        max-width="400px"
        :persistent="true"
    >
        <template #default>
            <v-card
                variant="flat"
                elevation="1"
                border="sm"
                rounded="lg"
            >
                <v-form @submit.prevent="submit">
                    <v-card-item>
                        <v-card-title class="font-weight-medium text-body-1 d-flex">
                            <v-spacer />
                            <v-btn
                                icon="mdi-close"
                                variant="text"
                                size="x-small"
                                rounded="lg"
                                @click="value = false"
                            />
                        </v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <div class="text-center text-h5 font-weight-medium mb-2">
                            Please type your PGP passphrase
                        </div>
                        <div class="text-center text-body-2 mb-5">
                            Don't worry your passphrase will only be stored during this session
                        </div>
                        <error-alert
                            v-model="hasError"
                            class="mb-5"
                        >
                            {{ error }}
                        </error-alert>
                        <text-hidden-input
                            v-model="passphrase"
                            placeholder="passphrase"
                            :error="error"
                        />
                        <v-btn
                            :block="true"
                            variant="flat"
                            color="success"
                            class="border-sm"
                            type="submit"
                        >
                            Submit
                        </v-btn>
                    </v-card-text>
                </v-form>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>
.v-dialog {
  backdrop-filter: blur(3px) !important;
}
</style>
<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {VForm} from "vuetify/components";
import CopyBtn from "@/renderer/components/buttons/CopyBtn.vue";

interface Props {
  modelValue: boolean
  url: string
}

const ipcRenderer = window.ipcRenderer
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
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
        form.value = ''
        errors.value = ''
    }
})

const form = ref('')
const errors = ref('')

const submit = () => {
    ipcRenderer.invoke('login:token', form.value).then(() => {
        value.value = false
        form.value = ''
        errors.value = ''
    }).catch(() => {
        errors.value = 'Invalid token'
    })
}
</script>

<template>
    <v-dialog
        v-model="value"
        width="400"
    >
        <template #default>
            <v-card
                variant="flat"
                :flat="true"
                class="border-grey my-10"
                elevation="1"
                rounded="lg"
            >
                <v-form @submit.prevent="submit">
                    <v-card-item>
                        <v-card-title class="font-weight-medium text-body-2 d-flex">
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
                    <div class="text-center text-h5 font-weight-medium mb-2">
                        Sign In
                    </div>
                    <div class="text-center text-caption mb-3 mx-3">
                        A new page should have opened in your default browser. Please sign in and then return to your SendCrypt Desktop Application.
                    </div>
                    <v-card-text class="mx-5 bg-base rounded-lg mb-5">
                        <p class="text-caption">
                            If your browser did not open, please copy and paste the following URL into your browser to complete login.
                        </p>
                        <v-text-field
                            :model-value="props.url"
                            variant="outlined"
                            :readonly="true"
                            density="compact"
                            :single-line="true"
                            :hide-details="true"
                            rounded="lg"
                            class="mt-3 mb-5"
                        >
                            <template #append>
                                <copy-btn :text="props.url" />
                            </template>
                        </v-text-field>
                        <p class="text-caption">
                            If your browser does not open the SendCrypt Desktop Application automatically you can manually add the generated token here.
                        </p>
                        <v-form @submit.prevent="submit">
                            <v-text-field
                                v-model="form"
                                variant="outlined"
                                density="compact"
                                :single-line="true"
                                :error-messages="errors"
                                rounded="lg"
                                class="mt-3"
                            >
                                <template #append>
                                    <v-btn
                                        variant="text"
                                        icon="mdi-login-variant"
                                        size="small"
                                        type="submit"
                                    />
                                </template>
                            </v-text-field>
                        </v-form>
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
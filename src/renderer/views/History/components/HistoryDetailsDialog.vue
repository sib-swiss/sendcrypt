<script setup lang="ts">
import {computed} from "vue";
import {History} from "@/types";

interface Props {
  modelValue: boolean
  history: History | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'close'])
const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
const items = computed(() => {
    if (props.history === null) {
        return []
    }

    // convert object to array key => value
    return Object.keys(props.history)
        .filter((key) => key !== 'id')
        .map((key) => {
            if (props.history === null) {
                return
            }

            if (key === 'recipients') {
                return {
                    key,
                    value: formatFingerprint(props.history[key as keyof History] as string)
                }
            }

            if (key === 'timestamp') {
                return {
                    key,
                    value: formatDateToLocaleDateString(props.history[key as keyof History] as string)
                }
            }

            if (key === 'checksum') {
                return {
                    key,
                    value: formatChecksum(props.history[key as keyof History] as string)
                }
            }

            return {
                key,
                value: props.history[key as keyof History]
            }
        })
})

const headers: Array<{ key: string; title: string; sortable: boolean; }> = [
    {
        title: 'Key',
        key: 'key',
        sortable: false,
    },
    {
        title: 'Value',
        key: 'value',
        sortable: false,
    },
]

function formatFingerprint(input: string) {
    return input.toUpperCase();
}

function formatDateToLocaleDateString(timestampString: string) {
    // convert given timestamp to local user timezone
    const timestamp = new Date(timestampString);

    // Get the user's local timezone offset in minutes
    const userTimezoneOffset = timestamp.getTimezoneOffset();

    // Convert the timestamp to the local user timezone
    const localTimestamp = new Date(timestamp.getTime() - userTimezoneOffset * 60000);

    const userLocale = navigator.language

    return localTimestamp.toLocaleDateString(userLocale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    })
}

function formatChecksum(checksum: string) {
    return checksum.replace(/-/g, '').toUpperCase();
}
</script>

<template>
    <v-dialog
        v-model="value"
        :fullscreen="true"
    >
        <template #default>
            <v-card
                variant="flat"
                :flat="true"
                class="pt-5 pb-5"
                elevation="2"
            >
                <v-card-item>
                    <v-card-title class="font-weight-medium text-body-1 d-flex">
                        Details
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
                <v-card-text class="px-0">
                    <v-data-table-virtual
                        :headers="headers"
                        :items="items"
                        item-key="id"
                        :items-per-page="0"
                        :hide-no-data="true"
                    />
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>
</style>
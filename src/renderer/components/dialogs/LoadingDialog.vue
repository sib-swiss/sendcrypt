<script setup lang="ts">
import {computed} from "vue";

interface Props {
  modelValue: boolean,
}

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
</script>

<template>
    <v-dialog
        v-model="value"
        :persistent="true"
        :fullscreen="true"
    >
        <template #default>
            <v-container
                class="fill-height justify-center"
                :fluid="true"
            >
                <v-progress-circular
                    :indeterminate="true"
                    color="base"
                    size="160"
                    width="25"
                />
            </v-container>
        </template>
    </v-dialog>
</template>

<style scoped>
.v-dialog {
  backdrop-filter: blur(3px) !important;
}
</style>
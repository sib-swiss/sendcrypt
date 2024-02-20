<script setup lang="ts">
import {computed} from "vue";

declare interface Props {
  modelValue: boolean;
  disabled: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false
})
const emit = defineEmits(['update:modelValue', 'change'])

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
    <v-checkbox-btn
        v-model="value"
        :inset="true"
        :disabled="disabled"
        :true-value="true"
        :false-value="false"
        density="compact"
        color="primary"
        class="float-end"
        :hide-details="true"
        :inline="true"
        @update:model-value="$emit('change', $event)"
    />
</template>

<style scoped>
:deep(.v-switch__track) {
  opacity: 1 !important;
}
</style>
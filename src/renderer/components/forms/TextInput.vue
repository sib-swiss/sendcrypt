<script setup lang="ts">
import {computed} from "vue";

declare interface Props {
  modelValue: string | number | null
  placeholder: string
  error?: string
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
    <v-text-field
        v-model="value"
        :placeholder="placeholder"
        variant="outlined"
        density="compact"
        rounded="lg"
        :error-messages="error"
        :hide-details="true"
        :hide-selected="true"
        :hide-no-data="true"
        :single-line="true"
        color="primary"
        base-color="grey-lighten-1"
        class="mb-3"
    />
</template>

<style scoped>

</style>
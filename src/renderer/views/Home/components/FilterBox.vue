<script setup lang="ts">
import {computed} from "vue";

interface Props {
  modelValue: string
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
        variant="outlined"
        rounded="lg"
        base-color="grey-lighten-1"
        density="compact"
        :hide-details="true"
        :clearable="true"
        placeholder="Filter files..."
        @click:clear="value = ''"
    />
</template>

<style scoped>
.v-text-field input.v-field__input {
  height: 24px !important;
}
</style>
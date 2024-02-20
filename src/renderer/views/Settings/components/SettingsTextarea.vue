<script setup lang="ts">
import {computed} from "vue";

declare interface Props {
  modelValue: string | boolean | null;
  disabled: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false
})
const emit = defineEmits(['update:modelValue', 'blur'])

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
    <v-textarea
        v-model="value"
        :disabled="disabled"
        variant="outlined"
        rounded="lg"
        density="compact"
        :hide-details="true"
        @blur="$emit('blur', value)"
    />
</template>

<style scoped>

</style>
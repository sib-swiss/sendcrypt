<script setup lang="ts">
import {computed, ref} from "vue";

declare interface Props {
  modelValue: string | number | null
  placeholder: string
  error?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const type = ref('password')
const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

function switchType() {
    type.value = type.value === 'password' ? 'text' : 'password'
}
</script>

<template>
    <v-text-field
        v-model="value"
        :placeholder="placeholder"
        :type="type"
        :error-messages="error"
        :hide-details="true"
        variant="outlined"
        density="compact"
        rounded="lg"
        color="primary"
        base-color="grey-lighten-1"
        class="mb-3"
        append-inner-icon="mdi-eye"
        @click:append-inner="switchType"
    />
</template>

<style scoped>

</style>
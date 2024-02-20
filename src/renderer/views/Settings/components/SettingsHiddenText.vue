<script setup lang="ts">
import {computed, Ref, ref} from "vue";

declare interface Props {
  modelValue: string | boolean | null;
  disabled: boolean;
  rules?: Array<CallableFunction>;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    rules: undefined
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

const type: Ref<'password' | 'text'> = ref('password')

function switchType() {
    type.value = type.value === 'password' ? 'text' : 'password'
}
</script>

<template>
    <v-text-field
        v-model="value"
        :disabled="disabled"
        :rules="rules as never[]"
        variant="outlined"
        rounded="lg"
        density="compact"
        placeholder="Passphrase"
        :hide-details="rules === undefined"
        :type="type"
        append-inner-icon="mdi-eye"
        @click:append-inner="switchType"
        @blur="$emit('blur', value)"
    />
</template>

<style scoped>

</style>
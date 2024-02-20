<script setup lang="ts">
import {computed} from "vue";

declare interface Props {
  modelValue: string | number | null
  label: string
  placeholder: string
  type: 'text' | 'number'
  rules?: Array<CallableFunction>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    rules: undefined
})
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
    <v-row>
        <v-col
            cols="3"
            align-self="center"
            class="text-end font-weight-medium text-body-2 pb-5"
        >
            {{ label }}
        </v-col>
        <v-col
            cols="9"
            class="pb-0"
        >
            <v-text-field
                v-model="value"
                :placeholder="placeholder"
                :rules="rules as never[]"
                variant="outlined"
                density="compact"
                rounded="lg"
                :hide-selected="true"
                :hide-no-data="true"
                :single-line="true"
                :disabled="disabled"
                color="primary"
                base-color="grey-lighten-1"
                :type="type"
            />
        </v-col>
    </v-row>
</template>

<style scoped>

</style>
<script setup lang="ts">
import {computed} from "vue";

interface Props {
  modelValue: boolean
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
    <v-alert
        v-if="value"
        type="error"
        class="pa-5"
        dense
        outlined
        variant="tonal"
        color="red"
        rounded="lg"
    >
        <div class="text-body-2">
            <slot />
        </div>
    </v-alert>
</template>

<style scoped>

</style>
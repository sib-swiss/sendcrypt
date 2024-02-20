<script setup lang="ts">
import {computed} from "vue";

interface Props {
  label: string,
  items: Array<string>,
  modelValue: string | null
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
    <label class="font-weight-medium">{{ label }}</label>
    <v-select
        v-model="value"
        :items="items"
        variant="outlined"
        density="compact"
        rounded="lg"
        :hide-details="true"
        :hide-selected="true"
        :hide-no-data="true"
        :single-line="true"
        color="grey-lighten-2"
        menu-icon="mdi-menu-swap"
    />
</template>

<style scoped>

</style>
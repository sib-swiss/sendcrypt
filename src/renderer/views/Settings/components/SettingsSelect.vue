<script setup lang="ts">
import {computed} from "vue";

declare interface Props {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  modelValue: any;
  items: Array<string | number | null>;
  itemValue: string;
  itemTitle: string;
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
    <v-select
        v-model="value"
        :items="items"
        :disabled="disabled"
        :item-title="props.itemTitle"
        :item-value="props.itemValue"
        variant="outlined"
        density="compact"
        color="primary"
        rounded="lg"
        :hide-details="true"
        :hide-no-data="true"
        :single-line="true"
        menu-icon="mdi-menu-swap"
        :list-props="{
            maxWidth: '500',
            class: 'rounded-lg py-0',
            density: 'compact'
        }"
        @change="emit('change', value)"
    />
</template>

<style scoped>
$input-details-min-height: 22px;
</style>
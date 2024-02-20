<script setup lang="ts">
import {computed} from "vue";

interface Props {
  items: Array<string>
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
    <v-select
        v-model="value"
        :items="items"
        variant="outlined"
        density="compact"
        rounded="lg"
        base-color="grey-lighten-1"
        class="profile-select"
        :hide-details="true"
        :hide-selected="true"
        :hide-no-data="true"
        :single-line="true"
        color="grey-lighten-2"
        menu-icon="mdi-menu-swap"
    />
</template>

<style scoped lang="css">
.profile-select {
  width: 100%;
  max-width: 250px;
}
</style>
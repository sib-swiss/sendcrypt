<script setup lang="ts">

declare interface Props {
  disabled?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    disabled: false,
    loading: false
})
defineEmits(['click'])
</script>

<template>
    <v-btn
        :disabled="disabled"
        :loading="loading"
        variant="flat"
        :color="disabled ? undefined : 'base'"
        class="border-sm"
        @click="$emit('click')"
    >
        <div class="font-weight-medium">
            <slot>Browse</slot>
        </div>
    </v-btn>
</template>

<style scoped>

</style>
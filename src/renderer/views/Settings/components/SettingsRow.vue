<script setup lang="ts">
import {computed, ref} from "vue";
import SettingsSelect from "@/renderer/views/Settings/components/SettingsSelect.vue";
import SettingsCheckbox from "@/renderer/views/Settings/components/SettingsCheckbox.vue";
import SettingsButton from "@/renderer/views/Settings/components/SettingsButton.vue";
import SettingsTextarea from "@/renderer/views/Settings/components/SettingsTextarea.vue";
import SettingsHiddenText from "@/renderer/views/Settings/components/SettingsHiddenText.vue";

declare interface Props {
  modelValue: string | boolean | number | null;
  description: string | null;
  variant: 'checkbox' | 'select' | 'button' | 'text' | 'password';
  disabled?: boolean;
  loading?: boolean;
  hideField?: boolean;
  copy?: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  items?: any[];
  itemValue?: string;
  itemTitle?: string;
  rules?: Array<CallableFunction>
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    loading: false,
    hideField: false,
    copy: false,
    items: undefined,
    rules: undefined,
    itemValue: 'value',
    itemTitle: 'name'
})
const emit = defineEmits(['update:modelValue', 'click', 'blur', 'change', 'copy'])

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const isShown = ref(false)
const randomId = Math.random().toString(36).substring(7)
const copyToClipboard = () => {
    isShown.value = true
    emit('copy')
    setTimeout(() => {
        isShown.value = false
    }, 3000)
}
</script>

<template>
    <v-row v-if="variant !== 'text' && variant !== 'password'">
        <v-col cols="8">
            <div class="text-body-2 font-weight-bold">
                <slot />
                <v-tooltip
                    v-if="copy"
                    :model-value="true"
                    location="end"
                    :activator="`#copy-btn-${randomId}`"
                    offset="5"
                    :class="isShown ? null : 'hidden'"
                >
                    <template #activator>
                        <v-btn
                            :id="`copy-btn-${randomId}`"
                            variant="text"
                            :color="isShown ? 'success' : 'primary'"
                            size="x-small"
                            rounded="lg"
                            :icon="isShown ? 'mdi-check' : 'mdi-content-copy'"
                            @click="copyToClipboard"
                        />
                    </template>
                    Copied!
                </v-tooltip>
            </div>
            <div class="text-caption">
                {{ description }}
            </div>
        </v-col>
        <v-col cols="4">
            <v-row class="ma-0">
                <v-spacer v-if="variant !== 'select'" />
                <SettingsSelect
                    v-if="variant === 'select'"
                    v-model="value"
                    :disabled="disabled"
                    :items="items as never[]"
                    :item-title="itemTitle"
                    :item-value="itemValue"
                    @change="$emit('change', $event)"
                />
                <SettingsCheckbox
                    v-if="variant === 'checkbox' && typeof value === 'boolean'"
                    v-model="value"
                    :disabled="disabled"
                    @change="$emit('change', $event)"
                />
                <SettingsButton
                    v-if="variant === 'button' && typeof value === 'string'"
                    v-model="value"
                    :disabled="disabled"
                    :loading="loading"
                    @click="$emit('click')"
                >
                    <slot name="label" />
                </SettingsButton>
            </v-row>
        </v-col>
    </v-row>
    <v-row v-if="(variant === 'text' || variant === 'password') && typeof value === 'string'">
        <v-col
            v-if="variant === 'text'"
            cols="12"
        >
            <div class="text-caption mb-3">
                {{ description }}
                <v-btn
                    v-if="copy"
                    :id="`copy-btn-${randomId}`"
                    :disabled="disabled"
                    variant="text"
                    :color="isShown ? 'success' : 'primary'"
                    size="x-small"
                    rounded="lg"
                    :icon="isShown ? 'mdi-check' : 'mdi-content-copy'"
                    @click="copyToClipboard"
                />
            </div>
            <SettingsTextarea
                v-if="variant === 'text'"
                v-show="!hideField"
                v-model="value"
                :disabled="disabled"
                @blur="$emit('blur', $event)"
            />
        </v-col>
        <v-col
            v-if="variant === 'password'"
            cols="8"
            md="7"
            lg="5"
            xl="3"
        >
            <div class="text-body-2 font-weight-bold">
                <slot />
            </div>
            <div class="text-caption mb-3">
                {{ description }}
                <v-btn
                    v-if="copy"
                    :id="`copy-btn-${randomId}`"
                    :disabled="disabled"
                    variant="text"
                    :color="isShown ? 'success' : 'primary'"
                    size="x-small"
                    rounded="lg"
                    :icon="isShown ? 'mdi-check' : 'mdi-content-copy'"
                    @click="copyToClipboard"
                />
            </div>
            <SettingsHiddenText
                v-if="variant === 'password'"
                v-model="value"
                :rules="rules as never[]"
                :disabled="disabled"
                @blur="$emit('blur', $event)"
            />
        </v-col>
        <v-col
            cols="4"
            md="5"
            lg="7"
            xl="9"
            align-self="end"
            class="text-end mb-1"
            :class="rules ? 'mb-6' : ''"
        >
            <slot name="button" />
        </v-col>
    </v-row>
</template>

<style scoped>
.hidden {
  display: none;
}

:deep(.v-icon--size-default) {
  font-size: calc(var(--v-icon-size-multiplier) * 1em);
}
</style>
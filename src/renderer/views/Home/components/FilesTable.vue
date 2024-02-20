<script setup lang="ts">
import {ref} from "vue";
import {DataTransferEvent, File} from "@/types";
import {useFilesStore} from "@/renderer/store/files";

interface Props {
  items: Array<File>
  headers: Array<{ key: string; title: string; sortable?: boolean; width: string;}>
}

const props = defineProps<Props>()
const emit = defineEmits(['items:remove'])
const filesStore = useFilesStore()
const {addFiles, addFilesFromFinder} = filesStore
const selected = ref<Array<number>>([])
const isShadowed = ref(false)

function removeFile(index: number) {
    emit('items:remove', [index])
}

function removeFiles() {
    emit('items:remove', selected.value)
}

const dropFiles = (e: DataTransferEvent) => {
    const target = e.dataTransfer
    if (target.files) {
        isShadowed.value = false
        addFiles(target.files)
    }
}
</script>

<template>
    <v-card
        variant="outlined"
        border="1"
        color="grey-lighten-2"
        rounded="lg"
        @dragover.prevent
        @drop.prevent
    >
        <v-data-table-virtual
            v-model="selected"
            :headers="props.headers"
            :items="props.items"
            :show-select="true"
            :single-select="false"
            item-key="id"
            :items-per-page="0"
            :class="isShadowed ? 'mask' : ''"
            sort-asc-icon="mdi-menu-up"
            sort-desc-icon="mdi-menu-down"
            @drop="dropFiles"
            @dragover="isShadowed = true"
            @dragend="isShadowed = false"
            @dragleave="isShadowed = false"
        >
            <template #no-data>
                <div class="py-12">
                    <v-icon
                        size="64"
                    >
                        mdi-file-plus
                    </v-icon>
                    <p class="text-body-1 mt-3">
                        <span
                            class="font-weight-bold cursor-pointer"
                            @click="addFilesFromFinder"
                        >Choose files</span> or drag and drop them here
                    </p>
                </div>
            </template>
            <template #[`header.actions`]="{ someSelected }">
                <v-menu :disabled="someSelected === false || props.items.length === 0">
                    <template #activator="{ props: bind }">
                        <v-btn
                            :disabled="someSelected === false || props.items.length === 0"
                            v-bind="bind"
                            :icon="true"
                            variant="plain"
                            density="compact"
                            rounded="lg"
                        >
                            <v-icon
                                size="18"
                                color="pb-1"
                            >
                                mdi-dots-horizontal
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-list
                        :nav="true"
                        width="150"
                        density="compact"
                        class="pa-1"
                        elevation="1"
                        border="sm"
                        rounded="lg"
                    >
                        <v-list-item
                            :title="`Remove ${selected.length} items`"
                            class="text-body-1"
                            :link="true"
                            base-color="error"
                            density="compact"
                            rounded="lg"
                            @click="removeFiles"
                        >
                            <template #title="{ title }">
                                <div class="text-body-2 font-weight-regular">
                                    {{ title }}
                                </div>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <template #[`item.name`]="{ item }">
                <v-tooltip
                    :text="item.path"
                    location="top"
                    content-class="bg-black text-white rounded-lg"
                >
                    <template #activator="{ props: binds }">
                        <span v-bind="binds">{{ item.name }}</span>
                    </template>
                </v-tooltip>
            </template>
            <template #[`item.actions`]="{ index }">
                <v-menu>
                    <template #activator="{ props: bind }">
                        <v-btn
                            v-bind="bind"
                            :icon="true"
                            variant="plain"
                            density="compact"
                            rounded="lg"
                        >
                            <v-icon
                                size="18"
                                color="grey-darken-2 pb-1"
                            >
                                mdi-dots-horizontal
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-list
                        :nav="true"
                        width="150"
                        density="compact"
                        class="pa-1"
                        elevation="1"
                        border="sm"
                        rounded="lg"
                    >
                        <v-list-item
                            title="Remove"
                            class="text-body-1"
                            base-color="error"
                            :link="true"
                            density="compact"
                            rounded="lg"
                            @click="removeFile(index)"
                        >
                            <template #title="{ title }">
                                <div class="text-body-2 font-weight-regular">
                                    {{ title }}
                                </div>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-data-table-virtual>
    </v-card>
</template>

<style scoped>
:deep(th) {
  height: calc(var(--v-table-header-height) - 16px) !important;
}

td {
  height: 50px !important;
}

.mask {
  background-color: rgba(255, 255, 255, 0.15);
  z-index: 1;
  transition: background-color 0.3s;
}
</style>
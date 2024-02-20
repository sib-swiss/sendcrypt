<script setup lang="ts">
import {Profile} from "@/types";

interface Props {
  items: Array<Profile>
  headers: Array<{ key: string; title: string; sortable?: boolean; width: string; }>
  selected: number | null | undefined
}

defineProps<Props>()
const emit = defineEmits([
    'remove:item',
    'select:item',
    'edit:item',
])

function remove(item: Profile) {
    emit('remove:item', item)
}

function edit(item: Profile) {
    emit('edit:item', item)
}

function select(item: Profile) {
    emit('select:item', item)
}
</script>

<template>
    <v-card
        variant="outlined"
        elevation="0"
        color="grey-lighten-2"
        rounded="lg"
    >
        <v-data-table-virtual
            :headers="headers"
            :items="items"
            item-key="id"
            :items-per-page="0"
            :hide-no-data="true"
            sort-asc-icon="mdi-menu-up"
            sort-desc-icon="mdi-menu-down"
        >
            <template #item="{ item }">
                <tr class="v-data-table__tr">
                    <td
                        class="text-truncate v-data-table__td v-data-table-column--align-start"
                        style="width: 30%;"
                    >
                        {{ item.name }}
                        <v-icon
                            v-if="item.id === selected"
                            size="18"
                            color="success"
                        >
                            mdi-check-circle
                        </v-icon>
                    </td>
                    <td
                        class="text-truncate v-data-table__td v-data-table-column--align-start"
                        style="width: 30%;"
                    >
                        {{ item.host }}
                    </td>
                    <td class="text-truncate v-data-table__td v-data-table-column--align-start">
                        {{ item.username }}
                    </td>
                    <td
                        class="v-data-table__td v-data-table-column--align-start"
                        style="width: 30%;"
                    >
                        <v-menu>
                            <template #activator="{ props }">
                                <v-btn
                                    v-bind="props"
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
                                width="170"
                                density="compact"
                                class="pa-1 pb-0"
                                elevation="1"
                                border="sm"
                                rounded="lg"
                            >
                                <v-list-item
                                    title="Switch to this project"
                                    class="text-body-1"
                                    :link="true"
                                    :disabled="item.id === selected"
                                    density="compact"
                                    rounded="lg"
                                    @click="select(item)"
                                >
                                    <template #title="{ title }">
                                        <div class="text-body-2 font-weight-regular">
                                            {{ title }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    title="Edit"
                                    class="text-body-1"
                                    :link="true"
                                    density="compact"
                                    rounded="lg"
                                    @click="edit(item)"
                                >
                                    <template #title="{ title }">
                                        <div class="text-body-2 font-weight-regular">
                                            {{ title }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    title="Remove"
                                    class="text-body-1"
                                    base-color="error"
                                    :link="true"
                                    density="compact"
                                    rounded="lg"
                                    @click="remove(item)"
                                >
                                    <template #title="{ title }">
                                        <div class="text-body-2 font-weight-regular">
                                            {{ title }}
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>
        </v-data-table-virtual>
    </v-card>
</template>

<style scoped>
th {
  height: 40px !important;
}

td {
  height: 50px !important;
}
</style>
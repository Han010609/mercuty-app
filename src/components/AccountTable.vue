<template>
  <q-table
    :rows="accounts"
    :columns="columns"
    :loading="isLoading"
    row-key="id"
    flat
    bordered
  >
    <!-- 狀態欄位 - 自訂樣式 -->
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <q-badge
          :color="props.value === 'ON' ? 'positive' : 'negative'"
          :label="props.value"
        />
      </q-td>
    </template>

    <!-- 角色等級欄位 - 自訂樣式 -->
    <template v-slot:body-cell-roleLevel="props">
      <q-td :props="props">
        <q-badge color="primary" :label="props.value" />
      </q-td>
    </template>

    <!-- 操作欄位 -->
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          icon="edit"
          color="primary"
          @click="$emit('edit', props.row)"
          class="q-mr-xs"
        />
        <q-btn
          flat
          round
          icon="delete"
          color="negative"
          @click="$emit('delete', props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { Account } from '@/types'

/**
 * Props
 */
interface Props {
  accounts: Account[]
  isLoading: boolean
}

defineProps<Props>()

/**
 * Emits
 */
defineEmits<{
  edit: [account: Account]
  delete: [account: Account]
}>()

/**
 * 表格欄位定義
 */
const columns = [
  {
    name: 'name',
    required: true,
    label: '姓名',
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'email',
    required: true,
    label: '電子郵件',
    align: 'left',
    field: 'email',
    sortable: true
  },
  {
    name: 'roleLevel',
    label: '角色等級',
    align: 'left',
    field: 'roleLevel',
    sortable: true
  },
  {
    name: 'status',
    label: '狀態',
    align: 'left',
    field: 'status',
    sortable: true
  },
  {
    name: 'actions',
    label: '操作',
    align: 'center',
    field: 'actions'
  }
]
</script>


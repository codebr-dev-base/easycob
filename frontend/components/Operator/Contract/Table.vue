<template>
  <div class="q-pa-md">
    <q-table
      bordered
      title="Contratos"
      :rows="rows"
      :columns="columns"
      row-key="id"
      selection="single"
      v-model:selected="selected"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20, 40, 80]"
      :loading="pending"
      @update:selected="handleSelectContract"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <div class="q-pa-md">
          <div class="q-gutter-sm">
            <q-radio
              dense
              v-model="pagination.status"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="ATIVO"
              label="Ativo"
            />
            <q-radio
              dense
              v-model="pagination.status"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="INATIVO"
              label="Inativo"
            />
            <q-radio
              dense
              v-model="pagination.status"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              :val="null"
              label="Todos"
            />
          </div>
        </div>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              v-if="props.row.actionNegotiation"
              class="q-ml-xs"
              color="green-8"
              padding="xs"
              icon="payments"
              size="sm"
              @click="handlerEditAction(props.row.actionNegotiation)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Pagamentos do acordo parcelado
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="props.row.actionPromise"
              class="q-ml-xs"
              color="yellow-8"
              padding="xs"
              icon="payments"
              size="sm"
              @click="handlerEditAction(props.row.actionPromise)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Pagamentos do acordo
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>
    <q-card class="q-ma-sm">
      <div class="row justify-end q-pa-md">
        <strong>
          Total:
          {{
            parseFloat(meta.valPrinc).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </strong>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { ActionT } from "~/types/action";
const selected = ref([]);
const emit = defineEmits([
  "request",
  "select:contract",
  "change:status",
  "edit:action",
]);
const props = defineProps({
  rows: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  meta: {
    type: Object,
    required: true,
  },
  pending: Boolean,
  clientId: {
    type: [Number, String],
    require: true,
  },
});

const columns = [
  {
    name: "desContr",
    label: "Contrato",
    field: "desContr",
  },
  {
    name: "datVenci",
    label: "Dias de atraso",
    field: (row: any) => {
      if (row.datVenci) {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const date = new Date(new Date(row.datVenci).setHours(24, 0, 0, 0));
        return Math.round(
          (today.getTime() - date.getTime()) / (1000 * 3600 * 24)
        );
      } else {
        return "";
      }
    },
  },
  {
    name: "valPrinc",
    label: "Valor Total",
    field: (row: any) => {
      if (row.valPrinc) {
        const val = parseFloat(row.valPrinc);
        return val.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        return "";
      }
    },
  },
  {
    name: "countPrinc",
    label: "Quant. Total",
    field: "countPrinc",
  },
  {
    name: "valPago",
    label: "Valor Pago",
    field: (row: any) => {
      if (row.valPago) {
        const val = parseFloat(row.valPago);
        return val.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        return "";
      }
    },
    classes: (row: any) => {
      if (row.valPago > 0) {
        return "text-green-9 text-bold text-green-shadow";
      }
      return "";
    },
  },
  {
    name: "countPago",
    label: "Quant. Pago",
    field: "countPago",
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    classes: (row: any) => {
      if (row.status === "INATIVO") {
        return "text-red-13";
      }
      return "";
    },
  },
  {
    name: "actions",
    label: "Ações",
    field: "actions",
  },
];

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: props.meta.currentPage,
  rowsPerPage: props.meta.perPage,
  rowsNumber: props.meta.total,
  status: "ATIVO",
});

watch(
  () => props.meta,
  (meta, prevMeta) => {
    // pagination.value.page = meta.currentPage;
    pagination.value.rowsPerPage = meta.perPage;
    pagination.value.rowsNumber = meta.total;
  }
);

watch(
  () => pagination.value.status,
  (status, prevStatus) => {
    pagination.value.status = status;
    emit("request", {
      pagination: pagination.value,
    });
  }
);

const handleSelectContract = (contracts: any) => {
  emit("select:contract", contracts);
};

const handlerEditAction = (action: ActionT) => {
  emit("edit:action", action);
};

const onRequest = (e: any) => {
  pagination.value.page = e.pagination.page;
  pagination.value.rowsPerPage = e.pagination.rowsPerPage;
  pagination.value.sortBy = e.pagination.sortBy;
  pagination.value.descending = e.pagination.descending;
  emit("request", {
    pagination: pagination.value,
  });
};
</script>

<style></style>

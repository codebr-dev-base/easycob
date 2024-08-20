<template>
  <div class="q-pa-md">
    <q-table
      title="Contatos"
      :rows="rows"
      :columns="columns"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 40, 80]"
      row-key="id"
      :loading="pending"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <div class="row">
          <div class="col-12">
            <q-input
              borderless
              filled
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar"
            >
              <template v-slot:append>
                <q-btn flat icon="search" @click="onSubmit" />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-radio
              v-model="filterColumn"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="contract"
              label="Contrato"
            />
            <q-radio
              v-model="filterColumn"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="email"
              label="E-mail"
            />
            <q-radio
              v-model="filterColumn"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="name"
              label="Nome"
            />
          </div>
        </div>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>
<script lang="ts">
//import { UserT } from "~/types/user";
import { ActionT } from "~/types/action";
import { AsyncDataT } from "~/types/use_fetch";
//import * as smask from "smask";
import { exportTable } from "~/utils";
import * as smask from "smask";
</script>

<script lang="ts" setup>
import { useQuasar, QForm } from "quasar";
import { Value } from "sass";
const emit = defineEmits(["request", "send:action", "create:campaign"]);
const filter = ref("");
const filterColumn = ref("name");
const formFilterDate = ref<QForm | null>(null);
const showForm = ref(false);

const handleShowForm = () => {
  showForm.value = !showForm.value;
};

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
  type: {
    type: String,
    default: "SMS",
  },
});

const columns = [
  {
    name: "id",
    label: "Id",
    field: "id",
    format: (val: any) => val,
    sortable: true,
  },
  {
    name: "cliente",
    label: "Nome",
    field: "cliente",
    format: (val: any) => val,
    sortable: true,
  },
  {
    name: "contrato",
    label: "Contrato",
    field: "contrato",
    format: (val: any) => val,
    sortable: true,
  },
  {
    name: "contato",
    label: "Contato",
    field: "contato",
    format: (val: any) => {
      if (props.type === "SMS") {
        return smask.mask(val, ["(dd) dddd-dddd", "(dd) ddddd-dddd"]);
      }
      return val;
    },
    sortable: true,
  },
  {
    name: "descricao",
    label: "Descricao",
    field: "descricao",
    format: (val: any) => val,
  },
  {
    name: "filial",
    label: "Filial",
    field: "filial",
    format: (val: any) => val,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    format: (val: any) => val,
  },
];

const pagination = ref({
  sortBy: "id",
  descending: true,
  page: props.meta.currentPage,
  rowsPerPage: props.meta.perPage,
  rowsNumber: props.meta.total,
  sync: null,
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
  () => pagination.value.sync,
  (sync, prevSync) => {
    pagination.value.sync = sync;
    emit("request", {
      pagination: pagination.value,
      filter: filter.value,
      filterColumn: filterColumn.value,
    });
  }
);

watch(filterColumn, (oldfilterColumn, prevfilterColumns) => {
  emit("request", {
    pagination: pagination.value,
    filter: filter.value,
    filterColumn: filterColumn.value,
  });
});

watch(filter, (newFilter, prevfilter) => {
  if (filter.value.length > 4) {
    emit("request", {
      pagination: pagination.value,
      filter: filter.value,
      filterColumn: filterColumn.value,
    });
  }
});

const onRequest = (e: any) => {
  pagination.value.page = e.pagination.page;
  pagination.value.rowsPerPage = e.pagination.rowsPerPage;
  pagination.value.sortBy = e.pagination.sortBy;
  pagination.value.descending = e.pagination.descending;
  emit("request", {
    pagination: pagination.value,
    filter: filter.value,
    filterColumn: filterColumn.value,
  });
};

const send = (action: ActionT) => {
  emit("send:action", action);
};

const handleCreateCampaign = (campaign: any) => {
  showForm.value = !showForm.value;
  emit("create:campaign", campaign);
};

const onSubmit = () => {
  formFilterDate.value?.validate().then((success) => {
    if (success) {
      emit("request", {
        pagination: pagination.value,
        filter: filter.value,
        filterColumn: filterColumn.value,
      });
    }
  });
};

const onReset = () => {
  emit("request", {
    pagination: pagination.value,
    filter: filter.value,
    filterColumn: filterColumn.value,
  });
};
</script>

<style></style>

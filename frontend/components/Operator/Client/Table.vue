<template>
  <div class="q-pa-md">
    <q-table
      title="Clientes"
      :rows="rows"
      :columns="columns"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 40, 80]"
      row-key="id"
      :loading="pending"
      @request="onRequest"
    >
      <template v-slot:top-left>
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
      <template v-slot:top-right>
        <div class="row">
          <div class="col-12">
            <q-input
              v-if="filterColumn !== 'desCpf'"
              borderless
              filled
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-input
              v-if="filterColumn === 'desCpf'"
              borderless
              filled
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-radio
              v-model="filterColumn"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="desContr"
              label="Contrato"
            />
            <q-radio
              v-model="filterColumn"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="desCpf"
              label="CPF/CNPJ"
            />
            <q-radio
              v-model="filterColumn"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="phone"
              label="Telefone"
            />
            <q-radio
              v-model="filterColumn"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="email"
              label="e-mail"
            />
            <q-radio
              v-model="filterColumn"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="nomClien"
              label="Nome"
            />
          </div>
        </div>
      </template>
      <template v-slot:body-cell-contracts="props">
        <q-td :props="props" style="padding: 0">
          <q-list
            dense
            style="max-width: 200px"
            v-if="props.row.contracts.length == 1"
          >
            <q-item>
              <q-item-section>
                <q-item-label>{{
                  props.row.contracts[0].desContr
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list
            dense
            style="max-width: 200px"
            v-if="props.row.contracts.length > 1"
          >
            <q-expansion-item
              dense
              expand-separator
              :label="props.row.contracts[0].desContr"
            >
              <q-card>
                <q-card-section>
                  <q-list dense separator>
                    <q-item
                      v-for="item in props.row.contracts"
                      :key="item.desContr"
                    >
                      <q-item-section>
                        <q-item-label>{{ item.desContr }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-td>
      </template>
      <template v-slot:body-cell-phones="props">
        <q-td :props="props" style="padding: 0; width: 150px">
          <q-list
            dense
            style="max-width: 1750px"
            v-if="props.row.phones.length == 1"
          >
            <q-item>
              <q-item-section>
                <q-item-label>{{
                  smask.mask(props.row.phones[0].contato, [
                    "(dd) dddd-dddd",
                    "(dd) ddddd-dddd",
                  ]) + `(${props.row.phones[0].percentualAtender}%)`
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list
            dense
            style="max-width: 175px"
            v-if="props.row.phones.length > 1"
          >
            <q-expansion-item
              dense
              expand-separator
              :label="
                smask.mask(props.row.phones[0].contato, [
                  '(dd) dddd-dddd',
                  '(dd) ddddd-dddd',
                ]) + `(${props.row.phones[0].percentualAtender}%)`
              "
            >
              <q-card>
                <q-card-section>
                  <q-list dense separator>
                    <q-item
                      v-for="item in props.row.phones"
                      :key="item.contato"
                    >
                      <q-item-section>
                        <q-item-label>{{
                          smask.mask(item.contato, [
                            "(dd) dddd-dddd",
                            "(dd) ddddd-dddd",
                          ]) + `(${item.percentualAtender}%)`
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              color="primary"
              icon="info"
              size="sm"
              :to="`/operator/client/${props.row.codCredorDesRegis}`"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Detalhes
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>

<script lang="ts" setup>
import * as smask from "smask";
const emit = defineEmits(["request"]);
const filter = ref("");
const filterColumn = ref("nomClien");
//const today = new Date(new Date().setHours(0, 0, 0, 0));

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
});

const columns = [
  {
    name: "contracts",
    label: "Contratos",
    field: "contracts",
  },
  {
    name: "nomClien",
    label: "Nome",
    field: "nomClien",
    sortable: true,
  },
  {
    name: "desCpf",
    label: "CPF/CNPJ",
    field: (row: any) => {
      return smask.mask(row.desCpf, ["ddd.ddd.ddd-dd", "dd.ddd.ddd/dddd-dd"]);
    },
    sortable: true,
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
    name: "phones",
    label: "Fones",
    field: "phones",
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

watch(filter, (oldfilterColumn, prevfilterColumns) => {
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
</script>

<style></style>

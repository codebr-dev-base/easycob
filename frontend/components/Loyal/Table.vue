<template>
  <div class="q-pa-md">
    <q-table
      v-model:rows="rows"
      :columns="columns"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 40, 80]"
      row-key="id"
      :loading="pending"
      @request="onRequest"
      dense
    >
      <template v-slot:top>
        <div class="row justify-between" style="width: 100%">
          <div class="col-4 col-sm-5 col-xm-6 q-ma-xs">
            <div class="q-gutter-md">
              <q-select
                filled
                v-model="selectFaixaTempos"
                :options="faixaTempos"
                option-value="faixaTempo"
                option-label="faixaTempo"
                label="Faixas de tempos"
                emit-value
                map-options
                dense
                options-dense
                multiple
              >
              </q-select>
              <q-select
                filled
                v-model="selectFaixaValores"
                :options="faixaValores"
                option-value="faixaValor"
                option-label="faixaValor"
                label="Faixas de valores"
                emit-value
                map-options
                dense
                options-dense
                multiple
              >
              </q-select>
              <q-select
                filled
                v-model="selectFaixaTitulos"
                :options="faixaTitulos"
                option-value="faixaTitulos"
                option-label="faixaTitulos"
                label="Faixas de Títulos"
                emit-value
                map-options
                dense
                options-dense
                multiple
              >
              </q-select>
              <q-select
                v-model="selectTypeAction"
                :options="typeAction"
                option-label="name"
                label="Acionamento"
                option-value="id"
                emit-value
                map-options
                filled
                dense
                options-dense
                multiple
              >
              </q-select>
              <q-select
                filled
                v-model="selectFaixaClusters"
                :options="faixaClusters"
                option-value="classCluster"
                option-label="classCluster"
                label="Faixas de clusters"
                emit-value
                map-options
                dense
                options-dense
                multiple
              >
              </q-select>
              <q-checkbox v-model="selectNotAction" label="Sem acionamentos" />
            </div>
          </div>
          <div class="col-4 col-sm-5 col-xm-6 q-ma-xs">
            <div class="q-gutter-md">
              <q-input
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
                val="contato"
                label="Contato"
              />
              <q-radio
                v-model="filterColumn"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="nomClien"
                label="Nome"
              />
              <q-form @submit="onSubmit" ref="formFilterDate" class="row">
                <q-input
                  v-model="searchDate.start"
                  filled
                  type="date"
                  hint="Início"
                  dense
                  :rules="[isEmpty]"
                />
                <q-input
                  v-model="searchDate.end"
                  filled
                  type="date"
                  hint="Fim"
                  dense
                  class="q-ml-sm"
                  :rules="[isEmpty]"
                />
                <q-btn
                  style="width: 10px; height: 10px"
                  color="primary"
                  icon="filter_alt"
                  type="submit"
                />
              </q-form>
              <q-select
                filled
                v-model="selectUnidades"
                :options="unidades"
                option-value="unidade"
                option-label="unidade"
                label="Unidades"
                emit-value
                map-options
                dense
                options-dense
                multiple
              >
              </q-select>

              <q-select
                filled
                v-model="selectSituacoes"
                :options="situacoes"
                option-value="situacao"
                option-label="situacao"
                label="Situação do Contrato"
                emit-value
                map-options
                dense
                options-dense
                multiple
              >
              </q-select>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-check="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-checkbox
              v-model="props.row.check"
              color="green"
              @update:model-value="
                () => {
                  emit('update:check', props.row.id);
                }
              "
            />
          </div>
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
    </q-table>
  </div>
</template>

<script lang="ts" setup>
import { QForm } from "quasar";
import * as smask from "smask";
import { isEmpty } from "~/validation/entity";
const filter = ref("");
const filterColumn = ref("nomClien");
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
  faixaTempos: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  faixaValores: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  faixaTitulos: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  faixaClusters: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  unidades: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  situacoes: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  typeAction: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  pending: Boolean,
});

const rows = ref(toRaw(props.rows));
const emit = defineEmits([
  "request",
  "selected",
  "update:status",
  "update:check",
]);
const formFilterDate = ref<QForm | null>(null);
const selectFaixaTempos = ref(null);
const selectFaixaValores = ref(null);
const selectFaixaTitulos = ref(null);
const selectTypeAction = ref(null);
const selectFaixaClusters = ref(null);
const selectUnidades = ref(null);
const selectSituacoes = ref(null);
const selectNotAction = ref(false);

const scopeNegociation = ref("my");
const selectUser = ref(null);

const searchDate = ref({
  start: null,
  end: null,
});

const columns = [
  {
    name: "actions",
    label: "Ações",
    field: "actions",
  },
  {
    name: "check",
    label: "Acionado",
    align: "left",
    field: "check",
    sortable: true,
  },
  {
    name: "lastAction",
    label: "Dt. U. acion.",
    align: "left",
    field: "lastAction",
    sortable: true,
    format: (val: any) => {
      if (val) {
        const data = new Date(new Date(val).setHours(0, 0, 0, 0));
        return data.toLocaleString("pt-BR").split(",")[0];
      }
      return "";
    },
  },
  {
    name: "lastActionName",
    label: "U. acion.",
    align: "left",
    field: "lastActionName",
    sortable: true,
  },
  {
    name: "classSitcontr",
    label: "Situação do Contrato",
    align: "left",
    field: "classSitcontr",
    sortable: true,
  },
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "dtInsert",
    label: "Data de Inserção",
    align: "left",
    field: "dtInsert",
    sortable: true,
    format: (val: any) => {
      if (val) {
        const data = new Date(new Date(val).setHours(0, 0, 0, 0));
        return data.toLocaleString("pt-BR").split(",")[0];
      }
      return "";
    },
  },
  {
    name: "unidade",
    label: "Unidade",
    align: "left",
    field: "unidade",
    sortable: true,
  },
  {
    name: "nomClien",
    label: "Nome do Cliente",
    align: "left",
    field: "nomClien",
    sortable: true,
  },

  {
    name: "contato",
    label: "Contato",
    align: "left",
    field: "contato",
    sortable: true,
    format: (val: string) => {
      return smask.mask(val, ["(dd) dddd-dddd", "(dd) ddddd-dddd"]);
    },
  },
  {
    name: "desContr",
    label: "Contrato",
    align: "left",
    field: "desContr",
    sortable: true,
  },
  {
    name: "tipoCliente",
    label: "T. Cliente",
    align: "left",
    field: "tipoCliente",
    sortable: true,
  },
  {
    name: "dtVenci",
    label: "Data de Vencimento",
    align: "left",
    field: "dtVenci",
    sortable: true,
  },
  {
    name: "valor",
    label: "Valor",
    align: "left",
    field: "valor",
    sortable: true,
    format: (val: number) => {
      return val.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    name: "qtdTitulos",
    label: "Q. de Títulos",
    align: "left",
    field: "qtdTitulos",
    sortable: true,
  },
  {
    name: "faixaTempo",
    label: "Faixa de Tempo",
    align: "left",
    field: "faixaTempo",
    sortable: true,
  },
  {
    name: "faixaValor",
    label: "Faixa de Valor",
    align: "left",
    field: "faixaValor",
    sortable: true,
  },
  {
    name: "faixaTitulos",
    label: "Faixa de Títulos",
    align: "left",
    field: "faixaTitulos",
    sortable: true,
  },
  { name: "bko", label: "BKO", align: "left", field: "bko", sortable: true },
  {
    name: "classUtiliz",
    label: "Classificação de Utilização",
    align: "left",
    field: "classUtiliz",
    sortable: true,
  },
  {
    name: "classCluster",
    label: "Cluster",
    align: "left",
    field: "classCluster",
    sortable: true,
  },
];

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: props.meta.currentPage,
  rowsPerPage: props.meta.perPage,
  rowsNumber: props.meta.total,
});

const emitRequest = () => {
  const value = toRaw(selectFaixaValores.value);
  let faixaValores = null;

  if (value) {
    const a = <Array<any>>value;
    faixaValores = a.map((item) => encodeURIComponent(item));
  }

  emit("request", {
    pagination: pagination.value,
    filter: filter.value,
    filterColumn: filterColumn.value,
    faixaTempos: selectFaixaTempos.value,
    faixaValores,
    faixaTitulos: selectFaixaTitulos.value,
    faixaClusters: selectFaixaClusters.value,
    typeActions: selectTypeAction.value,
    unidades: selectUnidades.value,
    situacoes: selectSituacoes.value,
    notAction: selectNotAction.value,
    searchDate: {
      start: searchDate.value.start,
      end: searchDate.value.end,
    },
  });
};

watch(filterColumn, (oldfilterColumn, prevfilterColumns) => {
  emitRequest();
});

watch(filter, (oldfilterColumn, prevfilterColumns) => {
  if (filter.value.length > 4) {
    emitRequest();
  }
});

watch(selectFaixaTempos, (oldFaixa, newFaixa) => {
  emitRequest();
});

watch(selectFaixaValores, (oldFaixa, newFaixa) => {
  emitRequest();
});

watch(selectFaixaTitulos, (oldFaixa, newFaixa) => {
  emitRequest();
});

watch(selectFaixaClusters, (oldFaixa, newFaixa) => {
  emitRequest();
});

watch(selectUnidades, (oldValue, newValue) => {
  emitRequest();
});

watch(selectSituacoes, (oldValue, newValue) => {
  emitRequest();
});

watch(selectTypeAction, (oldType, newType) => {
  emitRequest();
});

watch(selectNotAction, (oldType, newType) => {
  emitRequest();
});

const onRequest = (e: any) => {
  console.log(e);
  pagination.value.page = e.pagination.page;
  pagination.value.rowsPerPage = e.pagination.rowsPerPage;
  pagination.value.sortBy = e.pagination.sortBy;
  pagination.value.descending = e.pagination.descending;

  emitRequest();
};

const onSubmit = () => {
  formFilterDate.value?.validate().then((success) => {
    if (success) {
      emitRequest();
    } else {
      emitRequest();
    }
  });
};

const selectClassText = (item: any) => {
  if (item.followingStatus === "paid") {
    return "text-green-14";
  }

  if (item.followingStatus === "paid") {
    return "text-blue-grey-14";
  }

  if (item.followingStatus === "breach") {
    return "text-red-14";
  }
};

const selectClassBg = (item: any) => {
  if (item.followingStatus === "paid") {
    return "bg-green-12";
  }

  if (item.followingStatus === null) {
    return "bg-blue-grey-12";
  }

  if (item.followingStatus === "breach") {
    return "bg-red-12";
  }
};

watch(
  () => props.meta,
  (meta, prevMeta) => {
    pagination.value.page = meta.currentPage;
    pagination.value.rowsPerPage = meta.perPage;
    pagination.value.rowsNumber = meta.total;
  }
);

watch(
  () => props.rows,
  (newRows, prevRows) => {
    rows.value = [];
    rows.value = [...toRaw(newRows)];
  }
);

const selecIcon = (item: any) => {
  if (item.followingStatus === "paid") {
    return "mood";
  }

  if (item.followingStatus === null) {
    return "sentiment_neutral";
  }

  if (item.followingStatus === "breach") {
    return "mood_bad";
  }
};
</script>

<style></style>

function old(value: null, oldValue: null, onCleanup: OnCleanup) { throw new
Error("Function not implemented."); }

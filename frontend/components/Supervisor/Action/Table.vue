<template>
  <div class="q-pa-md">
    <q-table
      title="Clientes"
      :rows="rows"
      :columns="columns"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 40, 80]"
      row-key="id"
      :loading="pending || listForCsv.pending.value"
      @request="onRequest"
      dense
    >
      <template v-slot:top-left>
        <div class="q-pa-md" style="min-width: 100%">
          <div class="col-12 row">
            <q-select
              filled
              v-model="selectUser"
              :options="userOperato"
              option-value="id"
              option-label="name"
              label="Operador"
              emit-value
              map-options
              dense
              options-dense
              class="col-10"
            />
            <q-checkbox v-model="status" label="Status" class="col-2" />
          </div>
          <div class="col-12 q-mt-sm">
            <div style="min-width: 100%; max-width: min-content">
              <q-select
                filled
                v-model="selectTypeAction"
                :options="typeAction"
                option-value="id"
                option-label="name"
                label="Acionamento"
                emit-value
                map-options
                dense
                options-dense
                use-chips
                stack-label
                multiple
              >
              </q-select>
            </div>
          </div>
          <div class="col-12 q-mt-sm">
            <q-form
              @submit="onSubmit"
              @reset="onReset"
              ref="formFilterDate"
              class="row"
            >
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
              <q-btn
                style="width: 10px; height: 10px; margin-left: 5px"
                color="primary"
                icon="backspace"
                type="reset"
                flat
              />
            </q-form>
          </div>
        </div>
      </template>
      <template v-slot:top-right>
        <div class="row">
          <div class="col-12">
            <q-input
              borderless
              filled
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar cliente"
            >
              <template v-slot:append>
                <q-btn flat icon="search" @click="onSubmit" />
              </template>
            </q-input>
          </div>

          <div class="col-12 q-mt-sm">
            <q-radio
              dense
              v-model="pagination.sync"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              :val="null"
              label="Todos"
            />
            <q-radio
              dense
              v-model="pagination.sync"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="true"
              label="Enviados"
            />
            <q-radio
              dense
              v-model="pagination.sync"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="false"
              label="Retidos"
            />
          </div>

          <div class="col-12 q-mt-sm">
            <div style="min-width: 100%; max-width: min-content">
              <q-select
                filled
                v-model="selectReturnType"
                :options="returnType"
                option-value="retornotexto"
                option-label="retornotexto"
                label="Tipos de retorno"
                emit-value
                map-options
                dense
                options-dense
              >
              </q-select>
            </div>
          </div>

          <div class="col-12 q-mt-sm flex justify-end">
            <q-btn
              color="primary"
              icon-right="archive"
              label="Exportar para csv"
              no-caps
              @click="handleExportToCsv"
            />
          </div>
        </div>
      </template>

      <template v-slot:body-cell-smile="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-icon
              :name="selecIcon(props.row)"
              size="24px"
              :class="selectClassText(props.row)"
            />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-unificationCheck="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-checkbox
              v-model="props.row.unificationCheck"
              color="green"
              @update:model-value="
                () => {
                  emit('update:unificationCheck', props.row.id);
                }
              "
            />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-retornotexto="props">
        <q-td :props="props" class="text-right">
          <div
            class="q-gutter-sm ellipsis text-right"
            :class="selectClassText(props.row)"
          >
            {{ props.row.retornotexto }}
          </div>
          <q-tooltip class="text-body2" :class="selectClassBg(props.row)">
            {{ props.row.retornotexto }}
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-operador="props">
        <q-td :props="props" class="text-right">
          <div class="q-gutter-sm ellipsis text-right">
            {{ props.row.user.name }}
          </div>
          <q-tooltip class="text-body2">
            {{ props.row.user.name }}
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-client="props">
        <q-td :props="props" class="text-right">
          <div class="q-gutter-sm ellipsis text-right">
            {{ props.row.client ? props.row.client.nomClien : "" }}
          </div>
          <q-tooltip class="text-body2">
            {{ props.row.client ? props.row.client.nomClien : "" }}
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              v-if="isAdmin && checkEnableSend(props.row)"
              color="red-13"
              icon="send"
              size="sm"
              @click="send(props.row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Enviar
              </q-tooltip>
            </q-btn>

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
<script lang="ts">
//import { UserT } from "~/types/user";
import { ActionT } from "~/types/action";
import { AsyncDataT } from "~/types/use_fetch";
import { UserAuthT } from "~/types/user";
//import * as smask from "smask";
import { exportTable } from "~/utils";
import { isEmpty } from "~/validation/entity";
</script>

<script lang="ts" setup>
import { useQuasar, QForm } from "quasar";
import { Value } from "sass";
//import Skill from "~/pages/admin/skill.vue";
const emit = defineEmits([
  "request",
  "send:action",
  "update:status",
  "update:unificationCheck",
]);
const filter = ref("");
const filterColumn = ref("clientNomClien");
const formFilterDate = ref<QForm | null>(null);
const selectUser = ref(null);
const selectTypeAction = ref([]);
const selectReturnType = ref();
const isAdmin = ref(false);

const auth = useAuth();
const user = <UserAuthT>auth.data.value?.user;

for (const skill of user.skills) {
  const s = <{ module: { shortName: string } }>skill;
  if (s.module && s.module.shortName) {
    if (s.module.shortName === "admin") {
      isAdmin.value = true;
    }
  }
}

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
  typeAction: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  userOperato: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  returnType: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  listForCsv: {
    type: Object as PropType<
      AsyncDataT<
        {
          data: any[];
          meta: any;
        },
        any
      >
    >,
    required: true,
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
    name: "smile",
    label: "Status",
    field: "smile",
    format: (val: any) => val,
  },
  {
    name: "unificationCheck",
    label: "Unificado",
    field: "unificationCheck",
    format: (val: any) => val,
  },
  {
    name: "createdAt",
    label: "D. Acionamento",
    field: (row: any) => row.createdAt,
    format: (val: any) => {
      if (val) {
        const data = new Date(val);
        return data.toLocaleString("pt-BR");
      }
      return "";
    },
  },
  {
    name: "dayLate",
    label: "D. Atraso",
    field: "dayLate",
    format: (val: any) => val,
  },
  {
    name: "retornotexto",
    label: "Retorno",
    field: "retornotexto",
    sortable: true,
    format: (val: any) => val,
  },
  {
    name: "valPrinc",
    label: "V. Carteira",
    field: (row: any) => row.valPrinc,
    format: (val: any) => {
      if (val) {
        const value = parseFloat(val);
        return value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        return "";
      }
    },
  },
  {
    name: "nameAction",
    label: "Nome",
    field: (row: any) => row.typeAction.name,
    format: (val: any) => val,
  },
  {
    name: "operador",
    label: "Operador",
    field: (row: any) => row.user.name,
    format: (val: any) => val,
  },
  {
    name: "client",
    label: "Cliente",
    field: (row: any) => (row.client ? row.client.nomClien : ""),
    format: (val: any) => val,
  },
  {
    name: "actions",
    label: "Ações",
    field: "actions",
    format: (val: any) => val,
  },
];

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: props.meta.currentPage,
  rowsPerPage: props.meta.perPage,
  rowsNumber: props.meta.total,
  sync: null,
});

const searchDate = ref({
  start: null,
  end: null,
});

const status = ref(true);

watch(status, () => {
  emit("update:status", status.value);
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
      searchDate: {
        start: searchDate.value.start,
        end: searchDate.value.end,
      },
      userId: selectUser.value,
      typeActionIds: selectTypeAction.value,
      returnType: selectReturnType.value,
    });
  }
);

watch(filterColumn, (oldfilterColumn, prevfilterColumns) => {
  emit("request", {
    pagination: pagination.value,
    filter: filter.value,
    filterColumn: filterColumn.value,
    searchDate: {
      start: searchDate.value.start,
      end: searchDate.value.end,
    },
    userId: selectUser.value,
    typeActionIds: selectTypeAction.value,
    returnType: selectReturnType.value,
  });
});

watch(selectReturnType, (newReturnType, ReturnType) => {
  emit("request", {
    pagination: pagination.value,
    filter: filter.value,
    filterColumn: filterColumn.value,
    searchDate: {
      start: searchDate.value.start,
      end: searchDate.value.end,
    },
    userId: selectUser.value,
    typeActionIds: selectTypeAction.value,
    returnType: selectReturnType.value,
  });
});

watch(filter, (newFilter, prevfilter) => {
  if (filter.value.length > 4) {
    emit("request", {
      pagination: pagination.value,
      filter: filter.value,
      filterColumn: filterColumn.value,
      searchDate: {
        start: searchDate.value.start,
        end: searchDate.value.end,
      },
      userId: selectUser.value,
      typeActionIds: selectTypeAction.value,
      returnType: selectReturnType.value,
    });
  }
});

watch(selectUser, (newSelectUser, prevSelectUser) => {
  emit("request", {
    pagination: pagination.value,
    filter: filter.value,
    filterColumn: filterColumn.value,
    searchDate: {
      start: searchDate.value.start,
      end: searchDate.value.end,
    },
    userId: selectUser.value,
    typeActionIds: selectTypeAction.value,
    returnType: selectReturnType.value,
  });
});

watch(selectTypeAction, (newTypeAction, prevTypeAction) => {
  emit("request", {
    pagination: pagination.value,
    filter: filter.value,
    filterColumn: filterColumn.value,
    searchDate: {
      start: searchDate.value.start,
      end: searchDate.value.end,
    },
    userId: selectUser.value,
    typeActionIds: selectTypeAction.value,
    returnType: selectReturnType.value,
  });
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
    searchDate: {
      start: searchDate.value.start,
      end: searchDate.value.end,
    },
    userId: selectUser.value,
    typeActionIds: selectTypeAction.value,
    returnType: selectReturnType.value,
  });
};

const send = (action: ActionT) => {
  emit("send:action", action);
};

const onSubmit = () => {
  formFilterDate.value?.validate().then((success) => {
    if (success) {
      emit("request", {
        pagination: pagination.value,
        filter: filter.value,
        filterColumn: filterColumn.value,
        searchDate: {
          start: searchDate.value.start,
          end: searchDate.value.end,
        },
        userId: selectUser.value,
        typeActionIds: selectTypeAction.value,
        returnType: selectReturnType.value,
      });
    } else {
      emit("request", {
        pagination: pagination.value,
        filter: filter.value,
        filterColumn: filterColumn.value,
        userId: selectUser.value,
        typeActionIds: selectTypeAction.value,
        returnType: selectReturnType.value,
      });
    }
  });
};

const onReset = () => {
  emit("request", {
    pagination: pagination.value,
    filter: filter.value,
    filterColumn: filterColumn.value,
    userId: selectUser.value,
    typeActionIds: selectTypeAction.value,
    returnType: selectReturnType.value,
  });
  searchDate.value.start = null;
  searchDate.value.end = null;
};

const checkAction = (action: any) => {
  if (!action.sync || action.retorno != "00") {
    return false;
  }
  return true;
};

const selectClassText = (action: any) => {
  if (action.retorno === "00") {
    return "text-green-14";
  }

  if (action.retorno === "99") {
    return "text-red-14";
  }

  if (action.retorno === "Q") {
    return "text-deep-orange-14";
  }

  if (action.retorno === null) {
    return "text-blue-grey-14";
  }
};

const selectClassBg = (action: any) => {
  if (action.retorno === "00") {
    return "bg-green-12";
  }

  if (action.retorno === "99") {
    return "bg-red-12";
  }

  if (action.retorno === "Q") {
    return "bg-deep-orange-12";
  }

  if (action.retorno === null) {
    return "bg-blue-grey-12";
  }
};

const selecIcon = (action: any) => {
  if (action.retorno === "00") {
    return "mood";
  }

  if (action.retorno === "99") {
    return "mood_bad";
  }

  if (action.retorno === "Q") {
    return "hourglass_empty";
  }

  if (action.retorno === null) {
    return "block";
  }
};

const checkEnableSend = (action: any) => {
  if (action.retorno === "99") {
    return true;
  }

  if (action.retorno === null) {
    return true;
  }

  return false;
};

const handleExportToCsv = async () => {
  props.listForCsv.params.query.sync = pagination.value.sync;
  props.listForCsv.params.query.page = pagination.value.page;
  props.listForCsv.params.query.perPage = props.meta.total;
  props.listForCsv.params.query.orderBy = pagination.value.sortBy;
  props.listForCsv.params.query.descending = `${pagination.value.descending}`;
  props.listForCsv.params.query.keyword = filter.value;
  props.listForCsv.params.query.keywordColumn = filterColumn.value;
  props.listForCsv.params.query.userId = selectUser.value;
  props.listForCsv.params.query.typeActionIds = selectTypeAction.value;
  props.listForCsv.params.query.returnType = selectReturnType.value;

  if (searchDate.value.start != null && searchDate.value.end != null) {
    props.listForCsv.params.query.startDate = searchDate.value.start;
    props.listForCsv.params.query.endDate = searchDate.value.end;
  } else {
    props.listForCsv.params.query.startDate = null;
    props.listForCsv.params.query.endDate = null;
  }

  await props.listForCsv.execute();
  const columnsCsv = [];

  for (const [index, column] of [...columns].entries()) {
    if (!["smile", "actions"].includes(column.name)) {
      if (["syncedAt", "valPrinc"].includes(column.name)) {
        columnsCsv.push({ ...column, format: (val: any) => val });
      } else {
        columnsCsv.push(column);
      }
    }
  }

  columnsCsv.push({
    name: "status",
    label: "Status",
    field: (row: any) => checkAction(row),
    format: (val: any) => val,
  });

  exportTable(
    "acionamentos",
    columnsCsv,
    props.listForCsv.data.value?.data ? props.listForCsv.data.value?.data : []
  );
};
</script>

<style></style>

<template>
  <div class="q-pa-md">
    <q-table
      title="Campanhas"
      :rows="rows"
      :columns="columns"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 40, 80]"
      row-key="id"
      :loading="pending"
      @request="onRequest"
    >
      <template v-slot:top-left>
        <div class="q-pa-md" style="min-width: 100%">
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
              placeholder="Buscar campanha"
            >
              <template v-slot:append>
                <q-btn flat icon="search" @click="onSubmit" />
              </template>
            </q-input>
          </div>

          <div class="col-12 q-mt-sm flex justify-end">
            <q-btn color="red" icon="save" @click="handleShowForm">
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Criar campanha
              </q-tooltip>
              Criar campanha
            </q-btn>
            <OperatorCampaignForm
              v-model:show-form="showForm"
              :templates="templates"
              :type="type"
              @create:campaign="handleCreateCampaign"
              @show:form-template="handleShowFormTemplate"
            />
            <OperatorCampaignTemplateForm
              v-model:show-form="showFormTemplate"
              :type="type"
              @create:template="handleCreateTemplate"
            />
            <q-btn
              class="q-ml-sm"
              color="primary"
              icon-right="archive"
              label="Exportar para csv"
              no-caps
              @click="handleExportToCsv"
            />
          </div>
        </div>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div
            class="q-gutter-sm ellipsis"
            style="max-width: 100px"
            :class="selectClassText(props.row)"
          >
            {{ props.row.name }}
          </div>
          <q-tooltip v-if="props.row.pendencies" class="text-body2 bg-red-12">
            Campanha com pendência de envio!
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-message="props">
        <q-td :props="props">
          <div
            class="q-gutter-sm ellipsis"
            style="max-width: 30vw"
            v-html="props.row.message"
          ></div>
        </q-td>
      </template>

      <template v-slot:body-cell-operador="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            {{ props.row.user }}
          </div>
          <q-tooltip class="text-body2">
            {{ props.row.user }}
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              v-if="props.row.pendencies"
              color="red-13"
              icon="send"
              size="sm"
              @click="send(props.row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Enviar pendências
              </q-tooltip>
            </q-btn>
            <q-btn
              color="primary"
              icon="info"
              size="sm"
              :to="`/operator/campaign/${type.toLocaleLowerCase()}/${
                props.row.id
              }`"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Detalhes
              </q-tooltip>
            </q-btn>
            <q-btn
              color="red"
              icon="report_problem"
              size="sm"
              :to="`/operator/campaign/${type.toLocaleLowerCase()}/error/${
                props.row.id
              }`"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Erros importação
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
import { TemplateT } from "~/types/template";
import { AsyncDataT } from "~/types/use_fetch";
//import * as smask from "smask";
import { exportTable } from "~/utils";
</script>

<script lang="ts" setup>
import { isEmpty } from "~/validation/entity";
import { useQuasar, QForm } from "quasar";
import { Value } from "sass";
const emit = defineEmits([
  "request",
  "send:campaign",
  "create:campaign",
  "create:template",
  "show:form-campaign",
]);
const filter = ref("");
const filterColumn = ref("name");
const formFilterDate = ref<QForm | null>(null);
const showForm = ref(false);
const showFormTemplate = ref(false);

const handleShowForm = () => {
  showForm.value = !showForm.value;
  emit("show:form-campaign");
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
  templates: {
    type: Object as PropType<Array<TemplateT> | undefined>,
    default() {
      return [];
    },
  },
  type: {
    type: String,
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
    name: "date",
    label: "Data",
    field: "date",
    format: (val: any) => {
      if (val) {
        const data = new Date(new Date(val).setHours(0, 0, 0, 0));
        return data.toLocaleDateString("pt-BR");
      }
      return "";
    },
  },
  {
    name: "name",
    label: "Nome",
    field: "name",
    format: (val: any) => val,
    align: "left",
  },
  {
    name: "message",
    label: "Mensagem",
    field: "message",
    format: (val: any) => val,
    align: "left",
  },
  {
    name: "operador",
    label: "Operador",
    field: (row: any) => row.user,
    format: (val: any) => val,
    align: "left",
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
  descending: true,
  page: props.meta.currentPage,
  rowsPerPage: props.meta.perPage,
  rowsNumber: props.meta.total,
  sync: null,
});

const searchDate = ref({
  start: null,
  end: null,
});

watch(
  () => props.meta,
  (meta, prevMeta) => {
    // pagination.value.page = meta.currentPage;
    pagination.value.rowsPerPage = meta.perPage;
    pagination.value.rowsNumber = meta.total;
  }
);

const pending = ref(props.pending);

watch(
  () => props.pending,
  (now, prev) => {
    pending.value = now;
  }
);

watch(
  () => props.listForCsv.pending.value,
  (now, prev) => {
    pending.value = now;
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
    searchDate: {
      start: searchDate.value.start,
      end: searchDate.value.end,
    },
  });
};

const send = (campaign: any) => {
  emit("send:campaign", campaign);
};

const handleCreateCampaign = (campaign: any) => {
  showForm.value = !showForm.value;
  emit("create:campaign", campaign);
};

const handleCreateTemplate = (template: any) => {
  showFormTemplate.value = !showFormTemplate.value;
  emit("create:template", template);
};

const handleShowFormTemplate = (campaign: any) => {
  showFormTemplate.value = !showFormTemplate.value;
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
      });
    } else {
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
  searchDate.value.start = null;
  searchDate.value.end = null;
};

const handleExportToCsv = async () => {
  props.listForCsv.params.query.sync = pagination.value.sync;
  props.listForCsv.params.query.page = pagination.value.page;
  props.listForCsv.params.query.perPage = props.meta.total;
  props.listForCsv.params.query.orderBy = pagination.value.sortBy;
  props.listForCsv.params.query.descending = `${pagination.value.descending}`;
  props.listForCsv.params.query.keyword = filter.value;
  props.listForCsv.params.query.keywordColumn = filterColumn.value;

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
    columnsCsv.push(column);
  }

  exportTable(
    "acionamentos",
    columnsCsv,
    props.listForCsv.data.value?.data ? props.listForCsv.data.value?.data : []
  );
};

const selectClassText = (campaign: any) => {
  if (campaign.pendencies) {
    return "text-red-14";
  }
  return "text-green-14";
};
</script>

<style></style>

<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      selection="single"
      v-model:selected="selectedNegociation"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 40, 80]"
      row-key="id"
      :loading="pending"
      @request="onRequest"
      dense
    >
      <template v-slot:top>
        <div class="row justify-end" style="width: 100%">
          <div class="col-sm-12 col-md-6 col-lg-6 q-pa-sm">
            Entrada a vencer
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
              style="width: 100%"
            />
            <q-checkbox v-model="status" label="Status" />
            <q-checkbox
              class="col-12"
              v-model="discount"
              label="Acordo com desconto"
            />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6 q-pa-sm">
            <q-form @submit="onSubmit" ref="formFilterDate">
              <div class="q-pa-sm row justify-end">
                <strong class="self-center q-ma-xs">Vencimento:</strong>
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
                  :rules="[isEmpty]"
                />
                <q-btn
                  class="q-ma-xs"
                  style="width: 10px; height: 10px"
                  color="primary"
                  icon="filter_alt"
                  type="submit"
                />
              </div>
            </q-form>
            <q-form @submit="onSubmit" ref="formFilterDate">
              <div class="q-pa-sm row justify-end">
                <strong class="self-center q-ma-xs">Criação:</strong>
                <q-input
                  v-model="searchDateCreate.start"
                  filled
                  type="date"
                  hint="Início"
                  dense
                />
                <q-input
                  v-model="searchDateCreate.end"
                  filled
                  type="date"
                  hint="Fim"
                  dense
                />
                <q-btn
                  class="q-ma-xs"
                  style="width: 10px; height: 10px"
                  color="primary"
                  icon="filter_alt"
                  type="submit"
                />
              </div>
            </q-form>
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
    </q-table>
  </div>
</template>

<script lang="ts" setup>
import { QForm } from "quasar";
import * as smask from "smask";
import { isEmpty } from "~/validation/entity";
const props = defineProps({
  today: { type: Date, required: true },
  tomorrow: { type: Date, required: true },
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
  selectedNegociation: {
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
  pending: Boolean,
});

const userOperato = ref([
  ...toRaw(props.userOperato),
  { id: false, name: "Todos" },
]);

const emit = defineEmits(["request", "selected", "update:status"]);
const formFilterDate = ref<QForm | null>(null);

const scopeNegociation = ref("my");
const selectUser = ref(null);

const searchDate = ref({
  start: ref(props.today.toISOString().split("T")[0]),
  end: ref(props.tomorrow.toISOString().split("T")[0]),
});

const searchDateCreate = ref({
  start: null,
  end: null,
});

const columns = [
  {
    name: "smile",
    label: "Status",
    field: "smile",
    format: (val: any) => val,
  },
  {
    name: "datEntra",
    field: "datEntra",
    label: "Vencimento",
    format: (val: any) => {
      if (val) {
        const data = new Date(val);
        return data.toLocaleString("pt-BR").split(",")[0];
      }
      return "";
    },
  },
  {
    name: "createdAt",
    field: "createdAt",
    label: "Criação",
    format: (val: any) => {
      if (val) {
        const data = new Date(val);
        return data.toLocaleString("pt-BR").split(",")[0];
      }
      return "";
    },
  },
  {
    name: "idNegotiation",
    field: "idNegotiation",
    required: true,
    label: "N. da Negociação",
    align: "left",
    sortable: true,
  },
  {
    name: "valOriginal",
    field: "valOriginal",
    required: true,
    label: "V. Original",
    align: "left",
    sortable: true,
    format: (val: number) => {
      return val.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    name: "valTotalPrest",
    field: "valTotalPrest",
    required: true,
    label: "V. negociação",
    align: "left",
    sortable: true,
    format: (val: number) => {
      return val.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    name: "client",
    field: "client",
    required: true,
    label: "Cliente",
    align: "left",
    sortable: true,
  },
  {
    name: "contato",
    field: "contato",
    required: true,
    label: "Contato",
    align: "left",
    sortable: true,
    format: (val: string) => {
      return smask.mask(val, ["(dd) dddd-dddd", "(dd) ddddd-dddd"]);
    },
  },
  {
    name: "desContr",
    field: "desContr",
    required: true,
    label: "Contrato",
    align: "left",
    sortable: true,
  },

  {
    name: "user",
    field: "user",
    required: true,
    label: "Operador",
    align: "left",
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

const selectedNegociation = ref([]);

const status = ref(false);
const discount = ref(false);

const onRequest = (e: any) => {
  pagination.value.page = e.pagination.page;
  pagination.value.rowsPerPage = e.pagination.rowsPerPage;
  pagination.value.sortBy = e.pagination.sortBy;
  pagination.value.descending = e.pagination.descending;

  onSubmit();
};

const onSubmit = () => {
  formFilterDate.value?.validate().then((success) => {
    if (success) {
      emit("request", {
        pagination: pagination.value,
        searchDate: {
          start: searchDate.value.start,
          end: searchDate.value.end,
        },
        searchDateCreate: {
          start: searchDateCreate.value.start,
          end: searchDateCreate.value.end,
        },
        userId: selectUser.value,
        discount: discount.value,
        status: status.value,
      });
    } else {
      emit("request", {
        pagination: pagination.value,
        userId: selectUser.value,
        discount: discount.value,
        status: status.value,
      });
    }
  });
};

watch(status, () => {
  onSubmit();
});

watch(selectedNegociation, () => {
  emit("selected", { item: toRaw(selectedNegociation.value) });
});

watch(
  () => props.selectedNegociation,
  () => {
    selectedNegociation.value = <Array<never>>props.selectedNegociation;
  },
  { deep: true }
);

watch(
  () => props.meta,
  (meta, prevMeta) => {
    pagination.value.page = meta.currentPage;
    pagination.value.rowsPerPage = meta.perPage;
    pagination.value.rowsNumber = meta.total;
  }
);

watch(selectUser, (e: any) => {
  onSubmit();
});

watch(discount, (e: any) => {
  onSubmit();
});

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

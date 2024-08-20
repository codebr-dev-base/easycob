<template>
  <div class="q-pa-md">
    <q-table
      bordered
      title="Faturas"
      :rows="filterRows"
      :columns="columns"
      row-key="id"
      virtual-scroll
    >
      <template v-slot:top-right>
        <div class="q-pa-md">
          <div class="q-gutter-sm">
            <q-radio
              dense
              v-model="filterStatus"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="ATIVO"
              label="Ativo"
            />
            <q-radio
              dense
              v-model="filterStatus"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="INATIVO"
              label="Inativo"
            />
            <q-radio
              dense
              v-model="filterStatus"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              :val="null"
              label="Todos"
            />
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts" setup>
const selected = ref([]);
const filterStatus = ref("ATIVO");
const props = defineProps({
  rows: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  status: {
    type: String,
    default: "ATIVO",
  },
});

const filterRows = ref([]);

const runFilter = () => {
  filterRows.value = <never[]>props.rows.filter((row) => {
    if (filterStatus.value === null) {
      return true;
    }
    return row.status === filterStatus.value;
  });
};

watch(
  () => props.status,
  (newFilter, oldFilter) => {
    filterStatus.value = newFilter;
  }
);

watch(filterStatus, (newFilter, oldFilter) => {
  runFilter();
});

watch(
  () => props.rows,
  (newFilter, oldFilter) => {
    runFilter();
  }
);

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
];
</script>

<style></style>

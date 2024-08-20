<template>
  <q-table
    style="height: 200px"
    bordered
    dense
    title="Telefones"
    :rows="rows"
    :columns="columns"
    row-key="id"
    virtual-scroll
    hide-bottom
    :rows-per-page-options="[0]"
    selection="single"
    v-model:selected="selected"
  >
    <template v-slot:top-right>
      <q-btn
        padding="xs"
        color="green"
        icon="add_call"
        @click="handlerAddContact"
        size="sm"
      >
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          Adicionar Telefone
        </q-tooltip>
      </q-btn>
    </template>

    <template v-slot:body-cell-cpc="props">
      <q-td :props="props">
        <q-icon v-if="props.row.cpc" name="task_alt" color="green" />
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <div class="q-gutter-sm">
          <q-btn
            padding="xs"
            color="primary"
            icon="edit"
            size="sm"
            @click="handlerEditContact(props.row)"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              Editar
            </q-tooltip>
          </q-btn>
          <q-btn
            type="a"
            :href="`${urlWhats}55${props.row.contato}`"
            target="_blank"
            padding="xs"
            :disable="props.row.block || props.row.blockAll ? true : false"
            v-show="props.row.isWhatsapp"
            color="positive"
            icon="fa-brands fa-whatsapp"
            size="sm"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              Whatsapp
            </q-tooltip>
          </q-btn>

          <q-btn
            padding="xs"
            :disable="props.row.block || props.row.blockAll ? true : false"
            color="warning"
            icon="call"
            size="sm"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              Ligar
            </q-tooltip>
          </q-btn>
        </div>
      </q-td>
    </template>
  </q-table>
  <OperatorContactFormPhone
    v-model:showForm="showForm"
    :contact="contactEdit"
    @update:contact="handlerUpdateContact"
    @create:contact="handlerCreateContact"
    :clientId="clientId"
  />
</template>

<script lang="ts" setup>
import { format } from "quasar";
import * as smask from "smask";
const props = defineProps({
  rows: {
    type: Array,
    default: () => {
      return [];
    },
  },
  clientId: {
    type: [Number, String],
    require: true,
  },
  selected: Array,
  default: () => {
    return [];
  },
});

const urlWhats = "https://wa.me/";

const emit = defineEmits([
  "update:contact",
  "create:contact",
  "update:selected",
]);

const selected = computed({
  get() {
    return props.selected;
  },
  set(value) {
    emit("update:selected", value);
  },
});

const showForm = ref(false);

const columns = [
  {
    name: "contato",
    label: "Número",
    field: (row: any) => {
      return smask.mask(row.contato, ["(dd) dddd-dddd", "(dd) ddddd-dddd"]);
    },
    classes: (row: any) => {
      if (row.blockAll) {
        return " text-strike text-purple-10";
      }
      if (row.block) {
        return " text-strike text-red";
      }
      if (row.isWhatsapp) {
        return "text-green";
      }
      return "";
    },
  },
  {
    name: "countAtender",
    label: "NLA",
    field: "countAtender",
  },
  {
    name: "percentualAtender",
    label: "%",
    field: "percentualAtender",
    format: (val: any) => {
      return `${val} %`;
    },
  },
  {
    name: "cpc",
    label: "CPC",
    field: "cpc",
  },
  {
    name: "actions",
    label: "Ações",
    field: "actions",
  },
];

const contactModel = {
  id: null,
  codCredorDesRegis: props.clientId,
  tipoContato: "TELEFONE",
  contato: "",
  dtImport: "",
  isWhatsapp: false,
  numeroWhats: "",
  block: false,
  blockAll: false,
};

const contactEdit = ref({ ...contactModel });

const handlerEditContact = (row: any) => {
  showForm.value = true;
  contactEdit.value = { ...row };
};

const handlerAddContact = () => {
  showForm.value = true;
  contactEdit.value = { ...contactModel };
};

const handlerUpdateContact = (value: any) => {
  emit("update:contact", value);
};

const handlerCreateContact = (value: any) => {
  emit("create:contact", value);
};
</script>

<style></style>

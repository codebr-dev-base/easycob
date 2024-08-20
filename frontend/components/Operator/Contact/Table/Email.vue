<template>
  <q-table
    style="height: 200px"
    bordered
    dense
    title="E-mail"
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
        icon="mail"
        @click="handlerAddContact"
        size="sm"
      >
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          Adicionar Email
        </q-tooltip>
      </q-btn>
    </template>

    <template v-slot:body-cell-contato="props">
      <q-td :props="props">
        <div class="q-gutter-sm">
          <div v-if="props.row.block || props.row.blockAll">
            <s :class="props.row.block ? 'text-red-10' : 'text-purple-10'">
              {{ props.row.contato }}
            </s>
          </div>

          <div v-if="!props.row.block && !props.row.blockAll">
            {{ props.row.contato }}
          </div>
        </div>
      </q-td>
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
            padding="xs"
            :disable="props.row.block || props.row.blockAll ? true : false"
            color="warning"
            icon="send"
            size="sm"
            @click="handlerSendContact(props.row)"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              Enviar
            </q-tooltip>
          </q-btn>
        </div>
      </q-td>
    </template>
  </q-table>
  <OperatorContactFormEmail
    v-model:showForm="showForm"
    :contact="contactEdit"
    @update:contact="handlerUpdateContact"
    @create:contact="handlerCreateContact"
    :clientId="clientId"
  />
  <OperatorContactFormSendEmail
    v-model:showForm="showFormSend"
    :contact="contactEdit"
    @send:mail="handlerSendMail"
    :clientId="clientId"
  />
</template>

<script lang="ts" setup>
import { Value } from "sass";
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

const emit = defineEmits([
  "update:contact",
  "create:contact",
  "update:selected",
  "send:mail",
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
const showFormSend = ref(false);

const columns = [
  {
    name: "contato",
    label: "E-mail",
    field: "contato",
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
  tipoContato: "EMAIL",
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

const handlerSendContact = (row: any) => {
  showFormSend.value = true;
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

const handlerSendMail = (value: any) => {
  emit("send:mail", value);
};
</script>

<style></style>

<template>
  <q-dialog v-model="showForm">
    <q-card style="width: 60vw; max-width: 80vw; min-height: 55vh">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ action.typeAction.name }} - {{ action.typeAction.abbreviation }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md row items-start justify-end"
          ref="negotiationForm"
        >
          <q-field
            filled
            v-model="negotiation.valEntra"
            label="Valor previsto entrada R$"
            class="q-field--with-bottom"
            dense
            disable
          >
            <template
              v-slot:control="{ id, floatingLabel, modelValue, emitValue }"
            >
              <input
                :id="id"
                class="q-field__input text-right"
                :value="modelValue"
                @change="(e:any) => emitValue(e.target?.value)"
                v-money3="config"
                v-show="floatingLabel"
                disabled
              />
            </template>
          </q-field>

          <q-input
            filled
            v-model="negotiation.datEntra"
            label="Data previsto da entrada"
            :rules="[isEmpty]"
            dense
            type="date"
            disable
          />

          <q-field
            filled
            v-model="negotiation.valEntraPayment"
            label="Valor pago na entrada R$"
            class="q-field--with-bottom"
            dense
          >
            <template
              v-slot:control="{ id, floatingLabel, modelValue, emitValue }"
            >
              <input
                :id="id"
                class="q-field__input text-right"
                :value="modelValue"
                @change="(e:any) => emitValue(e.target?.value)"
                v-money3="config"
                v-show="floatingLabel"
              />
            </template>
          </q-field>

          <q-input
            filled
            v-model="negotiation.datEntraPayment"
            label="Data do pagamento da entrada"
            :rules="[isEmpty]"
            dense
            type="date"
          />

          <q-btn label="Confirmar" type="submit" color="primary" />
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-table
          title="Faturas"
          :rows="props.action?.negotiations[0].invoices"
          :columns="columnsIvoices"
          row-key="name"
          dense
        >
          <template v-slot:body-cell-datPayment="props">
            <q-td :props="props">
              <q-input
                filled
                v-model="props.row.datPayment"
                label="Data do paganento"
                dense
                type="date"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-valPayment="props">
            <q-td :props="props">
              <q-field
                filled
                v-model="props.row.valPayment"
                label="Valor previsto entrada R$"
                dense
              >
                <template
                  v-slot:control="{ id, floatingLabel, modelValue, emitValue }"
                >
                  <input
                    :id="id"
                    class="q-field__input text-right"
                    :value="modelValue"
                    @change="(e:any) => emitValue(e.target?.value)"
                    v-money3="config"
                    v-show="floatingLabel"
                  />
                </template>
              </q-field>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { QForm } from "quasar";
import { isEmpty, isMax, isMin } from "@/validation/entity";
import { ClientT } from "@/types/cliente";
import { ActionT } from "@/types/action";
import { format } from "quasar";
const emit = defineEmits([
  "update:showForm",
  "confirmed:action",
  "update:negotiation",
]);
const negotiationForm = ref<QForm | null>(null);
import {
  Money3Directive,
  format as formatMoney,
  unformat as unformatMoney,
} from "v-money3";

const vMoney3 = Money3Directive;

const props = defineProps({
  showForm: Boolean,
  client: {
    type: Object,
    require: true,
  },
  action: {
    type: Object,
    require: true,
  },
});

const action = ref({
  typeAction: {
    name: "",
    abbreviation: "",
  },
});

const negotiation = ref({
  id: null,
  valEntra: "",
  datEntra: null,
  valEntraPayment: "",
  datEntraPayment: null,
});

const config = {
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  decimal: ",",
  precision: 2,
  disableNegative: false,
  disabled: false,
  min: null,
  max: null,
  allowBlank: false,
  minimumNumberOfCharacters: 0,
  shouldRound: true,
  focusOnRight: false,
};

const columnsIvoices = [
  {
    name: "datPrest",
    label: "Data Prevista",
    field: "datPrest",
    sortable: true,
  },
  {
    name: "valPrest",
    label: "Valor Previsto",
    field: (row: any) => {
      if (row.valPrest) {
        const val = parseFloat(row.valPrest);
        return val.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        return "";
      }
    },
    sortable: true,
  },
  {
    name: "datPayment",
    label: "Data do Pagamento",
    field: "datPayment",
    sortable: true,
  },
  {
    name: "valPayment",
    label: "Valor do Pagamento",
    field: "valPayment",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: (row: any) => {
      row.status ? "Pago" : "";
    },
  },
];

action.value.typeAction.abbreviation = props.action?.typeAction?.abbreviation;
action.value.typeAction.name = props.action?.typeAction?.name;

negotiation.value.id = props.action?.negotiations[0].id;
negotiation.value.datEntra = props.action?.negotiations[0].datEntra;
negotiation.value.valEntra = formatMoney(
  props.action?.negotiations[0].valEntra
);
negotiation.value.datEntraPayment =
  props.action?.negotiations[0].datEntraPayment;
negotiation.value.valEntraPayment = formatMoney(
  props.action?.negotiations[0].valEntraPayment
);

const showForm = computed({
  get() {
    return props.showForm;
  },
  set(value) {
    emit("update:showForm", value);
  },
});

watch(
  () => props.action,
  (newValue, oldValue) => {
    action.value.typeAction.abbreviation = newValue?.typeAction?.abbreviation;
    action.value.typeAction.name = newValue?.typeAction?.name;

    negotiation.value.id = newValue?.negotiations[0].id;
    negotiation.value.datEntra = newValue?.negotiations[0].datEntra;
    negotiation.value.valEntra = formatMoney(
      newValue?.negotiations[0].valEntra
    );
    negotiation.value.datEntraPayment =
      newValue?.negotiations[0].datEntraPayment;
    negotiation.value.valEntraPayment = formatMoney(
      newValue?.negotiations[0].valEntraPayment
    );
  },
  { deep: true }
);

const onSubmit = () => {
  negotiationForm.value?.validate().then((success) => {
    if (success) {
      const updateNegotiation = {
        id: negotiation.value.id,
        datEntraPayment: negotiation.value.datEntraPayment,
        valEntraPayment: unformatMoney(negotiation.value.valEntraPayment),
      };

      emit("update:negotiation", updateNegotiation);
    } else {
      // oh no, user has filled in
      // at least one invalid value
    }
  });
};
</script>

<style></style>

<template>
  <div v-show="invoice.id" class="q-pa-md" style="max-width: 600px">
    <div class="q-timeline__subtitle">
      <span
        >Cliente: {{ invoice.client }},
        <span class="text-weight-light text-dark text-overline">
          Contrato: {{ invoice.desContr }}</span
        >
      </span>
    </div>
    <q-form @submit="onSubmit" class="q-gutter-md" ref="invoiceForm">
      <div class="q-col-gutter-lg row justify-around">
        <q-input
          v-model="invoice.datPrest"
          filled
          type="date"
          hint="Data prevista do pagamento"
          dense
          disable
        />
        <q-input
          v-model="invoice.datPayment"
          filled
          type="date"
          hint="Data do pagamento"
          dense
        />
      </div>

      <div class="q-col-gutter-lg row justify-around q-mt-xs">
        <q-field
          filled
          v-model="invoice.valPrest"
          hint="Valor prevista do pagamento"
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
              @change="(e) => changeInput(e, emitValue)"
              v-money3="config"
              v-show="floatingLabel"
              disabled
            />
          </template>
        </q-field>
        <q-field
          filled
          v-model="invoice.valPayment"
          hint="Valor R$"
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
              @change="(e) => changeInput(e, emitValue)"
              v-money3="config"
              v-show="floatingLabel"
              disabled
            />
          </template>
        </q-field>
      </div>

      <div class="q-col-gutter-lg row justify-around q-mt-xs">
        <q-select
          filled
          v-model="invoice.followingStatus"
          :options="options"
          hint="Status"
          emit-value
          map-options
          dense
          options-dense
          class="col-5"
        />

        <q-input
          v-if="invoice.followingStatus === 'breach'"
          v-model="invoice.datBreach"
          filled
          type="date"
          hint="Data da quebra"
          dense
          class="col-5"
        />
      </div>

      <q-input v-model="comments" filled type="textarea" :rules="[isEmpty]" />

      <div>
        <q-btn label="Registar Contato" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
  <div v-show="invoice.id" class="q-px-lg q-py-xs">
    <q-timeline color="secondary">
      <q-timeline-entry title="Histórico" />

      <q-timeline-entry v-for="item in invoiceHistories" :key="item.id">
        <template v-slot:subtitle>
          {{ formatDateAction(item.createdAt) }},
          <span class="text-weight-light text-dark text-overline"
            >por: {{ item.user }}</span
          >
        </template>
        <div>
          {{ item.comments }}
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>
<script lang="ts">
import {
  Money3Directive,
  format as formatMoney,
  unformat as unformatMoney,
} from "v-money3";
</script>
<script lang="ts" setup>
import { QForm } from "quasar";
import { isEmpty } from "~/validation/entity";
import { changeDatetimeToDate, formatDateAction } from "~/utils";
import { ContactingT } from "~/types/contact";
const $q = useQuasar();
const vMoney3 = Money3Directive;
const invoiceForm = ref<QForm | null>(null);

const emit = defineEmits(["update:invoice"]);

const props = defineProps({
  invoice: {
    type: Object as PropType<any>,
    default: {
      client: null,
      contato: null,
      createdAt: null,
      datPayment: null,
      datPrest: null,
      desContr: null,
      id: null,
      idNegotiation: null,
      negotiationOfPaymentId: null,
      status: null,
      updatedAt: null,
      user: null,
      userId: null,
      valPayment: null,
      valPrest: null,
      followingStatus: null,
      datBreach: null,
    },
  },
  invoiceHistories: {
    type: Array<ContactingT>,
    default: () => {
      return Array<ContactingT>;
    },
  },
});

const defaulInvoice = {
  client: null,
  contato: null,
  createdAt: null,
  datPayment: null,
  datPrest: null,
  desContr: null,
  id: null,
  idNegotiation: null,
  negotiationOfPaymentId: null,
  status: null,
  updatedAt: null,
  user: null,
  userId: null,
  valPayment: null,
  valPrest: null,
  followingStatus: null,
  datBreach: null,
};

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
  shouldRound: false,
  focusOnRight: false,
};

const invoice = ref({ ...defaulInvoice });
const comments = ref();

invoice.value = { ...defaulInvoice };

watch(
  () => props.invoice,
  () => {
    if (props.invoice) {
      const n = { ...props.invoice };
      if (n.datPrest) {
        n.datPrest = changeDatetimeToDate(n.datPrest);
        if (n.datPayment) {
          n.datPayment = changeDatetimeToDate(n.datPayment);
        }
      }

      if (n.valPrest) {
        n.valPrest = n.valPrest.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        n.valPayment = n.valPrest.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }

      invoice.value = n;
    }
  },
  { deep: true }
);

const onSubmit = () => {
  console.log(validateVal());

  invoiceForm.value?.validate().then((success) => {
    if (success && invoice.value.id) {
      let valPayment = unformatMoney(
        invoice.value.valPayment ? invoice.value.valPayment : "0"
      );

      valPayment = Number(valPayment);

      let updateInvoice: any = {
        id: invoice.value.id,
        datPayment: invoice.value.datPayment,
        valPayment: valPayment > 0 ? valPayment : null,
        comments: comments.value,
        followingStatus: invoice.value.followingStatus,
        datBreach: invoice.value.datBreach,
      };

      emit("update:invoice", updateInvoice);
    }
  });
  /* 
    if (validateVal()) {
  } else {
    $q.notify({
      message: "Os campos data e valor deve ser preenchido",
      type: "warning",
    });
    }
   */
};

const changeInput = (e: any, func: any) => {
  const target = e.target as HTMLTextAreaElement;
  return func(target?.value);
};

const validateVal = () => {
  let valPayment = unformatMoney(
    invoice.value.valPayment ? invoice.value.valPayment : "0"
  );
  valPayment = Number(valPayment);

  const value = valPayment > 0 ? valPayment : null;
  const date = invoice.value.datPayment;

  if ((!value && !date) || (value && date)) {
    return true;
  }
  return false;
};

const options = [
  {
    label: "Pago",
    value: "paid",
  },
  {
    label: "Não Pago",
    value: null,
  },
  {
    label: "Quebra",
    value: "breach",
  },
];
</script>

<style></style>

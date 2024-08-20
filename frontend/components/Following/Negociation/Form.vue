<template>
  <div v-show="negociation.id" class="q-pa-md" style="max-width: 600px">
    <div class="q-timeline__subtitle">
      <span
        >Cliente: {{ negociation.client }},
        <span class="text-weight-light text-dark text-overline">
          Contrato: {{ negociation.desContr }}</span
        >
      </span>
    </div>

    <q-form @submit="onSubmit" class="q-gutter-md" ref="negociationForm">
      <div class="q-col-gutter-lg row justify-around">
        <q-input
          v-model="negociation.datEntra"
          filled
          type="date"
          hint="Data prevista do pagamento da entrada"
          dense
          disable
          class="col-5"
        />
        <q-input
          v-model="negociation.datEntraPayment"
          filled
          type="date"
          hint="Data do pagamento da entrada"
          dense
          class="col-5"
        />
      </div>

      <div class="q-col-gutter-lg row justify-around q-mt-xs">
        <q-field
          filled
          v-model="negociation.valEntra"
          hint="Valor prevista do pagamento da entrada"
          class="q-field--with-bottom col-5"
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
          v-model="negociation.valEntraPayment"
          hint="Valor da entrada R$"
          class="q-field--with-bottom col-5"
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
          v-model="negociation.followingStatus"
          :options="options"
          hint="Status"
          emit-value
          map-options
          dense
          options-dense
          class="col-5"
        />

        <q-input
          v-if="negociation.followingStatus === 'breach'"
          v-model="negociation.datBreach"
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
  <div v-show="negociation.id" class="q-px-lg q-py-xs">
    <q-timeline color="secondary">
      <q-timeline-entry title="Histórico" />

      <q-timeline-entry v-for="item in negociationHistories" :key="item.id">
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
const negociationForm = ref<QForm | null>(null);

const emit = defineEmits(["update:negociation"]);

const props = defineProps({
  negociation: {
    type: Object as PropType<any>,
    default: {
      id: null,
      idNegotiation: null,
      valOriginal: null,
      valTotalPrest: null,
      valEntra: null,
      numVezes: null,
      valPrest: null,
      datEntra: null,
      datPrest: null,
      datEntraPayment: null,
      valEntraPayment: null,
      status: null,
      actionId: null,
      createdAt: "null",
      updatedAt: "null",
      datPayment: null,
      valPayment: null,
      userId: null,
      user: null,
      client: null,
      contato: null,
      desContr: null,
      followingStatus: null,
      datBreach: null,
    },
  },
  negociationHistories: {
    type: Array<ContactingT>,
    default: () => {
      return Array<ContactingT>;
    },
  },
});

const defaulNegociation = {
  id: null,
  idNegotiation: null,
  valOriginal: null,
  valTotalPrest: null,
  valEntra: null,
  numVezes: null,
  valPrest: null,
  datEntra: null,
  datPrest: null,
  datEntraPayment: null,
  valEntraPayment: null,
  status: null,
  actionId: null,
  createdAt: "null",
  updatedAt: "null",
  datPayment: null,
  valPayment: null,
  userId: null,
  user: null,
  client: null,
  contato: null,
  desContr: null,
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

const negociation = ref({ ...defaulNegociation });
const comments = ref();

negociation.value = { ...defaulNegociation };

watch(
  () => props.negociation,
  () => {
    if (props.negociation) {
      const n = { ...props.negociation };
      if (n.datEntra) {
        n.datEntra = changeDatetimeToDate(n.datEntra);
        if (n.datEntraPayment) {
          n.datEntraPayment = changeDatetimeToDate(n.datEntraPayment);
        }
      }

      if (n.valEntra) {
        n.valEntra = n.valEntra.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        n.valEntraPayment = n.valEntra.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }

      negociation.value = n;
    }
  },
  { deep: true }
);

const onSubmit = () => {
  negociationForm.value?.validate().then((success) => {
    if (success && negociation.value.id) {
      let valEntraPayment = unformatMoney(
        negociation.value.valEntraPayment
          ? negociation.value.valEntraPayment
          : "0"
      );

      valEntraPayment = Number(valEntraPayment);

      let updateNegociation: any = {
        id: negociation.value.id,
        datEntraPayment: negociation.value.datEntraPayment,
        valEntraPayment: valEntraPayment > 0 ? valEntraPayment : null,
        comments: comments.value,
        followingStatus: negociation.value.followingStatus,
        datBreach: negociation.value.datBreach,
      };

      emit("update:negociation", updateNegociation);
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
  let valEntraPayment = unformatMoney(
    negociation.value.valEntraPayment ? negociation.value.valEntraPayment : "0"
  );
  valEntraPayment = Number(valEntraPayment);

  const value = valEntraPayment > 0 ? valEntraPayment : null;
  const date = negociation.value.datEntraPayment;

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

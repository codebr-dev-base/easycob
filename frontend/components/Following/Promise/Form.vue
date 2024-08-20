<template>
  <div v-show="promise.id" class="q-pa-md" style="max-width: 600px">
    <div class="q-timeline__subtitle">
      <span
        >Cliente: {{ promise.client }},
        <span class="text-weight-light text-dark text-overline">
          Contrato: {{ promise.desContr }}</span
        >
      </span>
    </div>

    <q-form @submit="onSubmit" class="q-gutter-md" ref="promiseForm">
      <div class="q-col-gutter-lg row justify-around q-mt-xs">
        <q-input
          v-model="promise.datPrev"
          filled
          type="date"
          hint="Data prevista do pagamento"
          dense
          disable
        />
        <q-input
          v-model="promise.datPayment"
          filled
          type="date"
          hint="Data do pagamento"
          dense
        />
      </div>

      <div class="q-col-gutter-lg row justify-around q-mt-xs">
        <q-field
          filled
          v-model="promise.valPrest"
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
          v-model="promise.valPayment"
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
          v-model="promise.followingStatus"
          :options="options"
          hint="Status"
          emit-value
          map-options
          dense
          options-dense
          class="col-5"
        />

        <q-input
          v-if="promise.followingStatus === 'breach'"
          v-model="promise.datBreach"
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
  <div v-show="promise.id" class="q-px-lg q-py-xs">
    <q-timeline color="secondary">
      <q-timeline-entry title="Histórico" />

      <q-timeline-entry v-for="item in promiseHistories" :key="item.id">
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
const promiseForm = ref<QForm | null>(null);

const emit = defineEmits(["update:promise"]);

const props = defineProps({
  promise: {
    type: Object as PropType<any>,
    default: {
      id: null,
      datPrev: null,
      valPrest: null,
      datPayment: null,
      valPayment: null,
      status: null,
      actionId: null,
      createdAt: null,
      updatedAt: null,
      followingStatus: null,
      datBreach: null,
    },
  },
  promiseHistories: {
    type: Array<ContactingT>,
    default: () => {
      return Array<ContactingT>;
    },
  },
});

const defaulPromise = {
  id: null,
  datPrev: null,
  valPrest: null,
  datPayment: null,
  valPayment: null,
  status: null,
  actionId: null,
  createdAt: null,
  updatedAt: null,
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

const promise = ref({ ...defaulPromise });
const comments = ref();

promise.value = { ...defaulPromise };

watch(
  () => props.promise,
  () => {
    if (props.promise) {
      const n = { ...props.promise };
      if (n.datPrev) {
        n.datPrev = changeDatetimeToDate(n.datPrev);
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

      promise.value = n;
    }
  },
  { deep: true }
);

const onSubmit = () => {
  console.log(validateVal());

  promiseForm.value?.validate().then((success) => {
    if (success && promise.value.id) {
      let valPayment = unformatMoney(
        promise.value.valPayment ? promise.value.valPayment : "0"
      );

      valPayment = Number(valPayment);

      let updatePromise: any = {
        id: promise.value.id,
        datPayment: promise.value.datPayment,
        valPayment: valPayment > 0 ? valPayment : null,
        comments: comments.value,
        followingStatus: promise.value.followingStatus,
        datBreach: promise.value.datBreach,
      };

      emit("update:promise", updatePromise);
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
    promise.value.valPayment ? promise.value.valPayment : "0"
  );
  valPayment = Number(valPayment);

  const value = valPayment > 0 ? valPayment : null;
  const date = promise.value.datPayment;

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

<template>
  <q-dialog v-model="showForm">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Cliente: {{ client?.value?.nomClien }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator inset />

      <q-card-section>
        <p>Acionamento: {{ action?.abbreviation }} - {{ action?.name }}</p>
        <p>
          {{ contacts[0].tipoContato }}:
          {{ contacts[0].contato }}
        </p>
        <q-form
          @submit.prevent="onSubmit"
          class="q-gutter-md"
          ref="promiseForm"
        >
          <div class="row">
            <div class="col-6 q-pa-xs">
              <strong>Contratos:</strong>
              <q-list bordered padding class="rounded-borders q-mb-xs">
                <q-item
                  v-for="contract in contracts"
                  :key="contract.id"
                  v-ripple
                >
                  <q-item-section avatar top>
                    <q-avatar
                      icon="fa-solid fa-file-signature"
                      color="primary"
                      text-color="white"
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">{{
                      contract.desContr
                    }}</q-item-label>
                    <q-item-label caption>{{
                      parseFloat(contract.valPrinc).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon name="info" color="green" />
                  </q-item-section>
                </q-item>
              </q-list>
              <q-select
                filled
                label="Canal"
                v-model="channel"
                :options="channelOptions"
                :rules="[isEmpty]"
                dense
              />
              <q-input
                class="q-ma-xs"
                v-model="description"
                label="Observação"
                filled
                type="textarea"
              />

              <q-checkbox
                left-label
                label="Negociação com desconto?"
                v-model="negotiation.discount"
              />
              <q-field
                filled
                v-model="negotiation.valDiscount"
                label="Valor do desconto R$"
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
                    @change="
                      (e) => {
                        emitValue(e.target?.value);
                      }
                    "
                    v-money3="config"
                    v-show="floatingLabel"
                    :disabled="!negotiation.discount"
                  />
                </template>
              </q-field>
              <q-input
                filled
                v-model="negotiation.percDiscount"
                label="Percentual Desconto"
                mask="##%"
                dense
                input-class="text-right"
                :disable="!negotiation.discount"
              />
            </div>

            <div class="col-6 q-pa-xs">
              <q-input
                filled
                v-model="negotiation.idNegotiation"
                label="Id gerado pelo sistema de negociação"
                :rules="[isEmpty]"
                dense
              />

              <q-field
                filled
                v-model="negotiation.valOriginal"
                label="Valor original do débito R$"
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
                    @change="
                      (e) => {
                        emitValue(e.target?.value);
                      }
                    "
                    v-money3="config"
                    v-show="floatingLabel"
                    disabled
                  />
                </template>
              </q-field>

              <q-field
                filled
                v-model="negotiation.valTotalPrest"
                label="Valor do débito depois da negociação R$"
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
                    @change="
                      (e) => {
                        emitValue(e.target?.value);
                      }
                    "
                    v-money3="config"
                    v-show="floatingLabel"
                  />
                </template>
              </q-field>

              <q-field
                filled
                v-model="negotiation.valEntra"
                label="Valor da entrada R$"
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
                    @change="
                      (e) => {
                        emitValue(e.target?.value);
                      }
                    "
                    v-money3="config"
                    v-show="floatingLabel"
                  />
                </template>
              </q-field>

              <q-input
                filled
                v-model="negotiation.numVezes"
                label="Número de parcelas"
                :rules="[isEmpty]"
                dense
                input-class="text-right"
                type="number"
                min="1"
              />
              <q-input
                filled
                v-model="negotiation.datEntra"
                label="Data da entrada"
                :rules="[isEmpty]"
                dense
                type="date"
              />

              <q-field
                filled
                v-model="negotiation.valPrest"
                label="Valor da parcela R$"
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
                    @change="
                      (e) => {
                        emitValue(e.target?.value);
                      }
                    "
                    v-money3="config"
                    v-show="floatingLabel"
                  />
                </template>
              </q-field>

              <q-input
                filled
                v-model="negotiation.datPrest"
                label="Data data da primeira parcela"
                :rules="[isEmpty]"
                dense
                type="date"
              />
            </div>
          </div>

          <div class="row justify-end q-my-sm">
            <q-btn
              :disable="disableButton"
              label="Salvar"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
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
import { isEmpty, isMax, isMin } from "@/validation/entity";
import { ClientT } from "@/types/cliente";
import { format } from "quasar";
const emit = defineEmits(["update:showForm", "confirmed:action"]);
const promiseForm = ref<QForm | null>(null);
const disableButton = ref(true);

const vMoney3 = Money3Directive;

const props = defineProps({
  showForm: Boolean,
  action: {
    type: Object,
    require: true,
  },
  client: {
    type: Object,
    require: true,
  },
  contracts: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  contacts: {
    type: Array<any>,
    default() {
      return [];
    },
  },
});

const showForm = computed({
  get() {
    return props.showForm;
  },
  set(value) {
    emit("update:showForm", value);
  },
});

watch(showForm, () => {
  disableButton.value = !showForm.value;
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

const channel = ref<{ label: string; value: string } | null>(null);

const channelOptions = [
  {
    label: "Whatsapp",
    value: "whatsapp",
  },
  {
    label: "Ativo",
    value: "active",
  },
  {
    label: "Discador",
    value: "dialer",
  },
];

const negotiation = ref({
  idNegotiation: "",
  valOriginal: "",
  valTotalPrest: "",
  valEntra: "",
  numVezes: "1",
  valPrest: "",
  datEntra: null,
  datPrest: null,
  discount: false,
  valDiscount: "0",
  percDiscount: "0",
});

const parseCurrencyFloat = (value: string) => {
  const v = parseFloat(value.replace(",", "."));
  return v;
};

const description = ref("");

watch(
  () => props.contracts,
  (newValue, oldValue) => {
    let total: number = 0;
    newValue.forEach((item) => {
      total += parseFloat(item.valPrinc);
    });
    negotiation.value.valOriginal = formatMoney(total);
  },
  { deep: true }
);

watch(
  () => negotiation.value.valTotalPrest,
  (newValue, oldValue) => {
    calcPrest();
  },
  { deep: true }
);

watch(
  () => negotiation.value.valEntra,
  (newValue, oldValue) => {
    calcPrest();
  },
  { deep: true }
);

watch(
  () => negotiation.value.numVezes,
  (newValue, oldValue) => {
    calcPrest();
  },
  { deep: true }
);

const onSubmit = (e: Event) => {
  e.preventDefault();
  disableButton.value = true;
  promiseForm.value?.validate().then((success) => {
    if (success) {
      const valOriginal = unformatMoney(negotiation.value.valOriginal);
      const valTotalPrest = unformatMoney(negotiation.value.valTotalPrest);
      const valEntra = unformatMoney(negotiation.value.valEntra);
      const valPrest = unformatMoney(negotiation.value.valPrest);
      const valDiscount = unformatMoney(negotiation.value.valDiscount);
      let percDiscount = negotiation.value.percDiscount.replace("%", "");
      if (!percDiscount) {
        percDiscount = "0";
      }

      const actions: any[] = [];

      for (const contract of Array.from(new Set(props.contracts))) {
        actions.push({
          codCredorDesRegis: props.client?.value?.codCredorDesRegis,
          desRegis: props.client?.value?.desRegis,
          codCredor: props.client?.value?.codCredor,
          tipoContato: props.contacts[0].tipoContato,
          contato: props.contacts[0].contato,
          typeActionId: props.action?.id,
          matriculaContrato: contract.matriculaContrato,
          description: description.value,
          desContr: contract.desContr,
          valPrinc: contract.valPrinc,
          datVenci: contract.datVenci,
          channel: channel.value?.value,
          negotiation: {
            idNegotiation: negotiation.value.idNegotiation,
            valOriginal,
            valTotalPrest,
            valEntra,
            valPrest,
            numVezes: parseInt(negotiation.value.numVezes),
            datEntra: negotiation.value.datEntra,
            datPrest: negotiation.value.datPrest,
            discount: negotiation.value.discount,
            valDiscount,
            percDiscount,
          },
        });
      }

      emit("confirmed:action", actions);
    } else {
      // oh no, user has filled in
      // at least one invalid value
    }
  });
};

const calcPrest = () => {
  const valTotalPrest = <number>unformatMoney(negotiation.value.valTotalPrest);
  const valEntra = <number>unformatMoney(negotiation.value.valEntra);
  if (negotiation.value.numVezes.length > 0) {
    const numVezes = parseInt(negotiation.value.numVezes);

    if (valTotalPrest > 0 && valEntra > 0 && !isNaN(numVezes)) {
      let subTotal = valTotalPrest - valEntra;
      negotiation.value.valPrest = formatMoney(subTotal / numVezes);
    }
  }
};
</script>

<style></style>

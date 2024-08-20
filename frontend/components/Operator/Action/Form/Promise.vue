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

              <q-checkbox
                left-label
                label="Negociação com desconto?"
                v-model="promise.discount"
              />
              <q-field
                filled
                v-model="promise.valDiscount"
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
                    :disabled="!promise.discount"
                  />
                </template>
              </q-field>
              <q-input
                filled
                v-model="promise.percDiscount"
                label="Percentual Desconto"
                mask="##%"
                dense
                input-class="text-right"
                :disable="!promise.discount"
              />
            </div>
            <div class="col-6">
              <q-input
                filled
                v-model="promise.datPrev"
                label="Data do pagamento"
                :rules="[isEmpty]"
                dense
                type="date"
              />

              <q-field
                filled
                v-model="promise.valOriginal"
                label="Valor original R$"
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
                v-model="promise.valPrest"
                label="Valor Negociado R$"
                :rules="[isEmpty, isEmptyCurrencies]"
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
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input
                v-model="description"
                label="Observação"
                filled
                type="textarea"
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
import { isEmpty, isEmptyCurrencies, isMax, isMin } from "@/validation/entity";
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

const promise = ref({
  datPrev: null,
  valOriginal: "",
  valPrest: "",
  discount: false,
  valDiscount: "0",
  percDiscount: "0",
});

const description = ref("");

watch(
  () => props.contracts,
  (newValue, oldValue) => {
    let total: number = 0;
    newValue.forEach((item) => {
      total += parseFloat(item.valPrinc);
    });
    promise.value.valOriginal = formatMoney(total);
  },
  { deep: true }
);

const parseCurrencyFloat = (value: string) => {
  const v = parseFloat(value.replace(",", "."));
  return v;
};

const onSubmit = (e: Event) => {
  e.preventDefault();
  disableButton.value = true;
  promiseForm.value?.validate().then((success) => {
    if (success) {
      const valOriginal = unformatMoney(promise.value.valOriginal, config);
      const valPrest = unformatMoney(promise.value.valPrest, config);
      const valDiscount = unformatMoney(promise.value.valDiscount);
      let percDiscount = promise.value.percDiscount.replace("%", "");
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
          promise: {
            datPrev: promise.value.datPrev,
            valOriginal,
            valPrest,
            discount: promise.value.discount,
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
</script>

<style></style>

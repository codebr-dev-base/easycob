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
        <div class="row">
          <div class="col">
            <strong>Contratos:</strong>
            <q-list bordered padding class="rounded-borders">
              <q-item v-for="contract in contracts" :key="contract.id" v-ripple>
                <q-item-section avatar top>
                  <q-avatar
                    icon="fa-solid fa-file-signature"
                    color="primary"
                    text-color="white"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{ contract.desContr }}</q-item-label>
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
            color="primary"
            @click="handlerCreateAction"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ClientT } from "@/types/cliente";
const emit = defineEmits(["update:showForm", "confirmed:action"]);
const disableButton = ref(true);

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

const description = ref("");

const handlerCreateAction = (e: Event) => {
  e.preventDefault();
  disableButton.value = true;
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
    });
  }

  emit("confirmed:action", actions);
};
</script>

<style></style>

<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="row justify-between q-gutter-sm q-my-xs">
        <div class="text-subtitle1">Cliente: {{ clientModel.desRegis }}</div>
        <q-btn
          padding="xs"
          color="primary"
          icon="edit"
          size="sm"
          @click="handlerEditClient"
        >
          <q-tooltip transition-show="flip-right" transition-hide="flip-left">
            Editar
          </q-tooltip>
        </q-btn>
      </div>
    </q-card-section>
    <q-separator inset />
    <q-card-section>
      <div class="text-h6 q-mt-sm q-mb-xs">{{ clientModel.nomClien }}</div>
      <div class="text-caption text-grey">
        CPF:
        {{
          smask.mask(clientModel.desCpf, [
            "ddd.ddd.ddd-dd",
            "dd.ddd.ddd/dddd-dd",
          ])
        }}
      </div>
      <div class="text-caption text-grey">
        Endereço: {{ clientModel.desEnderResid }},
        {{ clientModel.desNumerResid }}
      </div>
      <div class="text-caption text-grey">
        {{ clientModel.desComplResid }}
      </div>
      <div class="text-caption text-grey">
        Bairro: {{ clientModel.desBairrResid }}
      </div>
      <div class="text-caption text-grey">
        Cidade: {{ clientModel.desCidadResid }} -
        {{ clientModel.desEstadResid }}
      </div>
      <q-list bordered separator dense v-if="actions.length > 0">
        <q-item>
          <q-item-section avatar>
            <q-avatar
              :color="setColor(actions[0].typeAction)"
              size="sm"
              text-color="white"
              :icon="setIcon(actions[0].typeAction)"
            />
          </q-item-section>
          <q-item-section class="text-bold">
            <span>Último Acionamento:</span>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>
              <q-btn
                color="blue-grey-6"
                padding="xs"
                icon="history"
                size="sm"
                @click="handlerShowHistory"
              >
                <q-tooltip
                  transition-show="flip-right"
                  transition-hide="flip-left"
                >
                  Registro de Acionamento
                </q-tooltip>
              </q-btn>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section class="text-bold text-center">
            {{ actions[0].typeAction?.abbreviation }} -
            {{ actions[0].typeAction?.name }}
          </q-item-section>
        </q-item>
      </q-list>

      <div class="row justify-end q-gutter-sm q-my-xs">
        <q-select
          class="col"
          v-model="selectAction"
          :options="typeAction"
          :option-label="
            (opt) =>
              Object(opt) === opt && 'name' in opt ? opt.name : '- Null -'
          "
          label="Acionamento"
          filled
          dense
          options-dense
        >
        </q-select>
      </div>
      <div class="row justify-end q-gutter-sm q-my-xs">
        <q-btn
          :disable="clientModel.status === 'INATIVO' ? true : false"
          padding="xs"
          color="red"
          icon="save"
          size="sm"
          style="width: 100%"
          @click="handlerCreateAction"
        >
          <q-tooltip transition-show="flip-right" transition-hide="flip-left">
            Registrar Acionamento
          </q-tooltip>
          Salvar Acionamento
        </q-btn>
      </div>
    </q-card-section>
    <OperatorClientForm
      v-model:show-form="showForm"
      :client="clientModel"
      @update:client="handlerUpdateClient"
    />
  </q-card>
</template>

<script lang="ts">
import * as smask from "smask";
import { ActionT } from "~/types/action";
</script>

<script lang="ts" setup>
import { QForm } from "quasar";
import { ClientT } from "@/types/cliente";
import { Value } from "sass";
const emit = defineEmits(["update:client", "create:action", "show:history"]);

const props = defineProps({
  client: {
    type: Object,
    require: true,
  },
  typeAction: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  actions: {
    type: Array<ActionT>,
    default() {
      return [];
    },
  },
});

const clientModel = ref<ClientT>(props.client?.value);
const showForm = ref(false);
const selectAction = ref(null);

const handlerEditClient = () => {
  showForm.value = true;
};

const handlerUpdateClient = (value: ClientT) => {
  showForm.value = false;
  clientModel.value = value;
  emit("update:client", value);
};

const handlerShowHistory = () => {
  emit("show:history", true);
};

const handlerCreateAction = () => {
  emit("create:action", selectAction);
};
</script>

<style></style>

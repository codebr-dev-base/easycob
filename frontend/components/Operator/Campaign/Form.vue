<template>
  <q-dialog v-model="showForm">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Criar Campanha</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator inset />

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md" ref="campaignForm">
          <div class="row">
            <div class="col-12 col-md-6 q-px-xs">
              <q-input
                filled
                name="date"
                v-model="campaignModel.date"
                label="Data da campanha"
                :rules="[isEmpty]"
                dense
                type="date"
              />
            </div>
            <div class="col-12 col-md-6 q-px-xs">
              <q-file
                filled
                name="file"
                v-model="campaignModel.file"
                label="CSV campanha"
                :rules="[isEmpty]"
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-6 q-px-xs">
              <q-input
                filled
                name="name"
                v-model="campaignModel.name"
                label="Nome da campanha"
                :rules="[isEmpty]"
                dense
              />
            </div>
            <div class="col-12 col-md-6 q-px-xs">
              <q-input
                filled
                name="numWhatsapp"
                v-model="campaignModel.numWhatsapp"
                label="Telefone WhatApp"
                :rules="[isEmpty]"
                dense
                mask="(##) #####-####"
                fill-mask
                unmasked-value
              />
            </div>
          </div>

          <div v-if="type != 'EMAIL'" class="row">
            <div class="col-12 col-md-4 q-px-xs">
              <q-btn
                padding="xs"
                color="red"
                size="sm"
                style="width: 100%"
                @click="handlerShowFormTemplate"
              >
                <q-tooltip
                  transition-show="flip-right"
                  transition-hide="flip-left"
                >
                  Criar template
                </q-tooltip>
                Criar template
              </q-btn>
              <q-scroll-area style="height: 120px">
                <q-list dense bordered padding class="rounded-borders">
                  <q-item
                    v-for="templete in templates"
                    :key="templete.id"
                    clickable
                    v-ripple
                    @click="handlerSelectTemplate(templete.template)"
                  >
                    <q-item-section> {{ templete.name }} </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </div>
            <div class="col-12 col-md-8 q-px-xs">
              <q-input
                filled
                name="message"
                v-model="campaignModel.message"
                label="Mensagem da campanha"
                type="textarea"
              />
            </div>
          </div>
          <!---
              <div v-else class="row">
            <div class="col-12 q-px-xs">
              <q-select
                outlined
                v-model="campaignModel.templateExternalId"
                :options="templates"
                option-value="Name"
                option-label="Name"
                :rules="[isEmpty]"
                emit-value
                map-options
              >
              </q-select>
            </div>
          </div>
          -->

          <div class="row justify-end q-my-sm">
            <q-checkbox
              v-model="campaignModel.singleSend"
              label="Um sms por contato!"
            />
            <q-btn
              label="Salvar"
              type="submit"
              color="primary"
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { QForm } from "quasar";
import { isEmpty, isMax, isMin } from "@/validation/entity";
import { format } from "quasar";
import { dataToEsm } from "@rollup/pluginutils";
const emit = defineEmits([
  "update:showForm",
  "create:campaign",
  "show:form-template",
]);
const campaignForm = ref<QForm | null>(null);

const props = defineProps({
  showForm: Boolean,
  templates: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  type: {
    type: String,
    required: true,
  },
});

const campaign = {
  name: "",
  numWhatsapp: "",
  date: "",
  message: "",
  file: undefined,
  singleSend: true,
  subject: undefined,
  email: undefined,
  templateExternalId: undefined,
};

const campaignModel = ref({ ...campaign });

const showForm = computed({
  get() {
    return props.showForm;
  },
  set(value) {
    emit("update:showForm", value);
  },
});

watch(
  () => props.showForm,
  (newValue, oldValue) => {
    campaignModel.value = { ...campaign };
  },
  { deep: true }
);

const description = ref("");

const handlerShowFormTemplate = () => {
  if (props.type === "EMAIL") {
    return navigateTo("/operator/campaign/email/template/null");
  } else {
    emit("show:form-template");
  }
};

const onSubmit = (event: any) => {
  campaignForm.value?.validate().then((success) => {
    if (success) {
      const formData = new FormData();
      formData.append("name", campaignModel.value.name);
      formData.append("date", campaignModel.value.date);
      formData.append("numWhatsapp", campaignModel.value.numWhatsapp);
      formData.append("message", campaignModel.value.message);
      formData.append(
        "singleSend",
        campaignModel.value.singleSend ? "true" : "false"
      );
      formData.append("type", props.type);
      if (campaignModel.value.file !== undefined) {
        formData.append("file", campaignModel.value.file);
      }

      if (campaignModel.value.email !== undefined) {
        formData.append("email", campaignModel.value.email);
      }

      if (campaignModel.value.subject !== undefined) {
        formData.append("subject", campaignModel.value.subject);
      }

      if (campaignModel.value.templateExternalId !== undefined) {
        formData.append(
          "templateExternalId",
          campaignModel.value.templateExternalId
        );
      }

      emit("create:campaign", formData);
    }
  });
};

const handlerSelectTemplate = (template: string) => {
  campaignModel.value.message = template;
};
</script>

<style></style>

<template>
  <q-dialog v-model="showForm">
    <q-card style="width: 599.99px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">E-mail</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-md" ref="contactForm">
          <div class="q-gutter-sm">
            <q-radio
              v-model="type"
              val="copy_of_bill"
              label="Segunda via boleto"
            />
            <q-radio v-model="type" val="entry" label="Entrada do Acordo" />
          </div>
          <q-input
            filled
            v-model="contactModel.contato"
            label="E-mail"
            type="email"
            :rules="[(val) => isMin(val, 7)]"
          />

          <q-file
            filled
            bottom-slots
            v-model="files"
            label="Arquivos"
            counter
            use-chips
            multiple
            :rules="[isEmpty]"
            accept="application/pdf"
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop.prevent />
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                v-if="files !== null"
                @click.stop.prevent="files = null"
                class="cursor-pointer"
              />
            </template>
          </q-file>

          <q-card-section>
            <div class="row justify-end">
              <q-btn
                label="Enviar"
                :disable="contactModel.id ? false : true"
                type="submit"
                color="primary"
              />
            </div>
          </q-card-section>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { QForm } from "quasar";
import { ContactT } from "@/types/contact";
import { isEmpty, isMax, isMin } from "@/validation/entity";
const contactForm = ref<QForm | null>(null);
//TODO Verificar este valor
const type = ref("copy_of_bill");

const props = defineProps({
  showForm: Boolean,
  contact: {
    type: Object,
    default: {
      id: null,
      codCredorDesRegis: "",
      tipoContato: "EMAIL",
      contato: "",
      dtImport: "",
      isWhatsapp: false,
      numeroWhats: "",
      block: false,
      blockAll: false,
    },
  },
  clientId: {
    type: [Number, String],
    require: true,
  },
});
const emit = defineEmits(["update:showForm", "send:mail"]);

const showForm = computed({
  get() {
    return props.showForm;
  },
  set(value) {
    emit("update:showForm", value);
  },
});

const contactModel = ref<ContactT>({
  id: null,
  codCredorDesRegis: props.clientId,
  tipoContato: "EMAIL",
  contato: "",
  dtImport: "",
  isWhatsapp: false,
  numeroWhats: "",
  block: false,
  blockAll: false,
});

watch(
  () => props.contact,
  (newValue, oldValue) => {
    contactModel.value = <ContactT>{ ...newValue };
  },
  { deep: true }
);

const files = ref<Array<File> | null>(null);

const onSubmit = () => {
  contactForm.value?.validate().then((success) => {
    if (success) {
      if (contactModel.value.id) {
        const formData = new FormData();
        formData.append(
          "codCredorDesRegis",
          contactModel.value.codCredorDesRegis + ""
        );
        formData.append("contact", contactModel.value.contato);
        if (Array.isArray(files.value)) {
          for (const [index, file] of files.value.entries()) {
            formData.append(`files[${index}]`, file, file.name);
          }
        }
        formData.append("type", type.value);

        emit("send:mail", formData);
        showForm.value = !showForm.value;
      }
    } else {
      console.log("Não deu certo!");
    }
  });
};
</script>

<style></style>

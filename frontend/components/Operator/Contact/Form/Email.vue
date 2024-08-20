<template>
  <q-dialog v-model="showForm">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">E-mail</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-md" ref="contactForm">
          <q-input
            filled
            v-model="contactModel.contato"
            label="E-mail"
            hint="E-mail"
            type="email"
            :rules="[(val) => isMin(val, 7)]"
          />

          <div class="q-pa-md q-gutter-lg">
            <div>
              <q-toggle
                v-model="contactModel.block"
                color="red-10"
                label="Bloquear para este cliente"
                icon="block"
              />

              <q-toggle
                v-model="contactModel.blockAll"
                color="purple-10"
                label="Bloquear para todos"
                icon="block"
              />

              <q-toggle
                v-model="contactModel.cpc"
                checked-icon="check"
                color="green"
                label="CPC"
                unchecked-icon="clear"
              />
            </div>
          </div>
          <q-card-section>
            <div class="row justify-end">
              <q-btn
                :label="contactModel.id ? 'Atualizar' : 'Criar'"
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
import { isMax, isMin } from "@/validation/entity";
const contactForm = ref<QForm | null>(null);

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
      cpc: false,
    },
  },
  clientId: {
    type: [Number, String],
    require: true,
  },
});
const emit = defineEmits([
  "update:showForm",
  "update:contact",
  "create:contact",
]);

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
  cpc: false,
});

watch(
  () => props.contact,
  (newValue, oldValue) => {
    contactModel.value = <ContactT>{ ...newValue };
  },
  { deep: true }
);

const value = ref(true);

const onSubmit = () => {
  contactForm.value?.validate().then((success) => {
    if (success) {
      if (contactModel.value.id) {
        emit("update:contact", contactModel.value);
        showForm.value = !showForm.value;
      } else {
        emit("create:contact", contactModel.value);
        showForm.value = !showForm.value;
      }
    } else {
      console.log("Não deu certo!");
    }
  });
};
</script>

<style></style>

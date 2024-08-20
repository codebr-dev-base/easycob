<template>
  <q-dialog v-model="showForm">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Cliente: {{ clientModel.desRegis }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md" ref="clientForm">
          <q-input
            filled
            v-model="clientModel.nomClien"
            hint="Nome completo"
            :rules="[(val) => isMin(val, 10)]"
            dense
          />
          <q-input
            filled
            v-model="clientModel.desCpf"
            hint="CPF"
            mask="###.###.###-##"
            fill-mask
            :rules="[(val) => isMin(val, 11), (val) => isMax(val, 16)]"
            unmasked-value
            dense
          />
          <div class="row items-start justify-between">
            <q-input
              class="col-5"
              filled
              v-model="clientModel.desEnderResid"
              hint="Endereço"
              :rules="[(val) => isMin(val, 5)]"
              dense
            />
            <q-input
              class="col-2"
              filled
              v-model="clientModel.desNumerResid"
              hint="Número"
              dense
            />
            <q-input
              class="col-4"
              filled
              v-model="clientModel.desComplResid"
              hint="Complemento"
              dense
            />
          </div>
          <div class="row items-start justify-between">
            <q-input
              class="col-6"
              filled
              v-model="clientModel.desCidadResid"
              hint="Endereço"
              :rules="[(val) => isMin(val, 5)]"
              dense
            />
            <q-input
              class="col-5"
              filled
              v-model="clientModel.desEstadResid"
              hint="Endereço"
              :rules="[(val) => isMin(val, 2), (val) => isMax(val, 2)]"
              dense
            />
          </div>

          <div class="row justify-end">
            <q-btn label="Atualizar" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { isEmpty, isMax, isMin } from "@/validation/entity";
import { QForm } from "quasar";
import { ClientT } from "@/types/cliente";
const clientForm = ref<QForm | null>(null);
const emit = defineEmits(["update:showForm", "update:client"]);

const props = defineProps({
  showForm: Boolean,
  client: {
    type: Object as PropType<ClientT>,
    require: true,
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

const clientModel = ref<ClientT>({
  id: null,
  dtUpdate: "",
  datMovto: "",
  codCredorDesRegis: "",
  codCredor: "",
  desRegis: "",
  indAlter: "",
  desCpf: "",
  nomClien: "",
  datNasci: "",
  desEnderResid: "",
  desNumerResid: "",
  desComplResid: "",
  desBairrResid: "",
  desCidadResid: "",
  desEstadResid: "",
  desCepResid: "",
  desFonesResid: "",
  desFonesComer: "",
  codRamalComer: "",
  datRefer: "",
  datExpirPrazo: "",
  datCadasClien: "",
  datAdmis: "",
  desFonesCelul: "",
  desFones1: "",
  desFones2: "",
  desEmail: "",
  descCodMovimento: "",
  status: "",
});

watch(
  () => props.showForm,
  (newValue, oldValue) => {
    clientModel.value = <ClientT>{ ...props.client };
  },
  { deep: true }
);

const onSubmit = () => {
  clientForm.value?.validate().then((success) => {
    if (success) {
      emit("update:client", clientModel.value);
    } else {
      // oh no, user has filled in
      // at least one invalid value
    }
  });
};
</script>

<style></style>

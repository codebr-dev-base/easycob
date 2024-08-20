<template>
  <q-dialog v-model="showForm">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ user?.id ? `Editar ${user.name}` : "Criar Usuário" }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          ref="userForm"
        >
          <div class="row">
            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="userModel.email"
                label="Email"
                :rules="mailRules"
              />
              <q-input
                filled
                v-model="userModel.name"
                label="Nome"
                :rules="nameRules"
              />
              <q-input
                filled
                v-model="userModel.cpf"
                label="CPF"
                mask="###.###.###-##"
                fill-mask
                :rules="cpfRules"
              />
              <q-input
                filled
                v-model="userModel.phone"
                label="Celular"
                mask="(##) #####-####"
                fill-mask
                :rules="phoneRules"
              />

              <q-input
                v-if="!user?.id"
                v-model="payloadPassword.password"
                filled
                label="Senha"
                :type="isPwd ? 'password' : 'text'"
                :rules="passwordRoles"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-input
                v-if="!user?.id"
                v-model="payloadPassword.passwordConfirmation"
                filled
                :type="isPwdConfirmed ? 'password' : 'text'"
                label="Confirme a senha"
                :rules="passwordConfirmationdRoles"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwdConfirmed ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdConfirmed = !isPwdConfirmed"
                  />
                </template>
              </q-input>

              <q-toggle
                v-model="userModel.isActived"
                label="Usuário está ativo"
              />

              <div class="row justify-end">
                <q-btn label="Salvar" type="submit" color="primary" />
                <q-btn
                  v-if="!user?.id"
                  label="Limpar"
                  type="reset"
                  color="primary"
                  flat
                  class="q-ml-sm"
                />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <q-list>
                <div v-for="module in modules" :key="module.id">
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ module.name }}</q-item-label>
                      <q-item-label caption lines="2">
                        <q-toggle
                          v-for="skill in module.skills"
                          v-model="selectionSkills"
                          :key="skill.id"
                          :label="skill.longName"
                          :val="skill.id"
                        />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator spaced inset />
                </div>
              </q-list>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { UserT } from "@/types/user";
import { isEmpty, isMax, isMin } from "@/validation/entity";
import { isPassword } from "@/validation/user";
import { QForm } from "quasar";

const mailRules = [isEmpty, (val: string) => isMin(val, 10)];
const nameRules = mailRules;
const cpfRules = [
  (val: string) => isMin(val, 14),
  (val: string) => isMax(val, 16),
];
const phoneRules = cpfRules;
const passwordRoles = [isPassword];
const passwordConfirmationdRoles = [
  (val: string) => val.length > 0 || "Campo obrigatório",
  (val: string) => val === payloadPassword.password || "Senhas não coincidem",
];

const userForm = ref<QForm | null>(null);

const props = defineProps({
  showForm: Boolean,
  user: {
    type: Object,
    default: {
      id: null,
      email: "",
      name: "",
      cpf: "",
      phone: "",
      isActived: false,
    },
  },
  modules: {
    type: Array<any>,
    default() {
      return [];
    },
  },
});
const selectionSkills = ref<Array<number>>([]);
const userModel = ref<UserT>({
  id: null,
  email: "",
  name: "",
  cpf: "",
  phone: "",
  isActived: false,
});

const payloadPassword = reactive({
  password: "",
  passwordConfirmation: "",
});

const emit = defineEmits(["update:showForm", "update:user", "create:user"]);

const showForm = computed({
  get() {
    return props.showForm;
  },
  set(value) {
    emit("update:showForm", value);
  },
});

const isPwd = ref(true);
const isPwdConfirmed = ref(true);

watch(
  () => props.user,
  (newValue, oldValue) => {
    userModel.value = <UserT>{ ...newValue };
    selectionSkills.value = [];
    if (userModel.value.id) {
      props.user.skills.forEach((skill: { id: number }) => {
        selectionSkills.value.push(skill.id);
      });
    }
  },
  { deep: true }
);

const onReset = () => {
  userModel.value.id = null;
  userModel.value.email = "";
  userModel.value.name = "";
  userModel.value.cpf = "";
  userModel.value.phone = "";
  userModel.value.isActived = false;
};

const onSubmit = () => {
  userForm.value?.validate().then((success) => {
    if (success) {
      if (userModel.value.id) {
        emit("update:user", {
          ...userModel.value,
          skills: selectionSkills.value,
        });
        showForm.value = !showForm.value;
      } else {
        emit("create:user", {
          ...userModel.value,
          skills: selectionSkills.value,
          password: payloadPassword.password,
          passwordConfirmation: payloadPassword.passwordConfirmation,
        });
        showForm.value = !showForm.value;
      }
    } else {
      // oh no, user has filled in
      // at least one invalid value
    }
  });
};
</script>

<style></style>

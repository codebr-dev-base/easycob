<template>
  <q-dialog v-model="showFormPassword">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ `Mudar senha de ${userName}` }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          ref="userFormPassword"
        >
          <q-input
            v-model="payloadPassword.password"
            filled
            :type="isPwd ? 'password' : 'text'"
            hint="Senha"
            :rules="[isPassword]"
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
            v-model="payloadPassword.passwordConfirmation"
            filled
            :type="isPwdConfirmed ? 'password' : 'text'"
            hint="Confirme a senha"
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

          <div class="row justify-end">
            <q-btn label="Salvar" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { isPassword } from "@/validation/user";
import { QForm } from "quasar";

const passwordConfirmationdRoles = [
  (val: string) => val.length > 0 || "Campo obrigatório",
  (val: string) => val === payloadPassword.password || "Senhas não coincidem",
];

const emit = defineEmits(["update:showFormPassword", "update:password"]);

const props = defineProps({
  showFormPassword: Boolean,
  userId: {
    type: Number as PropType<number | null>,
    nullable: true,
  },
  userName: String,
});

const userFormPassword = ref<QForm | null>(null);

const payloadPassword = reactive({
  password: "",
  passwordConfirmation: "",
});

const showFormPassword = computed({
  get() {
    return props.showFormPassword;
  },
  set(value) {
    emit("update:showFormPassword", value);
  },
});

const isPwd = ref(true);
const isPwdConfirmed = ref(true);

const onReset = () => {
  payloadPassword.password = "";
  payloadPassword.passwordConfirmation = "";
};

const onSubmit = () => {
  userFormPassword.value?.validate().then((success) => {
    if (success) {
      emit("update:password", {
        id: props.userId,
        password: payloadPassword.password,
        passwordConfirmation: payloadPassword.passwordConfirmation,
      });
      showFormPassword.value = !showFormPassword.value;
      payloadPassword.password = "";
      payloadPassword.passwordConfirmation = "";
    } else {
      // oh no, user has filled in
      // at least one invalid value
    }
  });
};
</script>

<style scoped></style>

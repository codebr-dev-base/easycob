<template>
  <div class="row wrap justify-center items-center content-center height-page">
    <div class="q-pa-md" style="max-width: 400px">
      <!-- 
      {{ status }}
      {{ data }}
          {{ lastRefreshedAt }}
      {{ session }}
      {{ providers }}
      {{ csrfToken }} -->

      <q-card class="my-card">
        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="credential.email"
              filled
              type="email"
              hint="Email"
              label="E-mail"
              lazy-rules
            >
            </q-input>

            <q-input
              v-model="credential.password"
              filled
              :type="isPwd ? 'password' : 'text'"
              hint="Password"
              label="Senha"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div>
              <q-btn label="Login" type="submit" color="warning" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from "quasar";
import { ref, reactive } from "vue";
</script>

<script setup lang="ts">
definePageMeta({
  layout: "light",
  middleware: "auth",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const config = useRuntimeConfig();

const API_BASE_URL = config.public.apiBase;
const $q = useQuasar();
const {
  status,
  data,
  lastRefreshedAt,
  signIn,
  signOut,
  getSession,
  getCsrfToken,
  getProviders,
} = useAuth();

const nuxtApp = useNuxtApp();
const session = await getSession();
const providers = await getProviders();
const csrfToken = await getCsrfToken();

const credential = reactive({
  email: "",
  password: "",
});
const isPwd = ref(true);

const onSubmit = async () => {
  try {
    const responseSingIn = await signIn("credentials", {
      ...credential,
      callbackUrl: "/",
      redirect: false,
    });

    console.log(responseSingIn);
    /*     if (ok) {
      console.log("ok");

      //await navigateTo("/");
      location.replace("/");
    } */
    if (responseSingIn.error) {
      if (responseSingIn.error === "CredentialsSignin") {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "e-mail ou senha estão errados",
        });
      }
    } else {
      location.replace("/");
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="css" scoped>
.height-page {
  min-height: calc(100vh - 100px);
}
</style>

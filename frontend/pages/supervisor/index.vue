<template>
  <q-page padding>
    <div class="q-pa-md row items-start">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-lg-2 q-pa-xs">
        <NuxtLink to="/supervisor/actions">
          <q-card class="gradient">
            <q-img :ratio="4 / 3">
              <div
                to="/supervisor/actions"
                class="absolute-full text-h4 flex flex-center text-cente"
              >
                Acionamentos
              </div>
            </q-img>
          </q-card>
        </NuxtLink>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-lg-2 q-pa-xs">
        <NuxtLink to="/supervisor/actions/discount">
          <q-card class="gradient">
            <q-img :ratio="4 / 3">
              <div
                to="/supervisor/actions/discount"
                class="absolute-full text-h4 flex flex-center text-cente"
              >
                Descontos
              </div>
            </q-img>
          </q-card>
        </NuxtLink>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-lg-2 q-pa-xs">
        <NuxtLink to="/operator/campaign/sms">
          <q-card class="gradient">
            <q-img :ratio="4 / 3">
              <div
                to="/operator/campaign/sms"
                class="absolute-full text-h4 flex flex-center text-cente"
              >
                Campanha SMS
              </div>
            </q-img>
          </q-card>
        </NuxtLink>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-lg-2 q-pa-xs">
        <NuxtLink to="/operator/campaign/email">
          <q-card class="gradient">
            <q-img :ratio="4 / 3">
              <div
                to="/operator/campaign/email"
                class="absolute-full text-h4 flex flex-center text-cente"
              >
                Campanha E-mail
              </div>
            </q-img>
          </q-card>
        </NuxtLink>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ["auth", "authorization"] });
</script>

<style>
.option-card {
  width: 100%;
  height: 100%;
}

.gradient {
  background-image: linear-gradient(to right, #226ad3ff, #0fa573ff);
}

.q-img__content > div:hover {
  background: rgba(0, 0, 0, 0.6);
}
</style>

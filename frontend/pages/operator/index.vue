<template>
  <q-page padding>
    <div class="q-pa-md row items-start">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-lg-2 q-pa-xs">
        <NuxtLink to="/operator/client">
          <q-card class="gradient">
            <q-img :ratio="4 / 3">
              <div
                to="/operator/client"
                class="absolute-full text-h4 flex flex-center text-cente"
              >
                Clientes
              </div>
            </q-img>
          </q-card>
        </NuxtLink>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-lg-2 q-pa-xs">
        <NuxtLink to="/following">
          <q-card class="gradient">
            <q-img :ratio="4 / 3">
              <div
                to="/following"
                class="absolute-full text-h4 flex flex-center text-cente"
              >
                Acompanhamento
              </div>
            </q-img>
          </q-card>
        </NuxtLink>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-lg-2 q-pa-xs">
        <NuxtLink to="/loyal">
          <q-card class="gradient">
            <q-img :ratio="4 / 3">
              <div
                to="/loyal"
                class="absolute-full text-h4 flex flex-center text-cente"
              >
                Fidelizados
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

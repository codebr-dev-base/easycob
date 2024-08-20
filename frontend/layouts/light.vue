<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-dark text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar class="text-warning">
            <img src="~/assets/img/yuan.png" />
          </q-avatar>
          CRM <span class="text-warning">Y</span>uan
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="height-page">
      <slot />
    </q-page-container>

    <Footer />
  </q-layout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
// import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

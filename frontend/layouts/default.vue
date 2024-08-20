<template>
  <q-layout view="hHr lpR fFr">
    <Header
      rightDrawerOpen?="rightDrawerOpen"
      @toggleRightDrawer="toggleRightDrawer"
    />

    <slot name="sidebar"> </slot>

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      elevated
      behavior="mobile"
    >
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <slot />
    </q-page-container>
    <Footer />
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const rightDrawerOpen = ref(false);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>

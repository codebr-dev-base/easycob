<template>
  <q-page padding>
    <SidebarAdmin />
    <div class="row">
      <div class="col">.col</div>
      <div class="col">.col</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ["auth", "authorization"] });
</script>

<style scoped></style>

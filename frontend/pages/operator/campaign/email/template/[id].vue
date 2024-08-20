<template>
  <div>
    {{ templateId }}

    <ClientOnly fallback-tag="span" fallback="Loading comments...">
      <EditEmail />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: "light", iddleware: ["auth", "authorization"] });
const route = useRoute();
const templateId = <string>route.params.id;
</script>

<style></style>

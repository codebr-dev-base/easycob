<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    :mini="leftDrawerMini"
    @mouseover="leftDrawerMini = false"
    @mouseout="leftDrawerMini = true"
    mini-to-overlay
    :width="200"
    :breakpoint="500"
    bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
  >
    <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
      <q-list padding>
        <q-item clickable v-ripple to="/admin">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section> Usuários </q-item-section>
        </q-item>

        <q-separator />
        <q-item clickable v-ripple to="/admin/skill">
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>

          <q-item-section> Perfils </q-item-section>
        </q-item>

        <q-separator />
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
const leftDrawerOpen = ref(false);
const leftDrawerMini = ref(true);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<style></style>

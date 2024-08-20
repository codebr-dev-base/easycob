<template>
  <q-header elevated class="bg-dark text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>
        <q-avatar class="text-warning">
          <img src="~/assets/img/yuan.png" />
        </q-avatar>
        CRM <span class="text-warning">Y</span>uan
      </q-toolbar-title>

      <q-tabs align="left">
        <q-route-tab
          v-show="checkAuthorizationModule('operator')"
          to="/operator"
          label="Operação"
        />
        <q-route-tab
          v-show="checkAuthorizationModule('supervisor')"
          to="/supervisor"
          label="Supervisão"
        />
        <q-route-tab
          v-show="checkAuthorizationModule('admin')"
          to="/admin"
          label="Administração"
        />
      </q-tabs>
      <div v-if="status === 'authenticated'" class="row">
        <q-separator dark vertical />
        <q-chip> Oi {{ labelName }}! </q-chip>
        <q-separator dark vertical />
        <q-btn stretch flat label="Logout" @click="logout" />
      </div>
      <div v-else class="row">
        <q-separator dark vertical />
        <q-btn stretch flat label="Login" to="/auth/login" />
      </div>

      <q-btn
        class="text-warning"
        dense
        flat
        round
        icon="notifications"
        @click="$emit('toggleRightDrawer')"
      />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import useAuthentication from "~/composables/useAuthentication";
import useAuthorization from "~/composables/useAuthorization";

defineProps({
  rightDrawerOpen: Boolean,
});

const auth = useAuthentication();
const { checkAuthorizationModule } = useAuthorization();

const { status, data, signOut } = useAuth();

const labelName = computed(() => {
  if (status.value === "authenticated") {
    const splitName = data.value?.user?.name?.split(" ");
    return splitName ? splitName[0] : " ";
  } else {
    return "Oi!";
  }
});

const logout = async () => {
  if (await auth.logOut()) {
    await signOut({ callbackUrl: "/auth/login", redirect: true });
  }
};
</script>

<style></style>

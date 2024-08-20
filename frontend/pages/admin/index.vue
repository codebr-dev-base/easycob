<template>
  <q-page padding>
    <SidebarAdmin />
    <div class="row">
      <div class="col">
        <AdminUserTable
          :rows.sync="rows"
          :meta.sync="meta"
          :pending.sync="pending"
          :modules.sync="listModules"
          @request="handleChangePaginate"
          @disabe:user="handleDisableUser"
          @create:user="handleCreateUser"
          @update:user="handleUpdateUser"
          @update:password="handlerChangePassword"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { ErrosT, ErrosFieldT } from "@/types/erros";
import { UserT, PasswordT } from "@/types/user";
import useAuthorization from "~/composables/useAuthorization";
</script>

<script setup lang="ts">
definePageMeta({ middleware: ["auth", "authorization"] });
onBeforeMount(() => {});
const { checkAuthorizationModule } = useAuthorization();
if (await !checkAuthorizationModule()) {
  const router = useRouter();
  router.push({ path: "/" });
}
const $q = useQuasar();

const {
  getUser,
  createUser,
  updateUser,
  disableUser,
  updatePassword,
  pending,
} = useUser();

const { getModules } = useModule();

const modules = await getModules();

const list = await getUser();
const rows = ref(list.data.value?.data);
const meta = ref(list.data.value?.meta);
const listModules = ref([]);
const invoiceRows = ref([]);
const statusFilter = ref("ATIVO");

listModules.value = <never[]>toRaw(modules.data.value);

const handleChangePaginate = async (e: any) => {
  list.params.query.page = e.pagination.page;
  list.params.query.perPage = e.pagination.rowsPerPage;
  list.params.query.keyword = e.filter;
  list.params.query.orderBy = e.pagination.sortBy;
  list.params.query.descending = e.pagination.descending;
  await list.refresh();

  rows.value = list.data.value?.data;
  meta.value = list.data.value?.meta;
};

const handleDisableUser = async (user: UserT) => {
  const responseDisable = await disableUser(user);

  rows.value?.forEach((row) => {
    if (row.id === user.id) {
      row.isActived = !row.isActived;
      // user.isActived = !user.isActived;
    }
  });

  if (responseDisable.error.value) {
    const errors = responseDisable.error.value.data.messages.errors;
    errors.forEach((error: ErrosFieldT) => {
      $q.notify({
        message: error.message,
        type: "warning",
      });
    });
  } else {
    $q.notify({
      message: `${user.name} está ${user.isActived ? "Ativo" : "Desativado"}!`,
      color: `${user.isActived ? "green" : "red"}`,
      type: `${user.isActived ? "positive" : "negative"}`,
    });
  }
};

const handleCreateUser = async (user: UserT) => {
  const responseCreate = await createUser(user);
  if (responseCreate.error.value) {
    const errors = responseCreate.error.value.data.messages.errors;
    errors.forEach((error: ErrosFieldT) => {
      $q.notify({
        message: error.message,
        type: "warning",
      });
    });
  } else {
    $q.notify({
      message: `${user.name} está ${user.isActived ? "Ativo" : "Desativado"}!`,
      color: `${user.isActived ? "green" : "red"}`,
      type: `${user.isActived ? "positive" : "negative"}`,
    });

    rows.value?.unshift(responseCreate.data.value);
  }
};

const handleUpdateUser = async (user: UserT) => {
  const responseUpdate = await updateUser(user);

  if (responseUpdate.error.value) {
    const errors = responseUpdate.error.value.data.messages.errors;
    errors.forEach((error: ErrosFieldT) => {
      $q.notify({
        message: error.message,
        type: "warning",
      });
    });
  } else {
    $q.notify({
      message: `${user.name} está ${user.isActived ? "Ativo" : "Desativado"}!`,
      color: `${user.isActived ? "green" : "red"}`,
      type: `${user.isActived ? "positive" : "negative"}`,
    });

    rows.value?.forEach((row) => {
      if (row.id === user.id) {
        row.email = user.email;
        row.name = user.name;
        row.cpf = user.cpf;
        row.phone = user.phone;
        row.isActived = user.isActived;
        row.skills = responseUpdate.data.value?.skills;
      }
    });
  }
};

const handlerChangePassword = async (payloadPassword: PasswordT) => {
  const responseUpdatePassword = await updatePassword(payloadPassword);

  if (responseUpdatePassword.error.value) {
    const errors = responseUpdatePassword.error.value.data.messages.errors;

    errors.forEach((error: ErrosFieldT) => {
      $q.notify({
        message: error.message,
        type: "warning",
      });
    });
  } else {
    $q.notify({
      message: "Senha Atualizada!",
      color: "green",
      type: "positive",
    });
  }
};
</script>

<style scoped></style>

<template>
  <div class="q-pa-md">
    <q-table
      title="Usuários"
      :rows="rows"
      :columns="columns"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 40, 80]"
      row-key="id"
      :loading="pending"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
          filled
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          color="green"
          icon="person_add"
          @click="handlerAddUser"
          size="sm"
        >
          <q-tooltip transition-show="flip-right" transition-hide="flip-left">
            Adicionar User
          </q-tooltip>
        </q-btn>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              color="primary"
              icon="mode_edit"
              size="sm"
              @click="handlerEditUser(props.row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Editar
              </q-tooltip>
            </q-btn>
            <q-btn
              color="secondary"
              icon="password"
              size="sm"
              @click="handlerChangePassword(props.row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Trocar Senha
              </q-tooltip>
            </q-btn>
            <q-btn
              :color="`${props.row.isActived ? 'red' : 'green'}`"
              :icon="`${props.row.isActived ? 'person_off' : 'person'}`"
              @click="
                () => {
                  $emit('disabe:user', props.row);
                }
              "
              size="sm"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                {{ props.row.isActived ? "Desativar" : "Ativar" }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
    <AdminUserForm
      v-model:showForm="showForm"
      :user="userEdit"
      :modules="modules"
      @create:user="
        (val) => {
          $emit('create:user', val);
        }
      "
      @update:user="
        (val) => {
          $emit('update:user', val);
        }
      "
    />
    <AdminUserFormPassword
      v-model:showFormPassword="showFormPassword"
      :user-id="userEdit.id"
      :user-name="userEdit.name"
      @update:password="
        (val) => {
          $emit('update:password', val);
        }
      "
    />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits([
  "request",
  "disabe:user",
  "update:user",
  "create:user",
  "update:password",
]);
const filter = ref("");

const showForm = ref(false);
const showFormPassword = ref(false);

const userModel = {
  id: null,
  email: "",
  name: "",
  isActived: false,
};

const userEdit = ref({ ...userModel });

const props = defineProps({
  rows: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  meta: {
    type: Object,
    required: true,
  },
  modules: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  pending: Boolean,
});
const columns = [
  {
    name: "id",
    label: "Id",
    field: "id",
    sortable: true,
    classes: (row: any) => (!row.isActived ? "disabled" : ""),
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    sortable: true,
    classes: (row: any) => (!row.isActived ? "disabled" : ""),
  },
  {
    name: "name",
    label: "Nome",
    field: "name",
    sortable: true,
    classes: (row: any) => (!row.isActived ? "disabled" : ""),
  },
  {
    name: "isActived",
    label: "Satus",
    field: (row: any) => (row.isActived ? "Ativo" : "Desativado"),
    sortable: true,
    classes: (row: any) => (!row.isActived ? "disabled text-red" : ""),
  },
  {
    name: "actions",
    label: "Ações",
    field: "actions",
  },
];

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: props.meta.currentPage,
  rowsPerPage: props.meta.perPage,
  rowsNumber: props.meta.total,
});

watch(
  () => props.meta,
  (meta, prevMeta) => {
    pagination.value.page = meta.currentPage;
    pagination.value.rowsPerPage = meta.perPage;
    pagination.value.rowsNumber = meta.total;
  }
);

const onRequest = (e: any) => {
  pagination.value.sortBy = e.pagination.sortBy;
  pagination.value.descending = e.pagination.descending;
  emit("request", e);
};

const handlerEditUser = (row: any) => {
  showForm.value = true;
  userEdit.value = { ...row };
};
const handlerChangePassword = (row: any) => {
  showFormPassword.value = true;
  userEdit.value = { ...row };
};
const handlerAddUser = (row: any) => {
  showForm.value = true;
  userEdit.value = { ...userModel };
};
</script>

<style></style>

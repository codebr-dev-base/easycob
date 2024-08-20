<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <SupervisorActionTable
          :rows="rows"
          :meta="meta"
          :pending="list.pending.value"
          :type-action="typeAction"
          :user-operato="listOperator.data.value"
          :return-type="returnType"
          :list-for-csv="listForCsv"
          @request="handleChangePaginate"
          @send:action="handleSendAction"
          @update:status="handleChangeStatus"
          @update:unificationCheck="handleClickCheck"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ["auth", "authorization"] });
import { ActionT } from "~/types/action";
const $q = useQuasar();

const {
  getActions,
  sendAction,
  getReturnsTypes,
  getLazyActions,
  unificationCheck,
} = useAction();
const { getUserByModule } = useUser();
const listOperator = await getUserByModule("operator", true);
const { getTypeAction } = useTypeAction();
const { data: typeAction } = await getTypeAction();
const actionsForCsv = await getLazyActions();
const { data: returnType } = await getReturnsTypes();

const list = await getActions();
const listForCsv = await getLazyActions();
const rows = ref(list.data.value?.data);
const meta = ref(list.data.value?.meta);

const handleChangePaginate = async (e: any) => {
  list.params.query.sync = e.pagination.sync;
  list.params.query.page = e.pagination.page;
  list.params.query.perPage = e.pagination.rowsPerPage;
  list.params.query.orderBy = e.pagination.sortBy;
  list.params.query.descending = e.pagination.descending;
  list.params.query.keyword = e.filter;
  list.params.query.keywordColumn = e.filterColumn;
  list.params.query.userId = e.userId;
  list.params.query.typeActionIds = e.typeActionIds;
  list.params.query.returnType = e.returnType;

  if (e.searchDate && e.searchDate.start != null && e.searchDate.end != null) {
    list.params.query.startDate = e.searchDate.start;
    list.params.query.endDate = e.searchDate.end;
  } else {
    list.params.query.startDate = null;
    list.params.query.endDate = null;
  }
  await list.refresh();

  rows.value = list.data.value?.data;
  meta.value = list.data.value?.meta;
};

const handleSendAction = async (action: ActionT) => {
  if (await sendAction(action.id)) {
    $q.notify({
      message: "O acionamento foi para fila de envio",
      color: "green",
      type: "positive",
    });
  } else {
    $q.notify({
      message: "Não foi possivel colocar acionamento na fila de envio",
      type: "warning",
    });
  }
};

const handleChangeStatus = async (e: boolean) => {
  listOperator.params.query.status = e;
  listOperator.refresh();
};

const handleClickCheck = async (id: any) => {
  await unificationCheck(id);
  await list.refresh();
};
</script>

<style scoped></style>

<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <OperatorClientTable
          :rows="rows"
          :meta="meta"
          :pending.="list.pending.value"
          @request="handleChangePaginate"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
const { getClients } = useClient();

const list = await getClients();
const rows = ref(list.data.value?.data);
const meta = ref(list.data.value?.meta);

const handleChangePaginate = async (e: any) => {
  list.params.query.status = e.pagination.status;
  list.params.query.page = e.pagination.page;
  list.params.query.perPage = e.pagination.rowsPerPage;
  list.params.query.orderBy = e.pagination.sortBy;
  list.params.query.descending = e.pagination.descending;
  list.params.query.keyword = e.filter;
  list.params.query.keywordColumn = e.filterColumn;
  await list.refresh();

  rows.value = list.data.value?.data;
  meta.value = list.data.value?.meta;
};
</script>

<style scoped></style>

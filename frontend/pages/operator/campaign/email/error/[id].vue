<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <OperatorCampaignLotTable
          :rows="rows"
          :meta="meta"
          :pending="list.pending.value"
          type="EMAIL"
          @request="handleChangePaginate"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ["auth", "authorization"] });
const route = useRoute();
const type = "EMAIL";
const campaignId = <string>route.params.id;
const { getCampaignErrors } = useCampaign();

const list = await getCampaignErrors(campaignId);
const rows = ref(list.data.value?.data);
const meta = ref(list.data.value?.meta);

const handleChangePaginate = async (e: any) => {
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

<style></style>

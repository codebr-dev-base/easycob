<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <OperatorCampaignTable
          :rows.sync="rows"
          :meta.sync="meta"
          :pending.sync="list.pending.value || createLoad.valueOf()"
          :list-for-csv="listForCsv"
          :templates="listTemplates.data.value"
          :type="type"
          @request="handleChangePaginate"
          @create:campaign="handleCreateCampaign"
          @create:template="handleCreateTemplate"
          @show:form-campaign="handleShowFormCampaign"
          @send:campaign="handleSendCampaign"
        />
      </div>
    </div>
  </q-page>
</template>
<script lang="ts" setup>
definePageMeta({ middleware: ["authorization"] });
import { ErrosT, ErrosFieldT } from "@/types/erros";
import useTemplate from "~/composables/useCampaignTemplate";
const $q = useQuasar();
const type = "EMAIL";
const { createCampaign, getCampaigns, getLazyCampaigns, sendCampaign } =
  useCampaign();
const { getLazyTemplates, createTemplate } = useTemplate();
const listTemplates = await getLazyTemplates(type);

const listForCsv = await getLazyCampaigns(type);
const list = await getCampaigns(type);
const rows = ref(list.data.value?.data);
const meta = ref(list.data.value?.meta);
//const templates = ref(<any[] | undefined>listTemplates.data.value);
const createLoad = ref(false);
const handleShowFormCampaign = async () => {
  await listTemplates.execute();
  //templates.value = <any[] | undefined>listTemplates.data.value;
};

const handleChangePaginate = async (e: any) => {
  list.params.query.page = e.pagination.page;
  list.params.query.perPage = e.pagination.rowsPerPage;
  list.params.query.orderBy = e.pagination.sortBy;
  list.params.query.descending = e.pagination.descending;
  list.params.query.keyword = e.filter;
  list.params.query.keywordColumn = e.filterColumn;

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

const handleCreateCampaign = async (campaign: any) => {
  createLoad.value = true;
  const responseCreateCampaign = await createCampaign(campaign, type);
  if (responseCreateCampaign.error.value) {
    const errors = responseCreateCampaign.error.value.data.messages.errors;

    errors.forEach((error: ErrosFieldT) => {
      $q.notify({
        message: error.message,
        type: "warning",
      });
    });
  } else {
    await list.refresh();

    rows.value = list.data.value?.data;
    meta.value = list.data.value?.meta;
    $q.notify({
      message: "CSV arrregado!",
      color: "green",
      type: "positive",
    });
  }
  createLoad.value = false;
};

const handleCreateTemplate = async (template: any) => {
  const responseCreateTemplate = await createTemplate(template, type);
  if (responseCreateTemplate.error.value) {
    const errors = responseCreateTemplate.error.value.data.messages.errors;

    errors.forEach((error: ErrosFieldT) => {
      $q.notify({
        message: error.message,
        type: "warning",
      });
    });
  } else {
    await listTemplates.refresh();
    //templates.value = <any[] | undefined>listTemplates.data.value;
    $q.notify({
      message: "Template Salvo!",
      color: "green",
      type: "positive",
    });
  }
};

const handleSendCampaign = async (campaign: { id: any }) => {
  if (await sendCampaign(campaign.id)) {
    $q.notify({
      message: "O campanha foi para fila de envio",
      color: "green",
      type: "positive",
    });
  } else {
    $q.notify({
      message: "Não foi possivel colocar campanha na fila de envio",
      type: "warning",
    });
  }
};
</script>

<style></style>

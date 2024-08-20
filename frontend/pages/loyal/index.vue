<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-card>
        <LoyalTable
          :rows="loyalRows"
          :meta="loyalMeta"
          @request="handleChangePaginate"
          :faixa-tempos="faixaTempos"
          :faixa-valores="faixaValores"
          :faixa-titulos="faixaTitulos"
          :faixa-clusters="faixaClusters"
          :unidades="unidades"
          :situacoes="situacoes"
          :pending="listLoyal.pending.value"
          :type-action="listTypeAction"
          @update:check="handleClickCheck"
        />
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { date } from "quasar";
definePageMeta({ middleware: "auth" });

const {
  getLoyals,
  getFaixaTempos,
  getFaixaTitulos,
  getFaixaValores,
  getFaixaClusters,
  getUnidades,
  getSituacoes,
  check,
} = useLoyal();
const { getTypeAction } = useTypeAction();
const { data: typeAction } = await getTypeAction();

const listTypeAction = [
  {
    abbreviation: "NOT_ACTION",
    categoryActionId: 0,
    commissioned: 0,
    createdAt: "",
    id: 0,
    name: "SEM ACIONAMENTOS",
    timelife: 1,
    type: "simple",
    updatedAt: "",
  },
  ...typeAction.value,
];

const { getUserByModule } = useUser();
const listOperator = await getUserByModule("operator", true);
const { data: faixaTempos } = await getFaixaTempos();
const { data: faixaValores } = await getFaixaValores();
const { data: faixaTitulos } = await getFaixaTitulos();
const { data: faixaClusters } = await getFaixaClusters();
const { data: unidades } = await getUnidades();
const { data: situacoes } = await getSituacoes();

const listLoyal = await getLoyals();

const loyalRows = ref(listLoyal.data.value?.data);
const loyalMeta = ref(listLoyal.data.value?.meta);

loyalRows.value?.forEach((loyal) => {
  if (!loyal.check) {
    loyal.check = false;
  }
});

const handleChangePaginate = async (e: any) => {
  listLoyal.params.query.page = e.pagination.page;
  listLoyal.params.query.perPage = e.pagination.rowsPerPage;
  listLoyal.params.query.orderBy = e.pagination.sortBy;
  listLoyal.params.query.descending = e.pagination.descending;

  listLoyal.params.query.keyword = e.filter;
  listLoyal.params.query.keywordColumn = e.filterColumn;

  listLoyal.params.query.faixaTempos = e.faixaTempos;
  listLoyal.params.query.faixaValores = e.faixaValores;
  listLoyal.params.query.faixaTitulos = e.faixaTitulos;
  listLoyal.params.query.faixaClusters = e.faixaClusters;
  listLoyal.params.query.typeActions = e.typeActions;
  listLoyal.params.query.unidades = e.unidades;
  listLoyal.params.query.situacoes = e.situacoes;
  listLoyal.params.query.notAction = e.notAction;

  if (e.searchDate && e.searchDate.start != null && e.searchDate.end != null) {
    listLoyal.params.query.startDate = e.searchDate.start;
    listLoyal.params.query.endDate = e.searchDate.end;
  } else {
    listLoyal.params.query.startDate = null;
    listLoyal.params.query.endDate = null;
  }

  await listLoyal.refresh();

  loyalRows.value = listLoyal.data.value?.data;
  loyalMeta.value = listLoyal.data.value?.meta;
};

const handleClickCheck = async (id: any) => {
  await check(id);
  await listLoyal.refresh();
};
</script>

<style scoped></style>

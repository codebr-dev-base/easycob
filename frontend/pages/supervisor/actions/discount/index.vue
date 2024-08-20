<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      bordered
      class="q-pt-xl"
      :width="520"
    >
      <ClientOnly fallback-tag="span" fallback="Loading form...">
        <FollowingNegociationForm
          :negociation="negociation"
          :negociationHistories="negociationHistories"
          @update:negociation="handleUpdateNegociation"
        />
      </ClientOnly>
      <ClientOnly fallback-tag="span" fallback="Loading form...">
        <FollowingInvoiceForm
          :invoice="invoice"
          :invoiceHistories="invoiceHistories"
          @update:invoice="handleUpdateInvoice"
        />
      </ClientOnly>
      <ClientOnly fallback-tag="span" fallback="Loading form...">
        <FollowingPromiseForm
          :promise="promise"
          :promiseHistories="promiseHistories"
          @update:promise="handleUpdatePromise"
        />
      </ClientOnly>
    </q-drawer>

    <q-page-container @click="closeRightDrawer">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="negotiation" label="Entrada" />
          <q-tab name="promise" label="Acordo a Vista" />
          <q-tab name="invoice" label="Parcelas" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="negotiation">
            <FollowingNegociationTable
              :today="today"
              :tomorrow="tomorrow"
              :rows="negotiationRows"
              :meta="negotiationMeta"
              :selectedNegociation="selectedNegociation"
              :user-operato="listOperator.data.value"
              @update:status="handleChangeStatus"
              @request="handleChangePaginateNegotiation"
              @selected="handleSelectNegotiation"
            />
          </q-tab-panel>

          <q-tab-panel name="promise">
            <FollowingPromiseTable
              :today="today"
              :tomorrow="tomorrow"
              :rows="promiseRows"
              :meta="promiseMeta"
              @update:status="handleChangeStatus"
              :selectedNegociation="selectedPromise"
              :user-operato="listOperator.data.value"
              @request="handleChangePaginatePromise"
              @selected="handleSelectPromise"
            />
          </q-tab-panel>

          <q-tab-panel name="invoice">
            <FollowingInvoiceTable
              :today="today"
              :tomorrow="tomorrow"
              :rows="invoiceRows"
              :meta="invoiceMeta"
              @update:status="handleChangeStatus"
              :selectedInvoice="selectedInvoice"
              :user-operato="listOperator.data.value"
              @request="handleChangePaginateInvoice"
              @selected="handleSelectInvoice"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { date } from "quasar";
definePageMeta({ middleware: "auth" });
const rightDrawerOpen = ref(false);

const negociation = ref({
  id: null,
  idNegotiation: null,
  valOriginal: null,
  valTotalPrest: null,
  valEntra: null,
  numVezes: null,
  valPrest: null,
  datEntra: null,
  datPrest: null,
  datEntraPayment: null,
  valEntraPayment: null,
  status: null,
  actionId: null,
  createdAt: "null",
  updatedAt: "null",
  datPayment: null,
  valPayment: null,
  userId: null,
  user: null,
  client: null,
  contato: null,
  desContr: null,
  followingStatus: null,
  datBreach: null,
  discount: false,
  valDiscount: null,
  percDiscount: null,
});
const negociationHistories: Ref<any[]> = ref([]);

const invoice = ref({
  client: null,
  contato: null,
  createdAt: null,
  datPayment: null,
  datPrest: null,
  desContr: null,
  id: null,
  idNegotiation: null,
  negotiationOfPaymentId: null,
  status: null,
  updatedAt: null,
  user: null,
  userId: null,
  valPayment: null,
  valPrest: null,
  followingStatus: null,
  datBreach: null,
});
const invoiceHistories: Ref<any[]> = ref([]);

const promise = ref({
  id: null,
  datPrev: null,
  valPrest: null,
  datPayment: null,
  valPayment: null,
  status: null,
  actionId: null,
  createdAt: null,
  updatedAt: null,
  followingStatus: null,
  datBreach: null,
  discount: false,
  valDiscount: null,
  percDiscount: null,
});

const promiseHistories: Ref<any[]> = ref([]);
const today = new Date();
const tomorrow = date.addToDate(today, { days: 1 });
const tab = ref("negotiation");

const {
  getNegotiationsByDate,
  updateNegotiation,
  getInvoicesByDate,
  updateInvoice,
} = useNegotiation();
const { getLazyNegotiationHistories } = useNegotiationHistory();
const { getLazyInvoiceHistories } = useInvoiceHistory();
const { getPromisesByDate, updatePromise } = usePromise();
const { getLazyPromiseHistories } = usePromiseHistory();
const { getUserByModule } = useUser();
const listOperator = await getUserByModule("operator", true);

const listNegotiationHistories = await getLazyNegotiationHistories();
const listInvoiceHistories = await getLazyInvoiceHistories();
const listPromeseHistories = await getLazyPromiseHistories();
const { data: userOperato, params: UserParams } = await getUserByModule(
  "operator"
);

const listNegotiation = await getNegotiationsByDate(
  today.toISOString().split("T")[0],
  tomorrow.toISOString().split("T")[0]
);
const listInvoices = await getInvoicesByDate(
  today.toISOString().split("T")[0],
  tomorrow.toISOString().split("T")[0]
);
const listPromises = await getPromisesByDate(
  today.toISOString().split("T")[0],
  tomorrow.toISOString().split("T")[0]
);

const negotiationRows = ref(listNegotiation.data.value?.data);
const negotiationMeta = ref(listNegotiation.data.value?.meta);

const invoiceRows = ref(listInvoices.data.value?.data);
const invoiceMeta = ref(listInvoices.data.value?.meta);

const promiseRows = ref(listPromises.data.value?.data);
const promiseMeta = ref(listPromises.data.value?.meta);

const selectedNegociation = ref([]);
const selectedInvoice = ref([]);
const selectedPromise = ref([]);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const closeRightDrawer = () => {
  rightDrawerOpen.value = false;
  selectedNegociation.value = [];
  selectedInvoice.value = [];
  selectedPromise.value = [];
};

const handleSelectNegotiation = async (e: any) => {
  selectedNegociation.value = e.item;
  if (e.item.length > 0) {
    listNegotiationHistories.params.id = e.item[0].id;
    await listNegotiationHistories.execute();
    negociationHistories.value = toRaw(
      listNegotiationHistories.data.value as Array<any>
    );
    negociation.value = toRaw(e.item[0]);

    invoice.value = {
      client: null,
      contato: null,
      createdAt: null,
      datPayment: null,
      datPrest: null,
      desContr: null,
      id: null,
      idNegotiation: null,
      negotiationOfPaymentId: null,
      status: null,
      updatedAt: null,
      user: null,
      userId: null,
      valPayment: null,
      valPrest: null,
      followingStatus: null,
      datBreach: null,
    };

    promise.value = {
      id: null,
      datPrev: null,
      valPrest: null,
      datPayment: null,
      valPayment: null,
      status: null,
      actionId: null,
      createdAt: null,
      updatedAt: null,
      followingStatus: null,
      datBreach: null,
      discount: false,
      valDiscount: null,
      percDiscount: null,
    };

    if (selectedInvoice.value.length > 0) {
      selectedInvoice.value = [];
    }

    if (selectedPromise.value.length > 0) {
      selectedPromise.value = [];
    }

    rightDrawerOpen.value = true;
  } else {
    rightDrawerOpen.value = false;
  }
};

const handleSelectInvoice = async (e: any) => {
  selectedInvoice.value = e.item;
  if (e.item.length > 0) {
    listInvoiceHistories.params.id = e.item[0].id;
    await listInvoiceHistories.execute();
    invoiceHistories.value = toRaw(
      listInvoiceHistories.data.value as Array<any>
    );
    invoice.value = toRaw(e.item[0]);

    negociation.value = {
      id: null,
      idNegotiation: null,
      valOriginal: null,
      valTotalPrest: null,
      valEntra: null,
      numVezes: null,
      valPrest: null,
      datEntra: null,
      datPrest: null,
      datEntraPayment: null,
      valEntraPayment: null,
      status: null,
      actionId: null,
      createdAt: "null",
      updatedAt: "null",
      datPayment: null,
      valPayment: null,
      userId: null,
      user: null,
      client: null,
      contato: null,
      desContr: null,
      followingStatus: null,
      datBreach: null,
      discount: false,
      valDiscount: null,
      percDiscount: null,
    };

    promise.value = {
      id: null,
      datPrev: null,
      valPrest: null,
      datPayment: null,
      valPayment: null,
      status: null,
      actionId: null,
      createdAt: null,
      updatedAt: null,
      followingStatus: null,
      datBreach: null,
      discount: false,
      valDiscount: null,
      percDiscount: null,
    };

    if (selectedNegociation.value.length > 0) {
      selectedNegociation.value = [];
    }

    if (selectedPromise.value.length > 0) {
      selectedPromise.value = [];
    }

    rightDrawerOpen.value = true;
  } else {
    rightDrawerOpen.value = false;
  }
};

const handleSelectPromise = async (e: any) => {
  selectedPromise.value = e.item;
  if (e.item.length > 0) {
    listPromeseHistories.params.id = e.item[0].id;
    await listPromeseHistories.execute();
    promiseHistories.value = toRaw(
      listPromeseHistories.data.value as Array<any>
    );
    promise.value = toRaw(e.item[0]);

    invoice.value = {
      client: null,
      contato: null,
      createdAt: null,
      datPayment: null,
      datPrest: null,
      desContr: null,
      id: null,
      idNegotiation: null,
      negotiationOfPaymentId: null,
      status: null,
      updatedAt: null,
      user: null,
      userId: null,
      valPayment: null,
      valPrest: null,
      followingStatus: null,
      datBreach: null,
    };

    negociation.value = {
      id: null,
      idNegotiation: null,
      valOriginal: null,
      valTotalPrest: null,
      valEntra: null,
      numVezes: null,
      valPrest: null,
      datEntra: null,
      datPrest: null,
      datEntraPayment: null,
      valEntraPayment: null,
      status: null,
      actionId: null,
      createdAt: "null",
      updatedAt: "null",
      datPayment: null,
      valPayment: null,
      userId: null,
      user: null,
      client: null,
      contato: null,
      desContr: null,
      followingStatus: null,
      datBreach: null,
      discount: false,
      valDiscount: null,
      percDiscount: null,
    };

    if (selectedNegociation.value.length > 0) {
      selectedNegociation.value = [];
    }

    if (selectedInvoice.value.length > 0) {
      selectedInvoice.value = [];
    }

    rightDrawerOpen.value = true;
  } else {
    rightDrawerOpen.value = false;
  }
};

const handleChangePaginateNegotiation = async (e: any) => {
  listNegotiation.params.query.page = e.pagination.page;
  listNegotiation.params.query.perPage = e.pagination.rowsPerPage;
  listNegotiation.params.query.orderBy = e.pagination.sortBy;
  listNegotiation.params.query.descending = e.pagination.descending;

  if (e.userId) {
    listNegotiation.params.query.userId = e.userId;
  } else {
    listNegotiation.params.query.userId = null;
  }

  if (e.searchDate && e.searchDate.start != null && e.searchDate.end != null) {
    listNegotiation.params.query.startDate = e.searchDate.start;
    listNegotiation.params.query.endDate = e.searchDate.end;
  } else {
    listNegotiation.params.query.startDate = null;
    listNegotiation.params.query.endDate = null;
  }

  if (
    e.searchDateCreate &&
    e.searchDateCreate.start != null &&
    e.searchDateCreate.end != null
  ) {
    listNegotiation.params.query.startDateCreate = e.searchDateCreate.start;
    listNegotiation.params.query.endDateCreate = e.searchDateCreate.end;
  } else {
    listNegotiation.params.query.startDateCreate = null;
    listNegotiation.params.query.endDateCreate = null;
  }

  listNegotiation.params.query.discount = e.discount;

  await listNegotiation.refresh();

  negotiationRows.value = listNegotiation.data.value?.data;
  negotiationMeta.value = listNegotiation.data.value?.meta;
};

const handleChangePaginateInvoice = async (e: any) => {
  listInvoices.params.query.page = e.pagination.page;
  listInvoices.params.query.perPage = e.pagination.rowsPerPage;
  listInvoices.params.query.orderBy = e.pagination.sortBy;
  listInvoices.params.query.descending = e.pagination.descending;

  if (e.userId) {
    listInvoices.params.query.userId = e.userId;
  } else {
    listInvoices.params.query.userId = null;
  }

  if (e.searchDate && e.searchDate.start != null && e.searchDate.end != null) {
    listInvoices.params.query.startDate = e.searchDate.start;
    listInvoices.params.query.endDate = e.searchDate.end;
  } else {
    listInvoices.params.query.startDate = null;
    listInvoices.params.query.endDate = null;
  }

  if (
    e.searchDateCreate &&
    e.searchDateCreate.start != null &&
    e.searchDateCreate.end != null
  ) {
    listInvoices.params.query.startDateCreate = e.searchDateCreate.start;
    listInvoices.params.query.endDateCreate = e.searchDateCreate.end;
  } else {
    listInvoices.params.query.startDateCreate = null;
    listInvoices.params.query.endDateCreate = null;
  }

  await listInvoices.refresh();
  invoiceRows.value = listInvoices.data.value?.data;
  invoiceMeta.value = listInvoices.data.value?.meta;
};

const handleChangePaginatePromise = async (e: any) => {
  listPromises.params.query.page = e.pagination.page;
  listPromises.params.query.perPage = e.pagination.rowsPerPage;
  listPromises.params.query.orderBy = e.pagination.sortBy;
  listPromises.params.query.descending = e.pagination.descending;

  if (e.userId) {
    listPromises.params.query.userId = e.userId;
  } else {
    listPromises.params.query.userId = null;
  }

  if (e.searchDate && e.searchDate.start != null && e.searchDate.end != null) {
    listPromises.params.query.startDate = e.searchDate.start;
    listPromises.params.query.endDate = e.searchDate.end;
  } else {
    listPromises.params.query.startDate = null;
    listPromises.params.query.endDate = null;
  }

  if (
    e.searchDateCreate &&
    e.searchDateCreate.start != null &&
    e.searchDateCreate.end != null
  ) {
    listNegotiation.params.query.startDateCreate = e.searchDateCreate.start;
    listNegotiation.params.query.endDateCreate = e.searchDateCreate.end;
  } else {
    listNegotiation.params.query.startDateCreate = null;
    listNegotiation.params.query.endDateCreate = null;
  }

  listNegotiation.params.query.discount = e.discount;

  await listPromises.refresh();
  promiseRows.value = listPromises.data.value?.data;
  promiseMeta.value = listPromises.data.value?.meta;
};

const handleUpdateNegociation = async (e: any) => {
  await updateNegotiation(e);
  await listNegotiationHistories.refresh();
  await listNegotiation.refresh();
  negotiationRows.value = listNegotiation.data.value?.data;
  negotiationMeta.value = listNegotiation.data.value?.meta;
  negociationHistories.value = toRaw(
    listNegotiationHistories.data.value as Array<any>
  );
};

const handleUpdateInvoice = async (e: any) => {
  await updateInvoice(e);
  await listInvoiceHistories.refresh();
  await listInvoices.refresh();
  invoiceRows.value = listInvoices.data.value?.data;
  invoiceMeta.value = listInvoices.data.value?.meta;
  invoiceHistories.value = toRaw(listInvoiceHistories.data.value as Array<any>);
};

const handleUpdatePromise = async (e: any) => {
  await updatePromise(e);
  await listPromeseHistories.refresh();
  await listPromises.refresh();
  promiseRows.value = listPromises.data.value?.data;
  promiseMeta.value = listPromises.data.value?.meta;
  promiseHistories.value = toRaw(listPromeseHistories.data.value as Array<any>);
};

const handleChangeStatus = async (e: boolean) => {
  listOperator.params.query.status = e;
  listOperator.refresh();
};
</script>

<style scoped></style>

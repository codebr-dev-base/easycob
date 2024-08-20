<template>
  <q-page padding>
    <article class="row">
      <section class="col-12 col-sm-4 col-md-3">
        <article>
          <section class="q-pa-md">
            <OperatorClientCard
              :client="client.data"
              :type-action="typeAction"
              :actions="actions.data.value"
              @update:client="handleUpdateClient"
              @create:action="handleCreateAction"
              @show:history="handleShowHistory"
            />
          </section>
          <div class="q-pa-md">
            <div class="q-gutter-y-md">
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
                  <q-tab name="phones" label="Telefones" />
                  <q-tab name="mails" label="E-mail" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="phones" class="q-pa-none">
                    <OperatorContactTablePhone
                      :rows="contacts.data.value?.phones"
                      :clientId="clientId"
                      v-model:selected="selectedContact"
                      @update:contact="handleUpdateContact"
                      @create:contact="handleCreateContact"
                    />
                  </q-tab-panel>

                  <q-tab-panel name="mails" class="q-pa-none">
                    <OperatorContactTableEmail
                      :rows="contacts.data.value?.emails"
                      :clientId="clientId"
                      v-model:selected="selectedContact"
                      @update:contact="handleUpdateContact"
                      @create:contact="handleCreateContact"
                      @send:mail="handleSendMail"
                    />
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </div>
          </div>
        </article>
      </section>
      <section class="col-12 col-sm-8 col-md-9">
        <OperatorContractTable
          :rows="contractRows"
          :meta="contractMeta"
          :pending="contacts.pending.value"
          @request="handleChangePaginate"
          @select:contract="handleSelectContract"
          @change:status="handleChangeStatusContract"
          @edit:action="handleEditAction"
        />
        <OperatorInvoiceTable :rows="invoiceRows" :status="statusFilter" />
      </section>
    </article>
    <q-dialog v-model="showAlert">
      <q-card style="width: 60vw" class="bg-grey-4">
        <q-card-section class="text-h5">
          <q-chip size="30px">
            <q-avatar color="red" text-color="white" icon="warning" />
            Alerta!
          </q-chip>
        </q-card-section>

        <q-card-section
          class="q-pt-none text-red text-bold text-h6 text-center"
        >
          {{ mensagemAlert }}!
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <OperatorActionFormSimple
      v-model:show-form="showSimple"
      :action="selectTypeAction"
      :client="client.data"
      :contracts="selectContracts"
      :contacts="selectedContact"
      @confirmed:action="handleConfirmedAction"
    />
    <OperatorActionFormPromise
      v-model:show-form="showPromise"
      :action="selectTypeAction"
      :client="client.data"
      :contracts="selectContracts"
      :contacts="selectedContact"
      @confirmed:action="handleConfirmedAction"
    />
    <OperatorActionFormNegotiation
      v-model:show-form="showNegotiation"
      :action="selectTypeAction"
      :client="client.data"
      :contracts="selectContracts"
      :contacts="selectedContact"
      @confirmed:action="handleConfirmedAction"
    />
  </q-page>
  <OperatorActionHistory
    v-model:show-form="showActionHistory"
    :client="client.data"
    :actions="actions.data.value"
  />
  <OperatorActionDialogNegotiation
    v-model:show-form="showDialogAction"
    :action="selectAction"
    @update:negotiation="handleUpdateNegotiation"
  />

  <q-dialog v-model="alertDouble">
    <q-card>
      <q-card-section>
        <div class="text-h6">Alerta: Registro Duplicado</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p>Ola!</p>
        <p>
          Este é um aviso para informar que detectamos um registro duplicado em
          nosso sistema. O registro em questão foi inserido nas últimas 30
          minutos. Pedimos desculpas pelo inconveniente causado.
        </p>
        <p>
          Por favor, revise suas entradas recentes e verifique se houve algum
          erro durante o processo de inserção. Caso necessário, corrija o
          registro duplicado para garantir a precisão e integridade dos dados.
          Deseja realmente salvar?
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Sim"
          color="green"
          v-close-popup
          @click="handleConfirmedActionDouble"
        />
        <q-btn
          label="Cancel"
          color="red"
          v-close-popup
          @click="handleCancelActionDouble"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { ErrosT, ErrosFieldT } from "@/types/erros";
import { ActionT } from "@/types/action";
</script>

<script lang="ts" setup>
definePageMeta({ middleware: "auth" });
const $q = useQuasar();
const route = useRoute();
const clientId = <string>route.params.id;
const { updateClient, getClient, sendMail } = useClient();
const { getContacts, createContact, updateContact } = useContact();
const { getContracts } = useContract();
const { getInvoices } = useInvoice();
const { getTypeAction } = useTypeAction();
const { createAction, getActionsByClient } = useAction();
const { confirmationNegotiation } = useNegotiation();
const client = await getClient(clientId);
const contacts = await getContacts(clientId);
const contracts = await getContracts(clientId);

const actions = await getActionsByClient(clientId);
//const actions = { data: ref([]) };
let invoices: any = undefined;
const invoiceRows = ref([]);
const statusFilter = ref("ATIVO");
const { data: typeAction } = await getTypeAction();
const selectContracts = ref<any[]>([]);
let selectTypeAction: any = null;
const showAlert = ref(false);
const showSimple = ref(false);
const showPromise = ref(false);
const showNegotiation = ref(false);
const mensagemAlert = ref("");
const selectedContact = ref([]);
const showActionHistory = ref(false);
const showDialogAction = ref(false);
let selectAction: any = null;
const tab = ref("phones");
let actionDouble: any[] = [];
const alertDouble = ref(false);

const contractRows = ref(contracts.data.value?.data);
const contractMeta = ref(contracts.data.value?.meta);

const handleChangePaginate = async (e: any) => {
  contracts.params.query.status = e.pagination.status;
  contracts.params.query.page = e.pagination.page;
  contracts.params.query.perPage = e.pagination.rowsPerPage;
  contracts.params.query.orderBy = e.pagination.sortBy;
  contracts.params.query.descending = e.pagination.descending;

  await contracts.refresh();

  contractRows.value = contracts.data.value?.data;
  contractMeta.value = contracts.data.value?.meta;
};
//Tratamento de eventos
const handleUpdateClient = async (client: any) => {
  const responseUpdateClient = await updateClient(client);
  if (responseUpdateClient.error.value) {
    const errors = responseUpdateClient.error.value.data.messages.errors;

    errors.forEach((error: ErrosFieldT) => {
      $q.notify({
        message: error.message,
        type: "warning",
      });
    });
  } else {
    $q.notify({
      message: "Cliente Atualizado!",
      color: "green",
      type: "positive",
    });
  }
};

const handleUpdateContact = async (contact: any) => {
  const responseUpdateContact = await updateContact(contact);
  if (responseUpdateContact.error.value) {
    const errors = responseUpdateContact.error.value.data.messages.errors;

    errors.forEach((error: ErrosFieldT) => {
      $q.notify({
        message: error.message,
        type: "warning",
      });
    });
  } else {
    $q.notify({
      message: "Contato Atualizado!",
      color: "green",
      type: "positive",
    });
    await contacts.refresh();
  }
};

const handleCreateContact = async (contact: any) => {
  const responseCreateContact = await createContact(contact);
  if (responseCreateContact.error.value) {
    const errors = responseCreateContact.error.value.data.messages.errors;

    errors.forEach((error: ErrosFieldT) => {
      $q.notify({
        message: error.message,
        type: "warning",
      });
    });
  } else {
    $q.notify({
      message: "Contato Atualizado!",
      color: "green",
      type: "positive",
    });
    await contacts.refresh();
  }
};

const handleSelectContract = async (contracts: any[]) => {
  const listNumberContracts: any[] | undefined = [];
  invoiceRows.value = [];
  selectContracts.value = [];

  selectContracts.value = toRaw(contracts);

  if (contracts.length > 0) {
    await contracts.forEach((contract) => {
      listNumberContracts.push(contract.desContr);
    });
    if (!invoices) {
      invoices = await getInvoices(
        clientId,
        Array.from(new Set(listNumberContracts))
      );
    } else {
      invoices.params.query.desContr = Array.from(new Set(listNumberContracts));
      await invoices.refresh();
    }
    invoiceRows.value = <never[]>toRaw(invoices.data.value);
  }
};

const handleChangeStatusContract = async (status: string) => {
  contracts.params.query.status = status;
  statusFilter.value = status;
  contracts.refresh();

  contractRows.value = contracts.data.value?.data;
  contractMeta.value = contracts.data.value?.meta;
};

const checkCpc = () => {
  for (const phone of <any[]>contacts.data.value?.phones) {
    console.log(phone.cpc);
    if (phone.cpc) {
      return true;
    }
  }
  return false;
};

const handleCreateAction = async (typeAction: any) => {
  if (typeAction.value == null) {
    showAlert.value = true;
    mensagemAlert.value = "Você não selecionou um Acionamento";
    return;
  }
  if (selectContracts.value.length < 1) {
    showAlert.value = true;
    mensagemAlert.value = "Você não selecionou nem um contrato";
    return;
  }
  if (selectedContact.value.length < 1) {
    showAlert.value = true;
    mensagemAlert.value = "Você não selecionou nem um contato";
    return;
  }

  if (typeAction.value.commissioned > 1) {
    if (!checkCpc()) {
      showAlert.value = true;
      mensagemAlert.value = "Você não selecionou nem um contato como CPC";
      return;
    }
  }

  if (typeAction.value.type === "simple") {
    selectTypeAction = typeAction;
    showSimple.value = true;
  }

  if (typeAction.value.type === "promise") {
    if (selectContracts.value.length > 1) {
      showAlert.value = true;
      mensagemAlert.value =
        "Você só pode selecionar um contrato para este acionamento";
      return;
    }
    selectTypeAction = typeAction;
    showPromise.value = true;
  }

  if (typeAction.value.type === "negotiation") {
    if (selectContracts.value.length > 1) {
      showAlert.value = true;
      mensagemAlert.value =
        "Você só pode selecionar um contrato para este acionamento";
      return;
    }
    selectTypeAction = typeAction;
    showNegotiation.value = true;
  }
};

const handleConfirmedAction = async (actionsArray: any[]) => {
  showSimple.value = false;
  showPromise.value = false;
  showNegotiation.value = false;

  for (const action of actionsArray) {
    action.dayLate = action?.datVenci ? calcDaylate(action?.datVenci) : "";

    const responseAction = await createAction(action);
    if (responseAction.error.value) {
      const errors = responseAction.error.value.data.messages.errors;

      for (const error of errors) {
        $q.notify({
          message: error.message,
          type: "warning",
        });

        if (error.double) {
          actionDouble.push({ ...error.payload, double: error.double });
        }
      }

      if (actionDouble.length > 0) {
        alertDouble.value = true;
      }
    } else {
      $q.notify({
        message: "Acionamento salvo!",
        color: "green",
        type: "positive",
      });
      await actions.refresh();
      await contacts.refresh();
    }
  }

  selectContracts.value = [];
};

const calcDaylate = (datVenci: string) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const date = new Date(new Date(datVenci).setHours(24, 0, 0, 0));
  return Math.round((today.getTime() - date.getTime()) / (1000 * 3600 * 24));
};

const handleShowHistory = () => {
  showActionHistory.value = true;
};

const handleEditAction = (action: ActionT) => {
  selectAction = { ...action };
  showDialogAction.value = true;
};

const handleUpdateNegotiation = async (negotiation: any) => {
  await confirmationNegotiation(negotiation);
};

const handleSendMail = async (mail: any) => {
  await sendMail(mail);
};

const handleConfirmedActionDouble = async () => {
  if (actionDouble.length > 0) {
    await handleConfirmedAction(actionDouble);
  }
  actionDouble = [];
};

const handleCancelActionDouble = async () => {
  actionDouble = [];
};
</script>

<style></style>

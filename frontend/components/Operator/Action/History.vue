<template>
  <q-dialog v-model="showForm" position="right">
    <q-card style="width: 60vw; max-width: 80vw; height: 90vh">
      <q-card-section>
        <q-timeline color="secondary">
          <q-timeline-entry>
            <template v-slot:title>
              {{ clientModel.nomClien }} : {{ clientModel.desRegis }}
            </template>
            <template v-slot:subtitle> Histórico de Acionamento </template>
          </q-timeline-entry>

          <q-timeline-entry
            v-for="action in actions"
            :key="action.id"
            :color="setColor(action.typeAction)"
            :icon="setIcon(action.typeAction)"
          >
            <template v-slot:title>
              {{ action.typeAction?.abbreviation }} -
              {{ action.typeAction?.name }} : {{ action?.desContr }}
            </template>
            <template v-slot:subtitle>
              {{ formatDateAction(action.createdAt) }},
              <span class="text-weight-light text-dark text-overline"
                >por {{ action.user?.name }}</span
              >
            </template>

            <q-item v-if="action.dayLate">
              <q-item-section>
                <q-item-label>Dias em atraso</q-item-label>
                <q-item-label caption lines="2">
                  {{ action.dayLate }}
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-icon name="calendar_month" color="orange-10" />
              </q-item-section>
            </q-item>

            <q-separator spaced inset />

            <q-item v-if="action.valPrinc">
              <q-item-section>
                <q-item-label>Valor original</q-item-label>
                <q-item-label caption lines="2">
                  {{
                    action.valPrinc.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }}
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-icon name="paid" color="yellow" />
              </q-item-section>
            </q-item>

            <q-separator spaced inset />

            <div v-if="action.typeAction?.type === 'promise'"></div>
            <q-list
              dense
              padding
              v-for="item in action.promises"
              :key="item.id"
            >
              <q-item>
                <q-item-section>
                  <q-item-label>Negociação com desconto?</q-item-label>
                  <q-item-label
                    caption
                    lines="2"
                    class="text-weight-bold text-green"
                  >
                    <span>{{ item.discount ? "Sim" : "Não" }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-icon name="paid" color="green" />
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
            </q-list>

            <div v-if="action.typeAction?.type === 'negotiation'">
              <q-list
                dense
                padding
                v-for="item in action.negotiations"
                :key="item.id"
              >
                <q-item>
                  <q-item-section>
                    <q-item-label>Negociação com desconto?</q-item-label>
                    <q-item-label
                      caption
                      lines="2"
                      class="text-weight-bold text-green"
                    >
                      <span>{{ item.discount ? "Sim" : "Não" }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-icon name="paid" color="green" />
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />

                <q-item>
                  <q-item-section>
                    <q-item-label>Valor do débito</q-item-label>
                    <q-item-label caption lines="2">
                      {{
                        item.valOriginal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-icon name="paid" color="yellow" />
                  </q-item-section>
                </q-item>

                <q-separator spaced inset />

                <q-item>
                  <q-item-section>
                    <q-item-label>Total da negociação</q-item-label>
                    <q-item-label caption lines="2">
                      {{
                        item.valTotalPrest.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-icon name="paid" color="yellow" />
                  </q-item-section>
                </q-item>

                <q-separator spaced inset />

                <q-item>
                  <q-item-section>
                    <q-item-label>Data da entrada</q-item-label>
                    <q-item-label caption lines="2">
                      {{ new Date(item.datEntra).toLocaleDateString("pt-BR") }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-icon name="calendar_month" color="orange-10" />
                  </q-item-section>
                </q-item>

                <q-separator spaced inset />

                <q-item>
                  <q-item-section>
                    <q-item-label>Valor da entrada</q-item-label>
                    <q-item-label caption lines="2">
                      {{
                        item.valEntra.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-icon name="paid" color="yellow" />
                  </q-item-section>
                </q-item>

                <q-separator spaced inset />

                <q-item>
                  <q-item-section>
                    <q-table
                      title="Faturas"
                      :rows="item.invoices"
                      :columns="columnsIvoices"
                      row-key="name"
                  /></q-item-section>
                </q-item>

                <q-separator spaced inset />
              </q-list>
            </div>
            <div>
              <div>
                Acionamento {{ action.sync ? "enviado" : "retido" }}
                <div v-if="action.sync">
                  <span
                    :class="
                      JSON.parse(action.resultSync).XML.RETORNO
                        ? 'text-green'
                        : 'text-red'
                    "
                  >
                    {{ JSON.parse(action.resultSync).XML.RETORNOTEXTO }}
                  </span>
                </div>
              </div>
              <div>{{ action.description }}</div>
            </div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { isEmpty, isMax, isMin } from "@/validation/entity";
import { QForm } from "quasar";
import { ClientT } from "@/types/cliente";
import { ActionT } from "@/types/action";
import { formatDateAction } from "~/utils";

const emit = defineEmits(["update:showForm", "update:client"]);
const clientForm = ref<QForm | null>(null);

const props = defineProps({
  showForm: Boolean,
  client: {
    type: Object,
    require: true,
  },
  actions: {
    type: Array<ActionT>,
    default() {
      return [];
    },
  },
});

const showForm = computed({
  get() {
    return props.showForm;
  },
  set(value) {
    emit("update:showForm", value);
  },
});

const clientModel = ref<ClientT>({
  id: null,
  dtUpdate: "",
  datMovto: "",
  codCredorDesRegis: "",
  codCredor: "",
  desRegis: "",
  indAlter: "",
  desCpf: "",
  nomClien: "",
  datNasci: "",
  desEnderResid: "",
  desNumerResid: "",
  desComplResid: "",
  desBairrResid: "",
  desCidadResid: "",
  desEstadResid: "",
  desCepResid: "",
  desFonesResid: "",
  desFonesComer: "",
  codRamalComer: "",
  datRefer: "",
  datExpirPrazo: "",
  datCadasClien: "",
  datAdmis: "",
  desFonesCelul: "",
  desFones1: "",
  desFones2: "",
  desEmail: "",
  descCodMovimento: "",
  status: "",
  desContr: "",
});

watch(
  () => props.showForm,
  (newValue, oldValue) => {
    clientModel.value = <ClientT>{ ...props.client?.value };
  },
  { deep: true }
);

const onSubmit = () => {
  clientForm.value?.validate().then((success) => {
    if (success) {
      emit("update:client", clientModel.value);
    } else {
      // oh no, user has filled in
      // at least one invalid value
    }
  });
};

const columnsIvoices = [
  {
    name: "datPrest",
    label: "Data Prevista",
    field: "datPrest",
    sortable: true,
  },
  {
    name: "valPrest",
    label: "Valor Previsto",
    field: (row: any) => {
      if (row.valPrest) {
        const val = parseFloat(row.valPrest);
        return val.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        return "";
      }
    },
    sortable: true,
  },
  {
    name: "datPayment",
    label: "Data do Pagamento",
    field: "datPayment",
    sortable: true,
  },
  {
    name: "valPayment",
    label: "Valor do Pagamento",
    field: "valPayment",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: (row: any) => {
      row.status ? "Pago" : "";
    },
  },
];
</script>

<style></style>

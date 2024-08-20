import { NegotiationComfirmationT, NegotiationT } from "~/types/negotiation";
import { UserAuthT } from "~/types/user";
import { ErrosT } from "~/types/erros";

const useNegotiation = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/action/negotiation";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getNegotiationsByDate = async (
    startDate: string | null,
    endDate: string | null
  ) => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "10",
        orderBy: "id",
        descending: "false",
        userId: null,
        startDate,
        endDate,
        startDateCreate: null,
        endDateCreate: null,
        discount: false,
        status: false,
      },
    };

    const list = await useAsyncData(
      `${url}${new URLSearchParams(params.query?.toString())}-${
        params.query.userId
      }`,
      () =>
        $fetch<{
          data: any[];
          meta: any;
        }>(`${url}`, params)
    );

    return { ...list, params };
  };

  const confirmationNegotiation = async (payload: NegotiationComfirmationT) => {
    pending.value = true;

    const negotiation = await useFetch<NegotiationT, ErrosT>(
      `${url}/${payload.id}`,
      {
        method: "PATCH",
        body: {
          datEntraPayment: payload.datEntraPayment,
          valEntraPayment: payload.valEntraPayment,
        },
        headers: {
          Authorization: `Bearer ${user.token.token}`,
        },
      }
    );

    pending.value = false;
    return negotiation;
  };

  const updateNegotiation = async (partialNegotiation: any) => {
    const responseUpdate = await useFetch(`${url}/${partialNegotiation.id}`, {
      method: "PUT",
      body: partialNegotiation,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    return responseUpdate;
  };

  const getInvoicesByDate = async (
    startDate: string | null,
    endDate: string | null
  ) => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "10",
        orderBy: "id",
        descending: "false",
        userId: null,
        startDate,
        endDate,
        startDateCreate: null,
        endDateCreate: null,
        status: false,
      },
      async onResponseError(f: any) {
        if (f.response.status === 401) {
          await auth.signOut({ callbackUrl: "/auth/login", redirect: true });
        }
      },
    };

    const list = await useAsyncData(
      `${url}/invoice${new URLSearchParams(params.query?.toString())}-${
        params.query.userId
      }`,
      () =>
        $fetch<{
          data: any[];
          meta: any;
        }>(`${url}/invoice`, params)
    );

    return { ...list, params };
  };

  const updateInvoice = async (partialInvoice: any) => {
    const responseUpdate = await useFetch(
      `${url}/invoice/${partialInvoice.id}`,
      {
        method: "PUT",
        body: partialInvoice,
        headers: {
          Authorization: `Bearer ${user.token.token}`,
        },
      }
    );
    return responseUpdate;
  };

  return {
    confirmationNegotiation,
    getNegotiationsByDate,
    updateNegotiation,
    getInvoicesByDate,
    updateInvoice,
    pending,
  };
};

export default useNegotiation;

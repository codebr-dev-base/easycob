import { NegotiationComfirmationT, NegotiationT } from "~/types/negotiation";
import { UserAuthT } from "~/types/user";
import { ErrosT } from "~/types/erros";

const useLoyal = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/recovery/loyal";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getLoyals = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "20",
        orderBy: "id",
        descending: "false",
        userId: null,
        keyword: "",
        keywordColumn: null,
        faixaTempos: null,
        faixaValores: null,
        faixaTitulos: null,
        faixaClusters: null,
        unidades: null,
        situacoes: null,
        typeActions: null,
        notAction: null,
        startDate: null,
        endDate: null,
      },
      async onResponseError(f: any) {
        if (f.response.status === 401) {
          await auth.signOut({ callbackUrl: "/auth/login", redirect: true });
        }
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

  const getFaixaTempos = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const list = await useFetch<any[] | undefined>(
      `${url}/faixa/tempos`,
      params
    );

    return { ...list, params };
  };

  const getFaixaValores = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const list = await useFetch<any[] | undefined>(
      `${url}/faixa/valores`,
      params
    );

    return { ...list, params };
  };

  const getFaixaTitulos = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const list = await useFetch<any[] | undefined>(
      `${url}/faixa/titulos`,
      params
    );

    return { ...list, params };
  };

  const getFaixaClusters = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const list = await useFetch<any[] | undefined>(
      `${url}/faixa/clusters`,
      params
    );

    return { ...list, params };
  };

  const getUnidades = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const list = await useFetch<any[] | undefined>(`${url}/unidades`, params);

    return { ...list, params };
  };

  const getSituacoes = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const list = await useFetch<any[] | undefined>(`${url}/situacoes`, params);

    return { ...list, params };
  };

  const check = async (id: any) => {
    await useFetch<NegotiationT, ErrosT>(`${url}/unification/check/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
  };

  return {
    getLoyals,
    getFaixaTempos,
    getFaixaTitulos,
    getFaixaValores,
    getFaixaClusters,
    getUnidades,
    check,
    getSituacoes,
  };
};

export default useLoyal;

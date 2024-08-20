import { ActionT } from "~/types/action";
import { UserAuthT } from "~/types/user";
import { ErrosT } from "~/types/erros";

const useAction = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const urn = "/v1/action";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getActionsByClient = async (codCredorDesRegis: string) => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        codCredorDesRegis,
      },
    };

    const list = await useAsyncData(
      `${url}/client${new URLSearchParams(params.query?.toString())}`,
      () => $fetch<ActionT[]>(`${url}/client`, params)
    );

    return { ...list, params };
  };

  const getActions = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "10",
        orderBy: "id",
        descending: "false",
        sync: null,
        keyword: "",
        keywordColumn: null,
        startDate: null,
        endDate: null,
        userId: null,
        typeActionIds: [],
        returnType: null,
      },
      async onResponseError(f: any) {
        if (f.response.status === 401) {
          await auth.signOut({ callbackUrl: "/auth/login", redirect: true });
        }
      },
    };

    const list = await useFetch<{
      data: any[];
      meta: any;
    }>(`${url}`, params);
    return { ...list, params };
  };

  const getLazyActions = async () => {
    let params = {
      lazy: true,
      server: false,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "0",
        orderBy: "id",
        descending: "false",
        sync: null,
        keyword: "",
        keywordColumn: null,
        startDate: null,
        endDate: null,
        userId: null,
        typeActionIds: [],
        returnType: null,
      },
    };

    const list = await useFetch<{
      data: any[];
      meta: any;
    }>(`${url}`, params);
    return { ...list, params };
  };

  const createAction = async (action: any) => {
    const responseCreate = await useFetch(`${url}`, {
      method: "POST",
      body: action,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    return responseCreate;
  };

  const updateAction = async (action: any) => {
    const responseUpdate = await useFetch(`${url}/${action.id}`, {
      method: "PUT",
      body: action,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    return responseUpdate;
  };

  const sendAction = async (id: number) => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const list = await useAsyncData(`${url}/id`, () =>
      $fetch<boolean>(`${url}/send/${id}`, params)
    );

    return { ...list, params };
  };

  const getReturnsTypes = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const list = await useFetch<any[] | undefined>(
      `${url}/returns/types`,
      params
    );

    return { ...list, params };
  };

  const unificationCheck = async (id: any) => {
    await useFetch<ActionT, ErrosT>(`${url}/unification/check/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
  };

  return {
    getLazyActions,
    getReturnsTypes,
    getActionsByClient,
    getActions,
    createAction,
    updateAction,
    sendAction,
    unificationCheck,
  };
};

export default useAction;

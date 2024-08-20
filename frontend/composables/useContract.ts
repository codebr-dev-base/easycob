import { UserAuthT } from "~/types/user";

const useContract = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/recovery/contract";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getContracts = async (
    codCredorDesRegis: string,
    status: string = "ATIVO"
  ) => {
    pending.value = true;

    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "5",
        orderBy: "id",
        descending: "false",
        status,
        codCredorDesRegis,
      },
      async onResponseError(f: any) {
        if (f.response.status === 401) {
          await auth.signOut({ callbackUrl: "/auth/login", redirect: true });
        }
      },
    };

    const list = await useAsyncData(
      `${url}${new URLSearchParams(params.query?.toString())}`,
      () =>
        $fetch<{
          data: any[];
          meta: any;
        }>(`${url}`, params)
    );

    pending.value = false;
    return { ...list, params };
  };

  const createContract = async (contact: any) => {
    pending.value = true;
    const responseCreate = await useFetch(`${url}`, {
      method: "POST",
      body: contact,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    pending.value = false;
    return responseCreate;
  };

  const updateContract = async (contact: any) => {
    pending.value = true;
    const responseUpdate = await useFetch(`${url}/${contact.id}`, {
      method: "PUT",
      body: contact,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    pending.value = false;
    return responseUpdate;
  };

  return {
    getContracts,
    createContract,
    updateContract,
    pending,
  };
};

export default useContract;

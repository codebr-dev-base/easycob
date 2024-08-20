import { UserAuthT } from "~/types/user";

const useClient = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(true);
  const urn = "/v1/recovery/client";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getClients = async () => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "10",
        orderBy: "id",
        descending: "false",
        status: "ATIVO",
        keyword: "",
        keywordColumn: null,
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

    return { ...list, params };
  };

  const getClient = async (id: String | Number | undefined) => {
    const details = await useFetch(`${url}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });

    return details;
  };

  const updateClient = async (client: any) => {
    const responseUpdate = await useFetch(`${url}/${client.id}`, {
      method: "PUT",
      body: client,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    return responseUpdate;
  };

  const sendMail = async (mail: any) => {
    const responseSendMail = await useFetch(`${url}/mail`, {
      method: "POST",
      body: mail,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    return responseSendMail;
  };

  return {
    getClients,
    getClient,
    updateClient,
    pending,
    sendMail,
  };
};

export default useClient;

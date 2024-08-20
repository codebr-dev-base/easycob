import { NegotiationComfirmationT, NegotiationT } from "~/types/negotiation";
import { UserAuthT } from "~/types/user";
import { ErrosT } from "~/types/erros";

const usePromise = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/action/promise";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getPromisesByDate = async (
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

  const updatePromise = async (partialupdatePromise: any) => {
    const responseUpdate = await useFetch(`${url}/${partialupdatePromise.id}`, {
      method: "PUT",
      body: partialupdatePromise,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    return responseUpdate;
  };

  return {
    getPromisesByDate,
    updatePromise,
    pending,
  };
};

export default usePromise;

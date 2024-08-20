import { UserAuthT } from "~/types/user";

const usePromiseHistory = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/action/promise/history";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getLazyPromiseHistories = async () => {
    let params = {
      lazy: true,
      server: false,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      id: 0,
      async onResponseError(f: any) {
        if (f.response.status === 401) {
          await auth.signOut({ callbackUrl: "/auth/login", redirect: true });
        }
      },
    };

    const list = await useAsyncData(`${url}/${params.id}`, () =>
      $fetch(`${url}/${params.id}`, params)
    );

    return { ...list, params };
  };

  return {
    getLazyPromiseHistories,
    pending,
  };
};

export default usePromiseHistory;

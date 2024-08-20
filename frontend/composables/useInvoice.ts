import { UserAuthT } from "~/types/user";

const useInvoice = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/recovery/invoice";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getInvoices = async (codCredorDesRegis: any, desContr: any[] = []) => {
    pending.value = true;

    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        codCredorDesRegis,
        desContr,
      },
      async onResponseError(f: any) {
        if (f.response.status === 401) {
          await auth.signOut({ callbackUrl: "/auth/login", redirect: true });
        }
      },
    };

    const list = await useAsyncData(
      `${url}${new URLSearchParams(params.query?.toString())}`,
      () => $fetch(`${url}`, params)
    );

    pending.value = false;
    return { ...list, params };
  };

  return {
    getInvoices,
    pending,
  };
};

export default useInvoice;

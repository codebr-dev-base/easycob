import { UserAuthT } from "~/types/user";

const useContact = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/recovery/contact";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getContacts = async (codCredorDesRegis: string) => {
    pending.value = true;

    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
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
          phones: any[];
          emails: any[];
        }>(`${url}`, params)
    );

    pending.value = false;
    return { ...list, params };
  };

  const createContact = async (contact: any) => {
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

  const updateContact = async (contact: any) => {
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
    getContacts,
    createContact,
    updateContact,
    pending,
  };
};

export default useContact;

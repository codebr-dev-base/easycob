import { UserAuthT } from "@/types/user";
import { UserT, PasswordT } from "@/types/user";
import { ErrosT } from "@/types/erros";

const useUser = () => {
  const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/user";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const userAuth = <UserAuthT>auth.data.value?.user;

  const getUser = async () => {
    pending.value = true;

    let params = {
      headers: {
        Authorization: `Bearer ${userAuth.token.token}`,
      },
      query: {
        page: "1",
        perPage: "10",
        keyword: "",
        orderBy: "id",
        descending: "true",
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

  const createUser = async (user: UserT) => {
    pending.value = true;
    const responseCreate = await useFetch<UserT, ErrosT>(`${url}`, {
      method: "POST",
      body: user,
      headers: {
        Authorization: `Bearer ${userAuth.token.token}`,
      },
    });
    pending.value = false;
    return responseCreate;
  };

  const updateUser = async (user: UserT) => {
    pending.value = true;
    const responseUpdate = await useFetch<UserT, ErrosT>(`${url}/${user.id}`, {
      method: "PUT",
      body: user,
      headers: {
        Authorization: `Bearer ${userAuth.token.token}`,
      },
    });
    pending.value = false;
    return responseUpdate;
  };

  const disableUser = async (user: any) => {
    pending.value = true;
    const responseDisable = await useFetch<UserT, ErrosT>(`${url}/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userAuth.token.token}`,
      },
    });
    pending.value = false;
    return responseDisable;
  };

  const updatePassword = async (payloadPassword: PasswordT) => {
    pending.value = true;

    const responseUpdatePassword = await useFetch<UserT, ErrosT>(
      `${url}/${payloadPassword.id}`,
      {
        method: "PATCH",
        body: {
          password: payloadPassword.password,
          passwordConfirmation: payloadPassword.passwordConfirmation,
        },
        headers: {
          Authorization: `Bearer ${userAuth.token.token}`,
        },
      }
    );

    pending.value = false;
    return responseUpdatePassword;
  };

  const getUserByModule = async (
    moduleName: string,
    status: boolean | null = null
  ) => {
    pending.value = true;

    let params = {
      headers: {
        Authorization: `Bearer ${userAuth.token.token}`,
      },
      query: {
        status,
      },
      async onResponseError(f: any) {
        if (f.response.status === 401) {
          await auth.signOut({ callbackUrl: "/auth/login", redirect: true });
        }
      },
    };

    const list = await useFetch<any[] | undefined>(
      `${url}/module/${moduleName}`,
      params
    );

    pending.value = false;
    return { ...list, params };
  };

  return {
    getUser,
    createUser,
    updateUser,
    disableUser,
    updatePassword,
    pending,
    getUserByModule,
  };
};

export default useUser;

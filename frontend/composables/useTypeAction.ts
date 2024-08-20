import { UserAuthT } from "~/types/user";

const useTypenAction = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/action/type-action";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getTypeAction = async () => {
    pending.value = true;

    const list = await useFetch<any[] | undefined>(`${url}`, {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });

    pending.value = false;
    return list;
  };

  return {
    getTypeAction,
    pending,
  };
};

export default useTypenAction;

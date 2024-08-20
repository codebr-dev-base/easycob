import { UserAuthT } from "~/types/user";

const useModule = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/user/module/";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const getModules = async () => {
    pending.value = true;

    const modules = await useFetch<any[]>(`${url}`, {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });

    pending.value = false;
    return modules;
  };

  return {
    getModules,
    pending,
  };
};

export default useModule;

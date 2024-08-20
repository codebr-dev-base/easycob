import { UserAuthT } from "~/types/user";
const useAuthentication = () => {
  const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const pending = ref(false);
  const urn = "/v1/auth";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const logOut = async () => {
    pending.value = true;

    let params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const result = await $fetch(`${url}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });

    pending.value = false;
    return result;
  };

  return {
    logOut,
    pending,
  };
};

export default useAuthentication;

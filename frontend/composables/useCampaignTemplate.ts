import { TemplateT } from "~/types/template";
import { UserAuthT } from "~/types/user";

const useTemplate = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const urn = "/v1/campaign/template";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const createTemplate = async (template: any, type: string = "SMS") => {
    const responseCreate = await useFetch(`${url}/${type.toLowerCase()}`, {
      method: "POST",
      body: template,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    return responseCreate;
  };

  const getLazyTemplates = async (type: string = "SMS") => {
    let params = {
      lazy: true,
      server: false,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      async onResponseError(f: any) {
        if (f.response.status === 401) {
          await auth.signOut({ callbackUrl: "/auth/login", redirect: true });
        }
      },
    };

    const list = await useFetch<Ref<Array<TemplateT>> | undefined>(
      `${url}/${type.toLowerCase()}`,
      params
    );
    return { ...list, params };
  };

  const deletTemplate = async (user: any, type: string = "SMS") => {
    const urlType = `${url}/${type.toLowerCase()}`;
    const responseDisable = await useFetch(`${urlType}/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    return responseDisable;
  };
  return {
    createTemplate,
    getLazyTemplates,
    deletTemplate,
  };
};

export default useTemplate;

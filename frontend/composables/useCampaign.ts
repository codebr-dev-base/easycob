import { UserAuthT } from "~/types/user";

const useCampaign = () => {
  // const Auth = useAuth();
  const apiBase = useRuntimeConfig().public.apiBase;
  const urn = "/v1/campaign";
  const url = `${apiBase}${urn}`;

  const auth = useAuth();
  const user = <UserAuthT>auth.data.value?.user;

  const createCampaign = async (campaign: any, type: string = "SMS") => {
    const responseCreate = await useFetch(`${url}`, {
      method: "POST",
      body: campaign,
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    });
    return responseCreate;
  };

  const getCampaigns = async (type: string = "SMS") => {
    let params = {
      options: {
        lazy: true,
        server: false,
      },
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "10",
        orderBy: "id",
        descending: "true",
        keyword: "",
        keywordColumn: null,
        startDate: null,
        endDate: null,
        type,
      },
      async onResponseError(f: any) {
        if (f.response.status === 401) {
          await auth.signOut({ callbackUrl: "/auth/login", redirect: true });
        }
      },
    };

    const list = await useFetch<{
      data: any[];
      meta: any;
    }>(`${url}`, params);
    return { ...list, params };
  };

  const getLazyCampaigns = async (type: string = "SMS") => {
    let params = {
      options: {
        lazy: true,
        server: false,
      },
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "10",
        orderBy: "id",
        descending: "true",
        keyword: "",
        keywordColumn: null,
        startDate: null,
        endDate: null,
        type,
      },
    };

    const list = await useLazyFetch<{
      data: any[];
      meta: any;
    }>(`${url}`, params);
    return { ...list, params };
  };

  const getCampaignLots = async (campaignId: any) => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "10",
        orderBy: "id",
        descending: "true",
        keyword: "",
        keywordColumn: null,
        startDate: null,
        endDate: null,
        campaignId,
      },
    };

    const list = await useFetch<{
      data: any[];
      meta: any;
    }>(`${url}/lot`, params);
    return { ...list, params };
  };

  const getCampaignErrors = async (campaignId: any) => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
      query: {
        page: "1",
        perPage: "10",
        orderBy: "id",
        descending: "true",
        keyword: "",
        keywordColumn: null,
        startDate: null,
        endDate: null,
        campaignId,
      },
    };

    const list = await useFetch<{
      data: any[];
      meta: any;
    }>(`${url}/error`, params);
    return { ...list, params };
  };

  const sendCampaign = async (id: number) => {
    let params = {
      headers: {
        Authorization: `Bearer ${user.token.token}`,
      },
    };

    const list = await useAsyncData(`${url}/id`, () =>
      $fetch<boolean>(`${url}/send/${id}`, params)
    );

    return { ...list, params };
  };

  return {
    createCampaign,
    getCampaigns,
    getLazyCampaigns,
    getCampaignLots,
    sendCampaign,
    getCampaignErrors,
  };
};

export default useCampaign;

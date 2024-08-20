import useAuthorization from "~/composables/useAuthorization";

const getModule = (to: any) => {
  const fullPath = to.fullPath;
  const arrayPath = fullPath.split("/").filter((n: string) => n);
  return arrayPath[0];
};

export default defineNuxtRouteMiddleware((to, from) => {
  try {
    const { checkAuthorizationModule } = useAuthorization();
    if (!checkAuthorizationModule(getModule(to))) {
      abortNavigation();
      return navigateTo("/");
    }
  } catch (error) {
    abortNavigation();
    const { status } = useAuth();
    if (status.value === "authenticated") {
      return navigateTo("/auth/login");
    }

    return navigateTo("/");
  }
});

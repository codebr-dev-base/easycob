const useAuthorization = () => {
  const getModule = () => {
    const fullPath = useRoute().fullPath;
    const arrayPath = fullPath.split("/").filter((n) => n);
    return arrayPath[0];
  };

  const getSkill = () => {
    const auth = toRaw(useAuth().data.value);

    if (!auth || !auth.user || !auth.user.skills) {
      return [];
    }

    const skills = auth.user.skills.map((skill) => {
      return {
        module: skill.module.shortName,
        permission: skill.name,
      };
    });

    return skills;
  };

  const checkAuthorizationPermisson = (permission: string = "full") => {
    let authorization = false;
    try {
      const module = getModule();
      const skills = getSkill();

      for (const skill of skills) {
        if (skill.module === "admin" && skill.permission === permission) {
          authorization = true;
          break;
        }
        if (
          skill.module === "supervisor" &&
          module != "admin" &&
          skill.permission === permission
        ) {
          authorization = true;
          break;
        }
        if (skill.module === module && skill.permission === permission) {
          authorization = true;
          break;
        }
      }

      return authorization;
    } catch (error) {
      return authorization;
    }
  };

  const checkAuthorizationModule = (module: string | null = null) => {
    let authorization = false;

    try {
      if (!module) {
        module = getModule();
      }
      const skills = getSkill();

      for (const skill of skills) {
        if (skill.module === "admin") {
          authorization = true;
          break;
        }
        if (skill.module === "supervisor" && module != "admin") {
          authorization = true;
          break;
        }
        if (skill.module === module) {
          authorization = true;
          break;
        }
      }

      return authorization;
    } catch (error) {
      return authorization;
    }
  };
  return {
    getModule,
    getSkill,
    checkAuthorizationPermisson,
    checkAuthorizationModule,
  };
};

export default useAuthorization;

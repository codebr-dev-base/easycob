import { ModuleOptions } from "nuxt-quasar-ui";

const quasar: ModuleOptions = {
  sassVariables: true,
  plugins: ["Notify"],
  config: {
    notify: {
      position: "top",
    },
  },
  lang: "pt-BR",
  extras: {
    fontIcons: ["fontawesome-v6"],
  },
  /*   config: {
    brand: {
      primary: "#191919",
      secondary: "#26A69A",
      accent: "#9C27B0",

      dark: "#a35200",

      positive: "#21BA45",
      negative: "#C10015",
      info: "#31CCEC",
      warning: "#F2C037",
    },
  }, */
};

export default quasar;

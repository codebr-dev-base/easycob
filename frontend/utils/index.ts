import { exportFile, useQuasar } from "quasar";
const $q = useQuasar();

export const setColor = (actionType: any) => {
  if (actionType.type === "negotiation") {
    return "green";
  }
  if (actionType.type === "promise") {
    return "green";
  }
  if (actionType.type === "simple") {
    if (actionType.commissioned === 1) {
      return "blue-3";
    } else {
      return "grey";
    }
  }
  return "grey";
};

export const setIcon = (actionType: any) => {
  if (actionType.type === "negotiation") {
    return "done_all";
  }
  if (actionType.type === "promise") {
    return "done_all";
  }
  if (actionType.type === "simple") {
    if (actionType.commissioned === 1) {
      return "done";
    } else {
      return "adjust";
    }
  }
  return "adjust";
};

export const wrapCsvValue = (
  val: any,
  formatFn?: (val: any, row: any) => string,
  row?: any
) => {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
};

export const exportTable = (name: string, columns: any[], rows: any[]) => {
  const content = [columns.map((col) => wrapCsvValue(col.label)).join(";")]
    .concat(
      rows.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(";")
      )
    )
    .join("\r\n");
  const today = new Date();
  const status = exportFile(
    `${name}-${today.toISOString()}-export.csv`,
    content,
    {
      mimeType: "text/plain;charset=UTF-8",
      byteOrderMark: "\uFEFF",
      encoding: "utf-8",
    }
  );

  if (status !== true) {
    $q.notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
};

export const changeDatetimeToDate = (val: string) => {
  if (val) {
    const data = new Date(val);
    return data.toISOString().split("T")[0];
  }
};

export const formatDateAction = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long" || "short" || "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",

    /*
    weekday: "long" || "short",

    second: "numeric",
    era: "long" || "short",
    timeZoneName: "long" || "short", */
  };
  return date.toLocaleDateString("pt-BR", options);
};

import * as React from "react";
import { cn } from "@/lib/utils";

// Função para formatar o valor como moeda
const formatCurrency = (
  value: string,
  currency: string,
  locale: string | undefined
): string => {
  const cleanedValue = value.replace(/\D/g, ""); // Remove tudo que não for número
  let numberValue = parseFloat(cleanedValue);

  // Divide o valor por 100 para considerar os centavos
  numberValue = numberValue / 100;

  // Formata o número como uma moeda específica, com o locale opcional
  return new Intl.NumberFormat(locale || undefined, {
    style: "currency",
    currency,
  }).format(isNaN(numberValue) ? 0 : numberValue); // Se for NaN, usa 0 como fallback
};

const formatCurrencyDefaultValue = (
  value: string,
  currency: string,
  locale: string | undefined
): string => {
  let numberValue = parseFloat(value);

  // Formata o número como uma moeda específica, com o locale opcional
  return new Intl.NumberFormat(locale || undefined, {
    style: "currency",
    currency,
  }).format(isNaN(numberValue) ? 0 : numberValue); // Se for NaN, usa 0 como fallback
};

const parseCurrencyToFloat = (value: string): number => {
  // Remove o símbolo da moeda e espaços
  const cleanedValue = value.replace(/[^\d,-]/g, "");

  // Substitui a vírgula por um ponto (separador decimal)
  const normalizedValue = cleanedValue.replace(",", ".");

  // Converte para float
  const floatValue = parseFloat(normalizedValue);

  // Retorna o valor convertido ou 0 se for NaN
  return isNaN(floatValue) ? 0 : floatValue;
};

// Interface para as props do InputCurrency
export interface InputCurrencyProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  currency: string; // Propriedade para definir a moeda (ex: "BRL", "USD")
  locale?: string; // Locale opcional para formatar (ex: "en-US", "de-DE")
}

const InputCurrency = React.forwardRef<HTMLInputElement, InputCurrencyProps>(
  (
    {
      className,
      type = "text",
      defaultValue,
      currency,
      locale,
      onChange,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState<string>("");

    React.useEffect(() => {
      if (defaultValue !== undefined && defaultValue !== null) {
        const formattedValue = formatCurrencyDefaultValue(
          `${defaultValue}`,
          currency,
          locale
        );
        setValue(formattedValue);

        if (onChange) {
          const event = {
            target: {
              value: `${parseCurrencyToFloat(formattedValue)}`,
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>;

          onChange(event);
        }
      }
    }, [defaultValue, currency, locale]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "");
      const formattedValue = formatCurrency(rawValue, currency, locale);

      setValue(formattedValue);

      if (onChange) {
        onChange({
          ...e,
          target: {
            ...e.target,
            value: `${parseCurrencyToFloat(formattedValue)}`,
          },
        });
      }
    };

    return (
      <input
        type={type}
        value={value}
        placeholder="R$ 0" // Placeholder para exibir "R$ 0" quando o valor estiver vazio
        className={cn(
          "w-full px-3 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

InputCurrency.displayName = "InputCurrency";

export { InputCurrency };
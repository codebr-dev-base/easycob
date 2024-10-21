import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  //defaultValue?: string | number | null;
}

const InputMaskCurrency = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", defaultValue, ...props }, ref) => {
    const [value, setValue] = React.useState("R$ 0,00");

    // Função para aplicar a formatação de moeda
    const formatCurrency = (value: string, isUserInput = false): string => {
      const cleanedValue = value.replace(/\D/g, ""); // Remove tudo que não for número
      let numberValue = parseFloat(cleanedValue);

      // Se o valor tiver mais de dois dígitos e foi digitado pelo usuário, dividimos por 100
      if (isUserInput && cleanedValue.length > 2) {
        numberValue = numberValue / 100;
      }

      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(isNaN(numberValue) ? 0 : numberValue); // Formata como moeda brasileira, com fallback para 0
    };

    React.useEffect(() => {
      if (defaultValue !== null && defaultValue !== undefined) {
        let rawValue = "";

        // Verifica se defaultValue é numérico ou uma string numérica
        if (typeof defaultValue === "number" || !isNaN(Number(defaultValue))) {
          rawValue = String(defaultValue); // Convertemos para string
        } else {
          rawValue = defaultValue.toString().replace(/\D/g, ""); // Remove caracteres não numéricos
        }

        const maskedValue = formatCurrency(rawValue, false); // Formata o valor sem dividir por 100
        setValue(maskedValue); // Atualiza o estado com o valor formatado
      } else {
        setValue("R$ 0,00"); // Se defaultValue for null ou undefined, define como R$ 0,00
      }
    }, [defaultValue]);

    // Função que manipula a mudança de valor
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
      const maskedValue = formatCurrency(rawValue, true); // Aplica a formatação de moeda (dividindo por 100)
      setValue(maskedValue); // Atualiza o estado com o valor formatado
    };

    return (
      <input
        type={type}
        value={value}
        className={cn(
          "w-full px-3 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          className
        )}
        ref={ref}
        {...props}
        onChange={handleChange}
      />
    );
  }
);

InputMaskCurrency.displayName = "InputMaskCurrency";

export { InputMaskCurrency };
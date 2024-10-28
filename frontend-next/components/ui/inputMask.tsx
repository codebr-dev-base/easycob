import * as React from "react";
import { cn } from "@/lib/utils";

// Interface para as props do Input
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string; // Adiciona a máscara como propriedade
}

// Ajuste na função de máscara para incluir o símbolo % da máscara
const applyMask = (value: string, mask: string): string => {
  let maskedValue = "";
  let valueIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (valueIndex >= value.length) break;

    // Verifica se é um número ou caractere fixo
    if (mask[i] === "9") {
      if (/\d/.test(value[valueIndex])) {
        maskedValue += value[valueIndex];
        valueIndex++;
      }
    } else {
      maskedValue += mask[i]; // Adiciona o caractere fixo, incluindo '%'
    }
  }

  return maskedValue;
};

// Componente InputMask atualizado
const InputMask = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", defaultValue, mask, onChange, ...props },
    ref
  ) => {
    const [value, setValue] = React.useState<string>("");

    React.useEffect(() => {
      if (defaultValue !== undefined && defaultValue !== null) {
        const rawValue = String(defaultValue).replace(/\D/g, "");
        const maskedValue = applyMask(rawValue, mask);
        setValue(maskedValue);

        if (onChange) {
          const event = {
            target: {
              value: rawValue,
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(event);
        }
      }
    }, [defaultValue, mask]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "");
      const maskedValue = applyMask(rawValue, mask);

      setValue(maskedValue);

      if (onChange) {
        onChange({
          ...e,
          target: {
            ...e.target,
            value: rawValue,
          },
        });
      }
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
        onChange={handleChange}
        {...props}
      />
    );
  }
);

InputMask.displayName = "InputMask";

export { InputMask };
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string; // Propriedade opcional para definir a máscara
  autoValue?: string;
}

const InputMask = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", mask, autoValue, ...props }, ref) => {
    const [value, setValue] = React.useState("");

    // Função para aplicar a máscara à entrada
    const applyMask = (value: string, mask: string): string => {
      let maskedValue = "";
      let valueIndex = 0;

      for (let i = 0; i < mask.length; i++) {
        if (valueIndex >= value.length) break;

        // Verifica se o caractere da máscara é um número ou um caractere fixo
        if (mask[i] === "9") {
          if (/\d/.test(value[valueIndex])) {
            maskedValue += value[valueIndex];
            valueIndex++;
          }
        } else {
          maskedValue += mask[i];
        }
      }

      return maskedValue;
    };

    React.useEffect(() => {
      if (autoValue) {
        const rawValue = autoValue.replace(/\D/g, ""); // Remove tudo que não for número
        const maskedValue = mask ? applyMask(rawValue, mask) : rawValue; // Aplica a máscara
        setValue(maskedValue); // Atualiza o estado com o valor mascarado
      }
    }, [autoValue]);

    // Função que manipula a mudança de valor
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
      const maskedValue = mask ? applyMask(rawValue, mask) : rawValue; // Aplica a máscara
      setValue(maskedValue); // Atualiza o estado com o valor mascarado
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

InputMask.displayName = "InputMask";

export { InputMask };

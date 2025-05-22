import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
const Pausa = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Button>{children}</Button>
    </>
  );
};
export default Pausa;

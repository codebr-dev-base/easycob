import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
const Reinicio = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Button>{children}</Button>
    </>
  );
};
export default Reinicio;

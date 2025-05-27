import { IPausaTactium } from "@/app/(easycob)/interfaces/tactium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPause } from "react-icons/fa";
import { Socket } from "socket.io-client";
const reasonsToPause = [
  "Intervalo",
  "Banheiro",
  "Feedback",
  "Treinamento",
  "Acordo",
  "Pausa sistema",
];

const Pausa = ({socket}: {socket: Socket}) => {
  let selectedReason = "";
  const handleSelectChange = (value) => { 
    selectedReason = value;
    console.log("Motivo selecionado:", selectedReason);
  }

  // Aqui você pode adicionar a lógica para lidar com a mudança de seleção
  const handlePause = (reason) => {
    console.log("Pausando por:", reason);
    // Aqui você pode adicionar a lógica para pausar o sistema
  };

  const pause = async (data: IPausaTactium) => {
    if (!socket) {
      console.error("Socket não está disponível.");
      return;
    }
    if (!selectedReason || selectedReason === "") {
      console.error("Motivo não encontrado.");
      return;
    }
    try {
      socket.emit("pause", { reason: selectedReason });
      console.log("Pausando por:", selectedReason);
      // Aqui você pode adicionar a lógica para pausar o sistema
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon">
          <FaPause />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Motivo</h4>
          </div>
          <div className="flex items-center space-x-2">
            <Select onValueChange={(value) => handleSelectChange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Motivos</SelectLabel>
                  {reasonsToPause.map((reason, index) => (
                    <SelectItem key={index} value={reason}>{reason}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button>Pausar</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default Pausa;

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
import { set } from "date-fns";
import { da } from "date-fns/locale";
import { useState } from "react";
import { FaPause, FaPlay, FaSpinner } from "react-icons/fa";
import { Socket } from "socket.io-client";
const reasonsToPause = [
  "Intervalo",
  "Banheiro",
  "Feedback",
  "Treinamento",
  "Acordo",
  "Pausa sistema",
];

const Pausa = ({
  socket,
  dispositivo,
  isLoading,
  isPause,
}: {
  socket: Socket;
  dispositivo: string;
  isLoading: boolean;
  isPause: boolean;
}) => {
  const [open, setOpen] = useState(false);

  let selectedReason = "";
  const handleSelectChange = (value) => {
    selectedReason = value;
    console.log("Motivo selecionado:", selectedReason);
  };

  const handleOpen = () => {
    if (isPause) {
      handResume();
      return;
    }
    setOpen(!open);
  };

  const handResume = () => {
    if (!socket) {
      console.error("Socket não está disponível.");
      return;
    }
    try {
      socket.emit("resume", {
        dispositivo: dispositivo,
      });
      console.log("Retomando a pausa.");
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePause = () => {
    if (!socket) {
      console.error("Socket não está disponível.");
      return;
    }
    if (!selectedReason || selectedReason === "") {
      console.error("Motivo não encontrado.");
      return;
    }
    try {
      socket.emit("pause", {
        motivo: selectedReason,
        dispositivo: dispositivo,
      });
      console.log("Pausando por:", selectedReason);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          disabled={isLoading}
          onClick={handleOpen}
        >
          {isLoading ? (
            <FaSpinner className="h-6 w-6 animate-spin" />
          ) : !isPause ? (
            <FaPause className="h-6 w-6 text-red-500" />
          ) : (
            <FaPlay className="h-6 w-6 text-green-500" />
          )}
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
                <SelectValue placeholder="Motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Motivos</SelectLabel>
                  {reasonsToPause.map((reason, index) => (
                    <SelectItem key={index} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={() => handlePause()}>Pausar</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default Pausa;

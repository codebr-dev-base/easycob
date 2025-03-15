import { ReactNode, useState } from "react";

interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
}

export default function PopoverForm({ trigger, content }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block w-full">
      <div onClick={() => setIsOpen(!isOpen)} className="min-w-min cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-0 min-w-min bg-white border rounded-lg shadow-lg p-2">
          {content}
        </div>
      )}
    </div>
  );
}
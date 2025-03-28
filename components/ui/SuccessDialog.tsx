// components/ui/SuccessDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
}

export function SuccessDialog({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "Entendido",
}: SuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center sm:justify-center">
          <Button
            type="button"
            className="bg-[#062A5A] hover:bg-[#051d3e] w-full sm:w-auto"
            onClick={onClose}
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

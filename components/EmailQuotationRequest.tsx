// components/EmailQuotationRequest.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface EmailQuotationRequestProps {
  email: string;
  name: string;
  recommendations: any[];
  tipo?: string;
}

export function EmailQuotationRequest({
  email,
  name,
  recommendations,
  tipo,
}: EmailQuotationRequestProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    try {
      setIsSending(true);

      const response = await fetch("/api/recomendaciones/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          recommendations,
          tipo,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Error al enviar la solicitud de cotización"
        );
      }

      toast({
        title: "Solicitud enviada",
        description:
          "La solicitud de cotización ha sido enviada correctamente.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error al enviar email de cotización:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al enviar la solicitud de cotización",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-6">
      <Button
        onClick={handleSendEmail}
        disabled={isSending}
        className="w-full md:w-auto"
      >
        {isSending ? "Enviando..." : "Solicitar cotización"}
      </Button>
      <p className="text-sm text-gray-500 mt-2">
        La solicitud será enviada a Smart Advice, y recibirás una copia en{" "}
        {email}
      </p>
    </div>
  );
}

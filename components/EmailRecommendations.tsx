// components/EmailRecommendations.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle } from "lucide-react";
import { getEffectiveSessionId } from "@/lib/session";

interface EmailRecommendationsProps {
  tipo?: string; // Tipo de recomendación (responsabilidad_civil, danos_materiales, etc.)
}

export default function EmailRecommendations({
  tipo,
}: EmailRecommendationsProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      setErrorMessage("Por favor, completa todos los campos");
      return;
    }

    setIsSending(true);
    setErrorMessage(null);

    try {
      const sessionId = getEffectiveSessionId();

      if (!sessionId) {
        throw new Error("No session ID found");
      }

      const response = await fetch("/api/recomendaciones/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          session_id: sessionId,
          form_type: tipo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al enviar las recomendaciones"
        );
      }

      setIsSuccess(true);
      setEmail("");
      setName("");
    } catch (error) {
      console.error("Error sending recommendations:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Error al enviar las recomendaciones. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Mail className="h-5 w-5 text-[#FB2E25] mr-2" />
        <h3 className="text-lg font-semibold text-[#062A5A]">
          Recibe este asesoramiento por email
        </h3>
      </div>

      {isSuccess ? (
        <div className="bg-green-50 p-4 rounded-md text-center">
          <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
          <h4 className="font-semibold text-green-700 mb-2">
            ¡Enviado correctamente!
          </h4>
          <p className="text-green-600 text-sm">
            Hemos enviado el asesoramiento a tu correo electrónico.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Introduce tu nombre"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="mt-1"
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#062A5A] hover:bg-[#051d3e]"
            disabled={isSending}
          >
            {isSending ? "Enviando..." : "Enviar a mi email"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Al hacer clic en &quot;Enviar a mi email&quot;, aceptas que
            almacenemos tu email para enviarte este asesoramiento.
          </p>
        </form>
      )}
    </div>
  );
}

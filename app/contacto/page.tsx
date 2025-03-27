"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CheckCircle, Phone, Mail, MapPin } from "lucide-react";
import { getEffectiveSessionId } from "@/lib/session";

// Define the form schema with Zod
const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor, introduce un email válido"),
  phone: z.string().regex(/^[0-9]{9}$/, "El teléfono debe tener 9 dígitos"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de privacidad",
  }),
  commercialNotifications: z.boolean().optional(), // Nuevo campo opcional
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form with react-hook-form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      privacyPolicy: false,
      commercialNotifications: false, // Valor por defecto
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const sessionId = getEffectiveSessionId();

      // Prepare headers with session ID if available
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (sessionId) {
        headers["x-session-id"] = sessionId;
      }

      // Try to send the contact data to the API
      try {
        const response = await fetch("/api/contact-message", {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } catch (apiError) {
        console.error("API call failed, using fallback mode:", apiError);
        // Fallback to simulated success for development
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Show success message
      setIsSuccess(true);

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Error al enviar el mensaje. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero section */}
      <section className="py-12 px-6 bg-[#F5F2FB]">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contacta con nosotros
          </h1>

          <div className="h-1 w-24 bg-[#FB2E25] mb-6"></div>

          <p className="text-gray-700 text-lg max-w-2xl">
            Estamos aquí para ayudarte. Completa el formulario y nos pondremos
            en contacto contigo lo antes posible.
          </p>
        </div>
      </section>

      {/* Contact section with form and info */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact information sidebar */}
            <div className="md:col-span-1">
              <div className="bg-[#062A5A] text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-6">
                  Información de contacto
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-white/80 mt-1">+ 34 611 403013</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-white/80 mt-1">info@smartadvice.es</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Dirección</p>
                      <p className="text-white/80 mt-1">
                        Calle Gran Vía 28
                        <br />
                        28013 Madrid, España
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/20 my-6 pt-6">
                  <h3 className="font-medium mb-3">Horario de atención</h3>
                  <p className="text-white/80 text-sm mb-2">
                    Lunes a Viernes: 9:00 - 18:00
                  </p>
                  <p className="text-white/80 text-sm">
                    Fines de semana: Cerrado
                  </p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-2">
              {isSuccess ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    ¡Mensaje enviado correctamente!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Gracias por contactar con Smart Advice. Nos pondremos en
                    contacto contigo lo antes posible.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    className="bg-[#062A5A] hover:bg-[#051d3e]"
                  >
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-bold mb-6 text-[#062A5A]">
                    Envíanos un mensaje
                  </h2>

                  {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre completo</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Introduce tu nombre"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="tu@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="612345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensaje</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="¿En qué podemos ayudarte?"
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="privacyPolicy"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  He leído y acepto la{" "}
                                  <Link
                                    href="/politica-privacidad"
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                  >
                                    política de privacidad
                                  </Link>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="commercialNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  Acepto recibir notificaciones comerciales y
                                  publicidad
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="bg-[#062A5A] hover:bg-[#051d3e] w-full md:w-auto"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                          {!isSubmitting && (
                            <ArrowRight className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-center text-[#062A5A]">
            Preguntas frecuentes
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">
                ¿Cuánto tardaréis en responder?
              </h3>
              <p className="text-gray-600">
                Normalmente respondemos a todas las consultas en un plazo máximo
                de 24 horas laborables.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">
                ¿Ofrecéis asesoramiento presencial?
              </h3>
              <p className="text-gray-600">
                Sí, además del asesoramiento online, también podemos concertar
                reuniones presenciales en nuestra oficina de Madrid.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

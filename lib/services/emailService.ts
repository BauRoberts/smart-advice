// lib/services/emailService.ts
import { DanosInsuranceRecommendation, Coverage } from "@/types";

interface EmailConfig {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  template: string;
  data: any;
  attachment?: any;
}
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Función principal para enviar emails
export async function sendEmail(config: EmailConfig) {
  try {
    console.log("Enviando email con configuración:", {
      to: config.to,
      subject: config.subject,
      template: config.template,
    });

    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error respuesta API email:", response.status, errorText);
      throw new Error(
        `Error al enviar el email: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("Respuesta de la API de email:", result);
    return result;
  } catch (error) {
    console.error("Error en sendEmail:", error);
    throw error;
  }
}

// Formatea un número como moneda
function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "N/A";
  return (
    new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + "€"
  );
}

// Función específica para enviar la cotización de Daños Materiales
// Modificar la función sendDanosRecommendationEmail para enviar solo el email de cliente
export async function sendDanosRecommendationEmail(
  recommendation: DanosInsuranceRecommendation,
  contactEmail: string,
  contactName: string,
  pdfAttachment?: Blob
) {
  try {
    // Preparar datos para el adjunto si existe
    let attachmentData = null;
    if (pdfAttachment) {
      const base64 = await blobToBase64(pdfAttachment);
      attachmentData = {
        filename: `Informe_Seguro_${
          recommendation.companyInfo.name || "Cliente"
        }.pdf`,
        content: base64.split(",")[1], // Eliminar el prefijo "data:application/pdf;base64,"
        encoding: "base64",
        type: "application/pdf",
      };
    }

    // Email para el cliente (con adjunto)
    const clientEmailConfig: EmailConfig = {
      to: [contactEmail],
      subject: "Tu solicitud de seguro de Daños Materiales - Smart Advice",
      template: "danos-cliente",
      data: {
        clientName: contactName,
        recommendation,
        clientEmail: contactEmail,
      },
      attachment: attachmentData,
    };

    // Enviar solo el email del cliente
    const clientResponse = await sendEmail(clientEmailConfig);

    return {
      success: true,
      clientEmail: clientResponse,
    };
  } catch (error) {
    console.error("Error al enviar email de recomendación:", error);
    throw error;
  }
}

// Función auxiliar para obtener el límite de daños eléctricos
function getDanosElectricosLimit(valorEdificio?: number): string {
  if (!valorEdificio) return "30.000€";
  if (valorEdificio >= 1000000) return "100.000€";
  if (valorEdificio >= 500000) return "60.000€";
  return "30.000€";
}

// Función auxiliar para obtener el porcentaje de robo
function getRoboPercentage(capitalesInfo: any): string {
  const totalCapitales =
    (capitalesInfo.valor_edificio || 0) +
    (capitalesInfo.valor_ajuar || 0) +
    (capitalesInfo.valor_existencias || 0);

  return totalCapitales > 1000000 ? "50%" : "25%";
}

// Función para verificar si hay cláusula de todo riesgo accidental
function hasTodoRiesgoAccidental(specialClauses: any[]): boolean {
  return specialClauses.some(
    (c) => c.name === "Cláusula todo riesgo accidental" && c.required
  );
}

// Función para verificar si hay cláusula de leasing
function hasLeasingClause(specialClauses: any[], companyInfo: any): boolean {
  return specialClauses.some(
    (c) => c.name && c.name.includes("Cláusula de Leasing") && c.required
  );
}

// Add type guard helper function
function isCoverage(coverage: Coverage | undefined): coverage is Coverage {
  return coverage !== undefined && "name" in coverage && "limit" in coverage;
}

// Update the generateStyledDanosInternalEmailContent function
export function generateStyledDanosInternalEmailContent(
  recommendation: DanosInsuranceRecommendation
): string {
  const {
    companyInfo,
    constructionInfo,
    protectionInfo,
    capitalesInfo,
    coverages,
    specialClauses,
  } = recommendation;

  // Helper function to safely get coverage details
  const getCoverageDetails = (name: string) => {
    const coverage = coverages.find((c) => c.name === name);
    return isCoverage(coverage) && coverage.required ? coverage : null;
  };

  // Example of safe coverage access
  const averiaMaquinaria = getCoverageDetails("Avería de maquinaria");
  const rcGeneral = getCoverageDetails("Responsabilidad civil general");

  // Update the coverage checks in the template string
  return `
  <div style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f7fb;">
    <div style="max-width: 800px; margin: 0 auto; background-color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #062A5A; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Solicitud de Cotización - Daños Materiales</h1>
      </div>
      <div style="padding: 30px;">
        <div style="background-color: #F5F2FB; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #FB2E25;">
          <p style="margin-bottom: 10px;">Estimados,</p>
          <p style="margin-bottom: 0;">Sirva el presente correo para solicitar cotización de seguro de daños Riesgos Nominados para el cliente de referencia, de acuerdo con la siguiente información:</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="color: #062A5A; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FB2E25; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Información General</div>
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eef1f6;">
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Tomador:</div>
              <div style="flex: 1;">${companyInfo.name || "N/A"}</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">CIF:</div>
              <div style="flex: 1;">${companyInfo.cif || "N/A"}</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Dirección:</div>
              <div style="flex: 1;">${companyInfo.address || "N/A"}</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">CNAE:</div>
              <div style="flex: 1;">${companyInfo.cnae || "N/A"}</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">ACTIVIDAD:</div>
              <div style="flex: 1;">${
                companyInfo.activityDescription || companyInfo.activity || "N/A"
              }</div>
            </div>
            ${
              companyInfo.installations_type === "No propietario" &&
              companyInfo.owner_name
                ? `<div style="height: 1px; background-color: #eef1f6; margin: 15px 0;"></div>
              <div style="margin-bottom: 8px; display: flex;">
                <div style="font-weight: 600; min-width: 180px; color: #062A5A;">ASEGURADO ADICIONAL:</div>
                <div style="flex: 1;">Se hace constar que el Sr. o la empresa ${
                  companyInfo.owner_name
                }, con NIF ${
                    companyInfo.owner_cif || "N/A"
                  }, tendrá el carácter de beneficiario de la Indemnización en su calidad de propietario de las instalaciones.</div>
              </div>`
                : ""
            }
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="color: #062A5A; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FB2E25; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Características Constructivas</div>
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eef1f6;">
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Estructura:</div>
              <div style="flex: 1;">${
                constructionInfo.estructura || "N/A"
              }</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Cubierta:</div>
              <div style="flex: 1;">${constructionInfo.cubierta || "N/A"}</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Cerramientos:</div>
              <div style="flex: 1;">${
                constructionInfo.cerramientos || "N/A"
              }</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">M2:</div>
              <div style="flex: 1;">${companyInfo.m2 || "N/A"} m²</div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="color: #062A5A; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FB2E25; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Protecciones Contra Incendio</div>
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eef1f6;">
            ${
              protectionInfo.extintores ||
              protectionInfo.bocas_incendio ||
              protectionInfo.columnas_hidrantes ||
              protectionInfo.deteccion_automatica ||
              protectionInfo.rociadores ||
              protectionInfo.suministro_agua
                ? `<ul style="list-style-type: none; padding-left: 0; margin: 0;">
                ${
                  protectionInfo.extintores
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>Extintores</div>
                  </li>`
                    : ""
                }
                ${
                  protectionInfo.bocas_incendio
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>Bocas de incendio equipadas (BIE)
                      ${
                        protectionInfo.cobertura_total
                          ? '<span style="display: inline-block; background-color: rgba(251, 46, 37, 0.1); color: #FB2E25; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 10px;">Cobertura total</span>'
                          : ""
                      }
                      ${
                        protectionInfo.deposito_bombeo
                          ? '<span style="display: inline-block; background-color: rgba(251, 46, 37, 0.1); color: #FB2E25; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 10px;">Con depósito propio</span>'
                          : ""
                      }
                    </div>
                  </li>`
                    : ""
                }
                ${
                  protectionInfo.columnas_hidrantes
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>Columnas hidrantes exteriores
                      ${
                        protectionInfo.columnas_hidrantes_tipo
                          ? `<span style="display: inline-block; background-color: rgba(251, 46, 37, 0.1); color: #FB2E25; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 10px;">Sistema ${protectionInfo.columnas_hidrantes_tipo}</span>`
                          : ""
                      }
                    </div>
                  </li>`
                    : ""
                }
                ${
                  protectionInfo.deteccion_automatica
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>Detección automática de incendios
                      ${
                        Array.isArray(protectionInfo.deteccion_zona) &&
                        protectionInfo.deteccion_zona.length > 0
                          ? protectionInfo.deteccion_zona[0] === "totalidad"
                            ? '<span style="display: inline-block; background-color: rgba(251, 46, 37, 0.1); color: #FB2E25; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 10px;">Cobertura total</span>'
                            : `<span style="display: inline-block; background-color: rgba(251, 46, 37, 0.1); color: #FB2E25; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 10px;">${protectionInfo.deteccion_zona.join(
                                ", "
                              )}</span>`
                          : ""
                      }
                    </div>
                  </li>`
                    : ""
                }
                ${
                  protectionInfo.rociadores
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>Rociadores automáticos
                      ${
                        Array.isArray(protectionInfo.rociadores_zona) &&
                        protectionInfo.rociadores_zona.length > 0
                          ? protectionInfo.rociadores_zona[0] === "totalidad"
                            ? '<span style="display: inline-block; background-color: rgba(251, 46, 37, 0.1); color: #FB2E25; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 10px;">Cobertura total</span>'
                            : `<span style="display: inline-block; background-color: rgba(251, 46, 37, 0.1); color: #FB2E25; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 10px;">${protectionInfo.rociadores_zona.join(
                                ", "
                              )}</span>`
                          : ""
                      }
                    </div>
                  </li>`
                    : ""
                }
                ${
                  protectionInfo.suministro_agua
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>Suministro de agua: <span style="color: #FB2E25; font-weight: 600;">${protectionInfo.suministro_agua.replace(
                      "_",
                      " "
                    )}</span></div>
                  </li>`
                    : ""
                }
              </ul>`
                : "<p>No se han indicado protecciones contra incendio</p>"
            }
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="color: #062A5A; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FB2E25; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Protecciones Contra Robo</div>
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eef1f6;">
            ${
              protectionInfo.protecciones_fisicas ||
              protectionInfo.vigilancia_propia ||
              protectionInfo.alarma_conectada ||
              protectionInfo.camaras_circuito
                ? `<ul style="list-style-type: none; padding-left: 0; margin: 0;">
                ${
                  protectionInfo.protecciones_fisicas
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>Protecciones físicas (rejas, cerraduras...)</div>
                  </li>`
                    : ""
                }
                ${
                  protectionInfo.vigilancia_propia
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>El polígono cuenta con vigilancia propia</div>
                  </li>`
                    : ""
                }
                ${
                  protectionInfo.alarma_conectada
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>Alarma de robo conectada a central de alarma</div>
                  </li>`
                    : ""
                }
                ${
                  protectionInfo.camaras_circuito
                    ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                    <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                    <div>Circuito Cerrado de Televisión/Cámaras</div>
                  </li>`
                    : ""
                }
              </ul>`
                : "<p>No se han indicado protecciones contra robo</p>"
            }
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="color: #062A5A; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FB2E25; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Capitales a Asegurar</div>
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eef1f6;">
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Edificio:</div>
              <div style="flex: 1; font-weight: 600; color: #062A5A;">${formatCurrency(
                capitalesInfo.valor_edificio
              )}</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Ajuar industrial:</div>
              <div style="flex: 1; font-weight: 600; color: #062A5A;">${formatCurrency(
                capitalesInfo.valor_ajuar
              )}</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Existencias:</div>
              <div style="flex: 1; font-weight: 600; color: #062A5A;">${formatCurrency(
                capitalesInfo.valor_existencias
              )}</div>
            </div>
            <div style="margin-bottom: 8px; display: flex;">
              <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Equipos informáticos:</div>
              <div style="flex: 1; font-weight: 600; color: #062A5A;">${formatCurrency(
                capitalesInfo.valor_equipo_electronico
              )}</div>
            </div>
            ${
              capitalesInfo.margen_bruto_anual &&
              capitalesInfo.margen_bruto_anual > 0
                ? `<div style="height: 1px; background-color: #eef1f6; margin: 15px 0;"></div>
              <div style="margin-bottom: 8px; display: flex;">
                <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Margen bruto anual:</div>
                <div style="flex: 1; font-weight: 600; color: #062A5A;">${formatCurrency(
                  capitalesInfo.margen_bruto_anual
                )}</div>
              </div>
               ${
                 capitalesInfo.periodo_indemnizacion
                   ? `<div style="margin-bottom: 8px; display: flex;">
                  <div style="font-weight: 600; min-width: 180px; color: #062A5A;">Periodo de indemnización:</div>
                  <div style="flex: 1;"><span style="color: #FB2E25; font-weight: 600;">${capitalesInfo.periodo_indemnizacion} meses</span></div>
                </div>`
                   : ""
               }`
                : ""
            }
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="color: #062A5A; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FB2E25; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Coberturas Solicitadas</div>
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eef1f6;">
            <ul style="list-style-type: none; padding-left: 0; margin: 0;">
              <li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                <div><strong>Coberturas básicas</strong> (Incendio, rayo y explosión): <span style="color: #FB2E25; font-weight: 600;">100% capitales a asegurar</span></div>
              </li>
              <li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                <div><strong>Riesgos extensivos</strong> (lluvia, pedrisco, nieve, humo, etc): <span style="color: #FB2E25; font-weight: 600;">100% capitales a asegurar</span></div>
              </li>
              <li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                <div><strong>Daños por agua:</strong> <span style="color: #FB2E25; font-weight: 600;">100% capitales a asegurar</span></div>
              </li>
              <li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                <div><strong>Daños eléctricos a primer riesgo:</strong> <span style="color: #FB2E25; font-weight: 600;">${getDanosElectricosLimit(
                  capitalesInfo.valor_edificio
                )}</span></div>
              </li>
              <li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                <div><strong>Robo y expoliación:</strong> <span style="color: #FB2E25; font-weight: 600;">${getRoboPercentage(
                  capitalesInfo
                )} de los capitales asegurados</span></div>
              </li>
              <li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                <div><strong>Rotura de cristales:</strong> <span style="color: #FB2E25; font-weight: 600;">6.000€</span></div>
              </li>
              
              ${
                averiaMaquinaria
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Avería de maquinaria:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    averiaMaquinaria.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails("Robo de metálico en caja fuerte")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Robo de metálico en caja fuerte:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    getCoverageDetails("Robo de metálico en caja fuerte")
                      ?.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails("Robo de metálico en mueble cerrado")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Robo de metálico en mueble cerrado:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    getCoverageDetails("Robo de metálico en mueble cerrado")
                      ?.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails("Robo al transportador de fondos")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Robo al transportador de fondos:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    getCoverageDetails("Robo al transportador de fondos")
                      ?.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails(
                  "Bienes de terceros depositados en las instalaciones del asegurado"
                )
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Bienes de terceros depositados en las instalaciones del asegurado:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    getCoverageDetails(
                      "Bienes de terceros depositados en las instalaciones del asegurado"
                    )?.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails(
                  "Bienes propios depositados en casa de terceros"
                )
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Bienes propios depositados en casa de terceros:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    getCoverageDetails(
                      "Bienes propios depositados en casa de terceros"
                    )?.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails(
                  "Bienes depositados a la intemperie o aire libre"
                )
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Bienes depositados a la intemperie o aire libre:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    getCoverageDetails(
                      "Bienes depositados a la intemperie o aire libre"
                    )?.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails("Bienes refrigerados")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div>
                    <strong>Bienes refrigerados:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                      getCoverageDetails("Bienes refrigerados")?.limit || "N/A"
                    }</span>
                    ${
                      getCoverageDetails("Bienes refrigerados")?.condition
                        ? ` (${
                            getCoverageDetails("Bienes refrigerados")?.condition
                          })`
                        : ""
                    }
                  </div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails("Placas fotovoltaicas")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Placas fotovoltaicas:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    getCoverageDetails("Placas fotovoltaicas")?.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails("Vehículos aparcados en instalaciones")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Vehículos aparcados en instalaciones:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    getCoverageDetails("Vehículos aparcados en instalaciones")
                      ?.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails("Bienes de empleados")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Bienes de empleados:</strong> <span style="color: #FB2E25; font-weight: 600;">${
                    getCoverageDetails("Bienes de empleados")?.limit || "N/A"
                  }</span></div>
                </li>`
                  : ""
              }
              
              ${
                rcGeneral
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Responsabilidad civil general:</strong> <span style="color: #FB2E25; font-weight: 600;">600.000€</span></div>
                </li>`
                  : ""
              }
              
              ${
                getCoverageDetails("Responsabilidad civil patronal")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Responsabilidad civil patronal:</strong> <span style="color: #FB2E25; font-weight: 600;">600.000€</span></div>
                </li>
                <li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Sublímite víctima patronal:</strong> <span style="color: #FB2E25; font-weight: 600;">450.000€</span></div>
                </li>`
                  : ""
              }
                
              ${
                getCoverageDetails("Responsabilidad civil por productos")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Responsabilidad civil por productos:</strong> <span style="color: #FB2E25; font-weight: 600;">600.000€</span></div>
                </li>`
                  : ""
              }
                
              ${
                getCoverageDetails("Responsabilidad civil inmobiliaria")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Responsabilidad civil inmobiliaria:</strong> <span style="color: #FB2E25; font-weight: 600;">600.000€</span></div>
                </li>`
                  : ""
              }
                
              ${
                getCoverageDetails("Responsabilidad civil locativa")
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Responsabilidad civil locativa:</strong> <span style="color: #FB2E25; font-weight: 600;">600.000€</span></div>
                </li>`
                  : ""
              }
            </ul>
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="color: #062A5A; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FB2E25; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Franquicias</div>
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eef1f6;">
            <p>GENÉRICAS</p>
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
  <div style="color: #062A5A; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FB2E25; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Siniestralidad</div>
  <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eef1f6;">
    <p>${
      recommendation.siniestralidad ||
      "No se ha registrado información de siniestralidad"
    }</p>
  </div>
</div>
        <div style="margin-bottom: 25px;">
          <div style="color: #062A5A; font-size: 18px; font-weight: 700; border-bottom: 2px solid #FB2E25; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Cláusulas Especiales Solicitadas</div>
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eef1f6;">
            <ul style="list-style-type: none; padding-left: 0; margin: 0;">
              <li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                <div><strong>Cobertura automática para Daños materiales:</strong> <span style="color: #FB2E25; font-weight: 600;">20%</span></div>
              </li>
              ${
                capitalesInfo.margen_bruto_anual &&
                capitalesInfo.margen_bruto_anual > 0
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Cobertura automática para Pérdida de beneficios:</strong> <span style="color: #FB2E25; font-weight: 600;">30%</span></div>
                </li>`
                  : ""
              }
              <li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                <div><strong>Cláusula de Valor de reposición a nuevo</strong></div>
              </li>
              ${
                hasTodoRiesgoAccidental(specialClauses)
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Cláusula todo riesgo accidental</strong></div>
                </li>`
                  : ""
              }
              ${
                hasLeasingClause(specialClauses, companyInfo)
                  ? `<li style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <div style="color: #FB2E25; margin-right: 10px; font-weight: bold;">✓</div>
                  <div><strong>Cláusula de Leasing para ${
                    companyInfo.name || "XXXX"
                  }</strong></div>
                </li>`
                  : ""
              }
            </ul>
          </div>
        </div>
        
        <div style="margin-top: 30px;">
          <p style="margin-bottom: 5px;">Quedamos a la espera de cotización.</p>
          <p style="margin-bottom: 5px;">Saludos,</p>
          <p style="font-weight: 700; color: #062A5A;">SMART ADVICE</p>
        </div>
      </div>
      <div style="background-color: #062A5A; color: white; padding: 20px; text-align: center; font-size: 12px;">
        © ${new Date().getFullYear()} Smart Advice - Todos los derechos reservados
      </div>
    </div>
  </div>
  `;
}

// Función para generar el contenido del email interno en formato texto plano (original)
export function generateDanosInternalEmailContent(
  recommendation: DanosInsuranceRecommendation
): string {
  const {
    companyInfo,
    constructionInfo,
    protectionInfo,
    capitalesInfo,
    coverages,
    specialClauses,
  } = recommendation;

  // Calcular el total de capitales para determinar el porcentaje de robo
  const totalCapitales =
    (capitalesInfo.valor_edificio || 0) +
    (capitalesInfo.valor_ajuar || 0) +
    (capitalesInfo.valor_existencias || 0);

  const roboPercentage = totalCapitales > 1000000 ? "50%" : "25%";

  // Daños eléctricos según el valor del edificio
  let danosElectricosLimit = "30.000€";
  if (
    (capitalesInfo.valor_edificio || 0) >= 500000 &&
    (capitalesInfo.valor_edificio || 0) < 1000000
  ) {
    danosElectricosLimit = "60.000€";
  } else if ((capitalesInfo.valor_edificio || 0) >= 1000000) {
    danosElectricosLimit = "100.000€";
  }

  let emailContent = `
Estimados,

Sirva el presente correo para solicitar cotización de seguro de daños Riesgos Nominados para el cliente de referencia, de acuerdo con la siguiente información:

Tomador: ${companyInfo.name || "N/A"}
CIF: ${companyInfo.cif || "N/A"}
Dirección: ${companyInfo.address || "N/A"}
CNAE: ${companyInfo.cnae || "N/A"}
ACTIVIDAD: ${companyInfo.activityDescription || companyInfo.activity || "N/A"}
`;

  // Agregar información de Asegurado Adicional si no es propietario
  if (
    companyInfo.installations_type === "No propietario" &&
    companyInfo.owner_name
  ) {
    emailContent += `ASEGURADO ADICIONAL: Se hace constar que el Sr. o la empresa ${
      companyInfo.owner_name
    }, con NIF ${
      companyInfo.owner_cif || "N/A"
    }, tendrá el carácter de beneficiario de la Indemnización en su calidad de propietario de las instalaciones.\n`;
  }

  // Características constructivas
  emailContent += `
CARACTERÍSTICAS CONSTRUCTIVAS DEL INMUEBLE
Estructura: ${constructionInfo.estructura || "N/A"}
Cubierta: ${constructionInfo.cubierta || "N/A"}
Cerramientos: ${constructionInfo.cerramientos || "N/A"}
M2: ${companyInfo.m2 || "N/A"} m²

PROTECCIONES CONTRA INCENDIO
`;

  // Protecciones contra incendio
  let hasFireProtection = false;
  if (protectionInfo.extintores) {
    emailContent += "- Extintores\n";
    hasFireProtection = true;
  }
  if (protectionInfo.bocas_incendio) {
    emailContent += "- Bocas de incendio equipadas (BIE)";
    if (protectionInfo.cobertura_total) emailContent += " - Cobertura total";
    if (protectionInfo.deposito_bombeo)
      emailContent += " - Con depósito propio y grupo de bombeo";
    emailContent += "\n";
    hasFireProtection = true;
  }
  if (protectionInfo.columnas_hidrantes) {
    emailContent += "- Columnas hidrantes exteriores";
    if (protectionInfo.columnas_hidrantes_tipo) {
      emailContent += ` - Sistema ${protectionInfo.columnas_hidrantes_tipo}`;
    }
    emailContent += "\n";
    hasFireProtection = true;
  }
  if (protectionInfo.deteccion_automatica) {
    emailContent += "- Detección automática de incendios";
    if (
      Array.isArray(protectionInfo.deteccion_zona) &&
      protectionInfo.deteccion_zona.length > 0
    ) {
      if (protectionInfo.deteccion_zona[0] === "totalidad") {
        emailContent += " - Cobertura total";
      } else {
        emailContent += ` - ${protectionInfo.deteccion_zona.join(", ")}`;
      }
    }
    emailContent += "\n";
    hasFireProtection = true;
  }
  if (protectionInfo.rociadores) {
    emailContent += "- Rociadores automáticos";
    if (
      Array.isArray(protectionInfo.rociadores_zona) &&
      protectionInfo.rociadores_zona.length > 0
    ) {
      if (protectionInfo.rociadores_zona[0] === "totalidad") {
        emailContent += " - Cobertura total";
      } else {
        emailContent += ` - ${protectionInfo.rociadores_zona.join(", ")}`;
      }
    }
    emailContent += "\n";
    hasFireProtection = true;
  }
  if (protectionInfo.suministro_agua) {
    emailContent += `- Suministro de agua: ${protectionInfo.suministro_agua.replace(
      "_",
      " "
    )}\n`;
    hasFireProtection = true;
  }

  if (!hasFireProtection) {
    emailContent += "No se han indicado protecciones contra incendio\n";
  }

  // Protecciones contra robo
  emailContent += `
PROTECCIONES CONTRA ROBO
`;

  let hasTheftProtection = false;
  if (protectionInfo.protecciones_fisicas) {
    emailContent += "- Protecciones físicas (rejas, cerraduras...)\n";
    hasTheftProtection = true;
  }
  if (protectionInfo.vigilancia_propia) {
    emailContent += "- El polígono cuenta con vigilancia propia\n";
    hasTheftProtection = true;
  }
  if (protectionInfo.alarma_conectada) {
    emailContent += "- Alarma de robo conectada a central de alarma\n";
    hasTheftProtection = true;
  }
  if (protectionInfo.camaras_circuito) {
    emailContent += "- Circuito Cerrado de Televisión/Cámaras\n";
    hasTheftProtection = true;
  }

  if (!hasTheftProtection) {
    emailContent += "No se han indicado protecciones contra robo\n";
  }

  // Capitales a asegurar
  emailContent += `
CAPITALES A ASEGURAR
* Edificio: ${formatCurrency(capitalesInfo.valor_edificio)}
* Ajuar industrial: ${formatCurrency(capitalesInfo.valor_ajuar)}
* Existencias: ${formatCurrency(capitalesInfo.valor_existencias)}
* Equipos informáticos: ${formatCurrency(
    capitalesInfo.valor_equipo_electronico
  )}
`;

  if (
    capitalesInfo.margen_bruto_anual &&
    capitalesInfo.margen_bruto_anual > 0
  ) {
    emailContent += `* Margen bruto anual: ${formatCurrency(
      capitalesInfo.margen_bruto_anual
    )}\n`;
    if (capitalesInfo.periodo_indemnizacion) {
      emailContent += `* Periodo de indemnización: ${capitalesInfo.periodo_indemnizacion} meses\n`;
    }
  }

  // Coberturas solicitadas
  emailContent += `
COBERTURAS SOLICITADAS
* Coberturas básicas (Incendio, rayo y explosión) 100% capitales a asegurar
* Riesgos extensivos (lluvia, pedrisco, nieve, humo, etc) 100% capitales a asegurar
* Daños por agua 100% capitales a asegurar
* Daños eléctricos a primer riesgo: ${danosElectricosLimit}
* Robo y expoliación al ${roboPercentage}
* Rotura de cristales 6.000€
`;

  // Verificar si hay coberturas específicas para añadirlas
  const averiaMaquinaria = coverages.find(
    (c) => c.name === "Avería de maquinaria" && c.required
  );
  if (averiaMaquinaria) {
    emailContent += `* Avería de maquinaria: ${
      averiaMaquinaria.limit || "N/A"
    }\n`;
  }

  const roboMetalicoCaja = findCoverage(
    coverages,
    "Robo de metálico en caja fuerte"
  );
  if (roboMetalicoCaja) {
    emailContent += `* Robo de metálico en caja fuerte: ${
      roboMetalicoCaja.limit || "N/A"
    }\n`;
  }

  const roboMetalicoMueble = findCoverage(
    coverages,
    "Robo de metálico en mueble cerrado"
  );
  if (roboMetalicoMueble) {
    emailContent += `* Robo de metálico en mueble cerrado: ${
      roboMetalicoMueble.limit || "N/A"
    }\n`;
  }

  const roboTransportador = findCoverage(
    coverages,
    "Robo al transportador de fondos"
  );
  if (roboTransportador) {
    emailContent += `* Robo al transportador de fondos: ${
      roboTransportador.limit || "N/A"
    }\n`;
  }

  const bienesTerceros = findCoverage(
    coverages,
    "Bienes de terceros depositados en las instalaciones del asegurado"
  );
  if (bienesTerceros) {
    emailContent += `* Bienes de terceros depositados en las instalaciones del asegurado: ${
      bienesTerceros.limit || "N/A"
    }\n`;
  }

  const bienesPropiosTerceros = findCoverage(
    coverages,
    "Bienes propios depositados en casa de terceros"
  );
  if (bienesPropiosTerceros) {
    emailContent += `* Bienes propios depositados en casa de terceros: ${
      bienesPropiosTerceros.limit || "N/A"
    }\n`;
  }

  const bienesIntemperie = findCoverage(
    coverages,
    "Bienes depositados a la intemperie o aire libre"
  );
  if (bienesIntemperie) {
    emailContent += `* Bienes depositados a la intemperie o aire libre: ${
      bienesIntemperie.limit || "N/A"
    }\n`;
  }

  const bienesRefrigerados = findCoverage(coverages, "Bienes refrigerados");
  if (bienesRefrigerados) {
    emailContent += `* Bienes refrigerados: ${
      bienesRefrigerados.limit || "N/A"
    }`;
    if (bienesRefrigerados.condition) {
      emailContent += ` - ${bienesRefrigerados.condition}`;
    }
    emailContent += "\n";
  }

  const placasFotovoltaicas = findCoverage(coverages, "Placas fotovoltaicas");
  if (placasFotovoltaicas) {
    emailContent += `* Placas fotovoltaicas: ${
      placasFotovoltaicas.limit || "N/A"
    }\n`;
  }

  const vehiculosAparcados = findCoverage(
    coverages,
    "Vehículos aparcados en instalaciones"
  );
  if (vehiculosAparcados) {
    emailContent += `* Vehículos aparcados en instalaciones: ${
      vehiculosAparcados.limit || "N/A"
    }\n`;
  }

  const bienesEmpleados = findCoverage(coverages, "Bienes de empleados");
  if (bienesEmpleados) {
    emailContent += `* Bienes de empleados: ${
      bienesEmpleados.limit || "N/A"
    }\n`;
  }

  // Responsabilidad Civil
  const rcGeneral = findCoverage(coverages, "Responsabilidad civil general");
  if (rcGeneral) {
    emailContent += "* Responsabilidad civil general límite 600.000€\n";
  }

  const rcPatronal = findCoverage(coverages, "Responsabilidad civil patronal");
  if (rcPatronal) {
    emailContent += "* Responsabilidad civil patronal 600.000€\n";
    emailContent += "* Sublímite víctima patronal 450.000€\n";
  }

  const rcProductos = findCoverage(
    coverages,
    "Responsabilidad civil por productos"
  );
  if (rcProductos) {
    emailContent += "* Responsabilidad civil por productos 600.000€\n";
  }

  const rcInmobiliaria = findCoverage(
    coverages,
    "Responsabilidad civil inmobiliaria"
  );
  if (rcInmobiliaria) {
    emailContent += "* Responsabilidad civil inmobiliaria 600.000€\n";
  }

  const rcLocativa = findCoverage(coverages, "Responsabilidad civil locativa");
  if (rcLocativa) {
    emailContent += "* Responsabilidad civil locativa 600.000€\n";
  }

  // Franquicias y Siniestralidad
  emailContent += `
FRANQUICIAS: GENÉRICAS

SINIESTRALIDAD: ${
    recommendation.siniestralidad ||
    "No se ha registrado información de siniestralidad"
  }

CLÁUSULAS ESPECIALES SOLICITADAS
`;

  // Cláusula de cobertura automática para Pérdida de beneficios si tiene margen bruto
  if (
    capitalesInfo.margen_bruto_anual &&
    capitalesInfo.margen_bruto_anual > 0
  ) {
    emailContent += "* Cobertura automática para Pérdida de beneficios: 30%\n";
  }

  // Cláusula de valor de reposición a nuevo (siempre)
  emailContent += "* Cláusula de Valor de reposición a nuevo\n";

  // Cláusula todo riesgo accidental
  const todoRiesgo = specialClauses.find(
    (c) => c.name === "Cláusula todo riesgo accidental" && c.required
  );
  if (todoRiesgo) {
    emailContent += "* Cláusula todo riesgo accidental\n";
  }

  // Cláusula de Leasing
  const leasing = specialClauses.find(
    (c) => c.name && c.name.includes("Cláusula de Leasing") && c.required
  );
  if (leasing) {
    emailContent += `* ${leasing.name}`;
    if (leasing.condition) {
      emailContent += `: ${leasing.condition}`;
    }
    emailContent += "\n";
  }

  // Finalización
  emailContent += `
  Quedamos a la espera de cotización.
  
  Saludos
  
  **SMART ADVICE**
  `;

  return emailContent;
}

// Safe findCoverage function
function findCoverage(coverages: Coverage[], name: string): Coverage | null {
  const coverage = coverages.find((c) => c.name === name);
  return coverage && coverage.required ? coverage : null;
}

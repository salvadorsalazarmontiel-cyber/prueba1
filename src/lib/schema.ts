import { z } from "zod";

export const registrationSchema = z.object({
  // Paso 1: Datos Personales
  nombre: z.string()
    .min(2, "El nombre es muy corto")
    .regex(/^[a-zA-Z\sÁÉÍÓÚáéíóúÑñ]+$/, "Solo se permiten letras y espacios"),
  apellidoPaterno: z.string()
    .min(2, "Requerido")
    .regex(/^[a-zA-Z\sÁÉÍÓÚáéíóúÑñ]+$/, "Solo letras y espacios"),
  apellidoMaterno: z.string()
    .min(2, "Requerido")
    .regex(/^[a-zA-Z\sÁÉÍÓÚáéíóúÑñ]+$/, "Solo letras y espacios"),
  fechaNacimiento: z.string()
    .refine((val) => !isNaN(Date.parse(val)), "Fecha inválida"),
  email: z.string().email("Correo electrónico inválido"),
  telefonoContacto: z.string().regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 números"),
  telefonoAlternativo: z.string().regex(/^\d{10}$/, "El teléfono debe tener 10 números").optional().or(z.literal('')),
  esMenor: z.boolean(),
  
  // Datos del tutor (Condicional)
  nombreTutor: z.string().regex(/^[a-zA-Z\sÁÉÍÓÚáéíóúÑñ]+$/, "Solo letras y espacios").optional().or(z.literal('')),
  parentescoTutor: z.string().optional().or(z.literal('')),

  // Paso 3: Dirección de Envío
  calle: z.string().min(2, "La calle es requerida"),
  entreCalles: z.string().optional().or(z.literal('')),
  numeroExterior: z.string().min(1, "Requerido").regex(/^[0-9a-zA-Z\-]+$/, "Formato inválido"),
  numeroInterior: z.string().optional().or(z.literal('')),
  colonia: z.string().min(2, "Requerido"),
  codigoPostal: z.string().regex(/^\d{5}$/, "El Código Postal debe ser exactamente de 5 números"),
  municipio: z.string().min(2, "Requerido"),
  estado: z.string().min(2, "Requerido"),
  referencias: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal('')),

  // Paso 4: Autorizaciones
  aceptaUsoImagen: z.boolean().refine((val) => val === true, "Debe aceptar el uso de imagen"),
  copiaAutorizacion: z.boolean().optional(),
  aceptaUsoProtesis: z.boolean().refine((val) => val === true, "Debe aceptar los términos de uso"),
  comprendeDonacion: z.boolean().refine((val) => val === true, "Debe confirmar que comprende que es donación"),
  apoyoPsicologico: z.boolean().optional(),

  // Paso 5: Información Médica
  tipoAmputacion: z.string().min(2, "Requerido"),
  fechaAmputacion: z.string(),
  ladoAfectado: z.enum(["Izquierdo", "Derecho", "Ambos"]),
  nivelAmputacion: z.string().optional().or(z.literal('')),
  tratamientosPrevios: z.string().optional().or(z.literal('')),
  observacionesAdicionales: z.string().optional().or(z.literal('')),
  tipoProtesis: z.enum(["Estática", "Normales", "Especiales"]),

  // Paso 6: Medidas (en cm)
  longitudMunon: z.coerce.number().min(0.1, "Debe ser mayor a 0"),
  circunferenciaProximal: z.coerce.number().min(0.1, "Debe ser mayor a 0"),
  circunferenciaMedia: z.coerce.number().min(0.1, "Debe ser mayor a 0"),
  circunferenciaDistal: z.coerce.number().min(0.1, "Debe ser mayor a 0"),
  longitudContralateral: z.coerce.number().min(0.1, "Debe ser mayor a 0"),
  circunferenciaContralateral: z.coerce.number().min(0.1, "Debe ser mayor a 0"),
  otrasMedidas: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.esMenor) {
    if (!data.nombreTutor || data.nombreTutor.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El nombre del tutor es requerido si es menor de edad",
        path: ["nombreTutor"],
      });
    }
    if (!data.parentescoTutor || data.parentescoTutor.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El parentesco del tutor es requerido",
        path: ["parentescoTutor"],
      });
    }
  }
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormData } from "@/lib/schema";
import { DropzoneUpload } from "./DropzoneUpload";
import { SignaturePad } from "./SignaturePad";
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Send, Info, Video } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  { id: "Paso 1", name: "Datos Personales" },
  { id: "Paso 2", name: "Documentación" },
  { id: "Paso 3", name: "Dirección de Envío" },
  { id: "Paso 4", name: "Autorizaciones" },
  { id: "Paso 5", name: "Datos Médicos" },
  { id: "Paso 6", name: "Medidas" },
];

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [ineFiles, setIneFiles] = useState<File[]>([]);
  const [medicalFiles, setMedicalFiles] = useState<File[]>([]);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    control,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as any,
    mode: "onChange",
    defaultValues: {
      esMenor: false,
      aceptaUsoImagen: false,
      copiaAutorizacion: false,
      aceptaUsoProtesis: false,
      comprendeDonacion: false,
      apoyoPsicologico: false,
    }
  });

  const esMenor = watch("esMenor");

  const processForm = async (data: RegistrationFormData) => {
    try {
      setIsSubmitting(true);
      if (!signatureData) {
        alert("Por favor, asegúrate de firmar las autorizaciones.");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Enviando...", data, ineFiles, medicalFiles);
      
      // Aquí el código para guardar en Supabase (Perfiles, Solicitudes, Medidas) y Storage.
      // ...
      
      alert("¡Solicitud enviada con éxito! Tu número de folio es: MAN-2024-XXXXX");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  type FieldName = keyof RegistrationFormData;

  const next = async () => {
    let fieldsToValidate: FieldName[] = [];
    
    if (currentStep === 0) {
      fieldsToValidate = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'email', 'telefonoContacto', 'telefonoAlternativo', 'esMenor'];
      if (esMenor) fieldsToValidate.push('nombreTutor', 'parentescoTutor');
    } else if (currentStep === 1) {
      if (ineFiles.length < 2) {
        alert("Debes subir tanto el frente como el reverso de tu INE.");
        return;
      }
    } else if (currentStep === 2) {
      fieldsToValidate = ['calle', 'entreCalles', 'numeroExterior', 'numeroInterior', 'colonia', 'codigoPostal', 'municipio', 'estado', 'referencias'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['aceptaUsoImagen', 'aceptaUsoProtesis', 'comprendeDonacion'];
      if (!signatureData) {
        alert("Por favor, firma antes de continuar.");
        return;
      }
    } else if (currentStep === 4) {
      fieldsToValidate = ['tipoAmputacion', 'fechaAmputacion', 'ladoAfectado', 'nivelAmputacion', 'tratamientosPrevios', 'observacionesAdicionales', 'tipoProtesis'];
      if (medicalFiles.length < 3) {
        alert("Sube al menos 3 fotografías médicas.");
        return;
      }
    }

    const isStepValid = await trigger(fieldsToValidate as FieldName[]);
    if (isStepValid) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <section className="w-full max-w-4xl mx-auto p-5 md:p-8 glass-panel rounded-3xl overflow-hidden relative">
      
      {/* Indicador sutil arriba (opcional, solo decorativo de aero) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 via-teal-300 to-green-300 opacity-50" />

      <form onSubmit={handleSubmit(processForm)} className="space-y-4">
        
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div key="step0" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner">1</span>
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="nombre" className="text-xs text-gray-600">Nombre(s)</Label>
                  <Input id="nombre" className="glass-card bg-white/70" {...register("nombre")} />
                  {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="apellidoPaterno" className="text-xs text-gray-600">Apellido Paterno</Label>
                  <Input id="apellidoPaterno" className="glass-card bg-white/70" {...register("apellidoPaterno")} />
                  {errors.apellidoPaterno && <p className="text-xs text-red-500">{errors.apellidoPaterno.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="apellidoMaterno" className="text-xs text-gray-600">Apellido Materno</Label>
                  <Input id="apellidoMaterno" className="glass-card bg-white/70" {...register("apellidoMaterno")} />
                  {errors.apellidoMaterno && <p className="text-xs text-red-500">{errors.apellidoMaterno.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fechaNacimiento" className="text-xs text-gray-600">Fecha de Nacimiento</Label>
                  <Input id="fechaNacimiento" type="date" className="glass-card bg-white/70" {...register("fechaNacimiento")} />
                  {errors.fechaNacimiento && <p className="text-xs text-red-500">{errors.fechaNacimiento.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs text-gray-600">Correo Electrónico</Label>
                  <Input id="email" type="email" className="glass-card bg-white/70" {...register("email")} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="telefonoContacto" className="text-xs text-gray-600">Teléfono (10 dígitos)</Label>
                  <Input id="telefonoContacto" className="glass-card bg-white/70" {...register("telefonoContacto")} />
                  {errors.telefonoContacto && <p className="text-xs text-red-500">{errors.telefonoContacto.message}</p>}
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 pt-2">
                  <Label className="text-sm font-medium text-gray-700">¿El beneficiario es menor de edad?</Label>
                  <Controller
                    name="esMenor"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={(val) => {
                          field.onChange(val === "true");
                          trigger("esMenor");
                        }}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="r1" />
                          <Label htmlFor="r1">Sí</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="r2" />
                          <Label htmlFor="r2">No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>

              {esMenor && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 bg-blue-50/50 rounded-xl space-y-3 border border-blue-100 shadow-sm mt-2">
                  <h3 className="font-medium text-blue-800 text-sm">Información del Tutor Legal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="nombreTutor" className="text-xs">Nombre del Tutor</Label>
                      <Input id="nombreTutor" className="bg-white/80" {...register("nombreTutor")} />
                      {errors.nombreTutor && <p className="text-xs text-red-500">{errors.nombreTutor.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="parentescoTutor" className="text-xs">Parentesco</Label>
                      <Input id="parentescoTutor" className="bg-white/80" {...register("parentescoTutor")} />
                      {errors.parentescoTutor && <p className="text-xs text-red-500">{errors.parentescoTutor.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div key="step1" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
               <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                 <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner">2</span>
                 Identificación
               </h2>
               <div className="bg-amber-50/70 p-3 rounded-lg text-amber-800 text-xs border border-amber-200/50 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Asegúrate de subir fotos nítidas. Para menores, subir el INE del tutor.
               </div>
               <DropzoneUpload
                 onFilesChange={setIneFiles}
                 maxFiles={2}
                 maxSizeMB={5}
                 label="Frente y Reverso del INE"
                 helperText="Formatos JPG/PNG/PDF. Máximo 5MB."
               />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner">3</span>
                Dirección de Envío
              </h2>
              <div className="bg-green-50/70 p-3 rounded-lg text-green-800 text-xs border border-green-200/50 flex items-center gap-2">
                <Info className="w-4 h-4" /> Envío 100% gratuito a cualquier destino de México.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="calle" className="text-xs text-gray-600">Calle</Label>
                  <Input id="calle" className="glass-card bg-white/70" {...register("calle")} />
                  {errors.calle && <p className="text-xs text-red-500">{errors.calle.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="numeroExterior" className="text-xs text-gray-600">Nº Exterior</Label>
                  <Input id="numeroExterior" className="glass-card bg-white/70" {...register("numeroExterior")} />
                  {errors.numeroExterior && <p className="text-xs text-red-500">{errors.numeroExterior.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="numeroInterior" className="text-xs text-gray-600">Nº Interior</Label>
                  <Input id="numeroInterior" className="glass-card bg-white/70" {...register("numeroInterior")} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="colonia" className="text-xs text-gray-600">Colonia</Label>
                  <Input id="colonia" className="glass-card bg-white/70" {...register("colonia")} />
                  {errors.colonia && <p className="text-xs text-red-500">{errors.colonia.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="codigoPostal" className="text-xs text-gray-600">C.P.</Label>
                  <Input id="codigoPostal" className="glass-card bg-white/70" {...register("codigoPostal")} />
                  {errors.codigoPostal && <p className="text-xs text-red-500">{errors.codigoPostal.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="municipio" className="text-xs text-gray-600">Municipio</Label>
                  <Input id="municipio" className="glass-card bg-white/70" {...register("municipio")} />
                  {errors.municipio && <p className="text-xs text-red-500">{errors.municipio.message}</p>}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="estado" className="text-xs text-gray-600">Estado</Label>
                  <Input id="estado" className="glass-card bg-white/70" {...register("estado")} />
                  {errors.estado && <p className="text-xs text-red-500">{errors.estado.message}</p>}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="referencias" className="text-xs text-gray-600">Referencias Adicionales (Opcional)</Label>
                  <Textarea id="referencias" {...register("referencias")} className="resize-none h-16 glass-card bg-white/70" />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner">4</span>
                Autorizaciones
              </h2>
              
              <div className="space-y-3 bg-white/40 p-4 rounded-xl border border-white/50">
                <h3 className="font-medium text-sm text-gray-800">Uso de Imagen</h3>
                <p className="text-xs text-gray-600">Autorizo a la Fundación a utilizar imágenes para fines de difusión.</p>
                <div className="flex items-center space-x-2">
                  <Controller name="aceptaUsoImagen" control={control} render={({ field }) => (
                    <Checkbox id="aceptaUsoImagen" checked={field.value} onCheckedChange={field.onChange} />
                  )}/>
                  <Label htmlFor="aceptaUsoImagen" className="text-xs cursor-pointer">Acepto los términos</Label>
                </div>
                {errors.aceptaUsoImagen && <p className="text-xs text-red-500">{errors.aceptaUsoImagen.message}</p>}
              </div>

              <div className="space-y-3 bg-white/40 p-4 rounded-xl border border-white/50">
                <h3 className="font-medium text-sm text-gray-800">Uso de Prótesis</h3>
                <p className="text-xs text-gray-600">Acepto utilizar la prótesis según las indicaciones y participar en seguimiento.</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Controller name="aceptaUsoProtesis" control={control} render={({ field }) => (
                    <Checkbox id="aceptaUsoProtesis" checked={field.value} onCheckedChange={field.onChange} />
                  )}/>
                  <Label htmlFor="aceptaUsoProtesis" className="text-xs cursor-pointer">Acepto los términos de uso</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Controller name="comprendeDonacion" control={control} render={({ field }) => (
                    <Checkbox id="comprendeDonacion" checked={field.value} onCheckedChange={field.onChange} />
                  )}/>
                  <Label htmlFor="comprendeDonacion" className="text-xs cursor-pointer">Comprendo que es de donación</Label>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-medium text-sm text-gray-800">Firma Digital</h3>
                <SignaturePad onSave={(data) => setSignatureData(data)} />
                {signatureData && <p className="text-xs text-green-600 font-medium bg-green-50 p-2 rounded inline-block">✅ Firma capturada</p>}
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner">5</span>
                Información Médica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="tipoAmputacion" className="text-xs">Condición médica</Label>
                  <Input id="tipoAmputacion" className="glass-card bg-white/70" {...register("tipoAmputacion")} />
                  {errors.tipoAmputacion && <p className="text-xs text-red-500">{errors.tipoAmputacion.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fechaAmputacion" className="text-xs">Fecha (Aprox.)</Label>
                  <Input id="fechaAmputacion" type="date" className="glass-card bg-white/70" {...register("fechaAmputacion")} />
                  {errors.fechaAmputacion && <p className="text-xs text-red-500">{errors.fechaAmputacion.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Lado afectado</Label>
                  <Controller
                    name="ladoAfectado"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="glass-card bg-white/70">
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Izquierdo">Izquierdo</SelectItem>
                          <SelectItem value="Derecho">Derecho</SelectItem>
                          <SelectItem value="Ambos">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.ladoAfectado && <p className="text-xs text-red-500">{errors.ladoAfectado.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Tipo de Prótesis</Label>
                  <Controller
                    name="tipoProtesis"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="glass-card bg-white/70">
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Estática">Estática</SelectItem>
                          <SelectItem value="Normales">Normal</SelectItem>
                          <SelectItem value="Especiales">Especial</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tipoProtesis && <p className="text-xs text-red-500">{errors.tipoProtesis.message}</p>}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="observacionesAdicionales" className="text-xs">Observaciones</Label>
                  <Textarea id="observacionesAdicionales" {...register("observacionesAdicionales")} className="resize-none h-16 glass-card bg-white/70" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium text-sm mb-2 text-gray-800">Fotos y Video (Requerido)</h3>
                <DropzoneUpload
                  onFilesChange={setMedicalFiles}
                  maxFiles={6}
                  maxSizeMB={10}
                  accept={{
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                    "video/mp4": [".mp4"]
                  }}
                  label="Arrastra tus fotos y videos"
                  helperText="Video corto y 3 fotos de diferentes ángulos. Max 10MB."
                />
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div key="step5" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner">6</span>
                Medidas
              </h2>
              
              <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-blue-50/50 to-teal-50/50">
                <div className="flex-shrink-0 w-full md:w-32 aspect-video bg-gray-900 rounded-lg overflow-hidden relative shadow-md flex items-center justify-center">
                   <div className="absolute inset-0 bg-blue-900 opacity-60"></div>
                   <Video className="text-white opacity-80 w-8 h-8 z-10" />
                </div>
                <div className="text-sm">
                  <h4 className="font-semibold text-gray-800">Tutorial de Medidas</h4>
                  <p className="text-gray-600 text-xs mt-1">Usa cinta métrica flexible y repite la medida dos veces para asegurar precisión. ¿Dudas? Contáctanos.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="longitudMunon" className="text-xs">Long. Muñón</Label>
                  <Input id="longitudMunon" type="number" step="0.1" className="glass-card bg-white/70 text-sm h-8" {...register("longitudMunon")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="circunferenciaProximal" className="text-xs">Circunf. Proximal</Label>
                  <Input id="circunferenciaProximal" type="number" step="0.1" className="glass-card bg-white/70 text-sm h-8" {...register("circunferenciaProximal")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="circunferenciaMedia" className="text-xs">Circunf. Media</Label>
                  <Input id="circunferenciaMedia" type="number" step="0.1" className="glass-card bg-white/70 text-sm h-8" {...register("circunferenciaMedia")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="circunferenciaDistal" className="text-xs">Circunf. Distal</Label>
                  <Input id="circunferenciaDistal" type="number" step="0.1" className="glass-card bg-white/70 text-sm h-8" {...register("circunferenciaDistal")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="longitudContralateral" className="text-xs">Long. Sana</Label>
                  <Input id="longitudContralateral" type="number" step="0.1" className="glass-card bg-white/70 text-sm h-8" {...register("longitudContralateral")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="circunferenciaContralateral" className="text-xs">Circunf. Sana</Label>
                  <Input id="circunferenciaContralateral" type="number" step="0.1" className="glass-card bg-white/70 text-sm h-8" {...register("circunferenciaContralateral")} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stepper Sutil y Controles */}
        <div className="pt-6 mt-4 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Stepper abajo y chiquito */}
          <div className="flex gap-1.5 md:order-2">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${currentStep === idx ? 'w-6 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : currentStep > idx ? 'w-4 bg-teal-400' : 'w-2 bg-gray-300/50'}`}
              />
            ))}
          </div>

          <div className="flex gap-3 md:order-1 w-full md:w-auto justify-between md:justify-start">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0}
              className="flex items-center justify-center gap-1 px-4 py-2 text-sm rounded-lg glass-button disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Atrás
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-5 py-2 text-sm rounded-lg glass-button-primary aero-glow overflow-hidden disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : "Enviar"} <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="flex items-center justify-center gap-1 px-5 py-2 text-sm rounded-lg glass-button-primary aero-glow overflow-hidden"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </form>
    </section>
  );
}

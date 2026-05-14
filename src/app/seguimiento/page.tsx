"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, CheckCircle2, AlertCircle, UploadCloud, Loader2 } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropzoneUpload } from "@/components/DropzoneUpload";

const ESTADOS = [
  "En revisión",
  "Aprobado",
  "Fabricación",
  "Entregado"
];

// Based on user's schema update, the default is "Prótesis solicitada", "En impresión", "En detallando", "Finalizando", "Terminada lista para envío", "En proceso de envío"
const TIMELINE_ESTADOS = [
  "Prótesis solicitada",
  "En impresión",
  "En detallando",
  "Finalizando",
  "Terminada lista para envío",
  "En proceso de envío"
];

export default function SeguimientoPage() {
  const [folio, setFolio] = useState("");
  const [loading, setLoading] = useState(false);
  const [solicitud, setSolicitud] = useState<any>(null);
  const [error, setError] = useState("");

  const [emailAuth, setEmailAuth] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const buscarFolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folio.trim()) return;

    setLoading(true);
    setError("");
    setSolicitud(null);
    setIsAuthenticated(false);

    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('folio', folio.trim())
        .single();

      if (error) {
        setError("No encontramos ninguna solicitud con este folio. Por favor verifica.");
      } else if (data) {
        setSolicitud(data);
      }
    } catch (err) {
      setError("Error al conectar con la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (solicitud && emailAuth.trim().toLowerCase() === solicitud.email?.toLowerCase()) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("El correo no coincide con el registrado en la solicitud.");
    }
  };

  const subirDocumentos = async () => {
    if (newFiles.length === 0) {
      alert("Selecciona al menos un archivo.");
      return;
    }
    setUploading(true);
    try {
      // Logic to upload files to Supabase Storage goes here
      // const uploadPromises = newFiles.map(file => supabase.storage.from('evidencia_medica').upload(...))
      
      // Simular subida y actualizar base de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the record
      await supabase
        .from('solicitudes')
        .update({ requiere_documentos: false, mensaje_admin: null })
        .eq('folio', solicitud.folio);

      alert("Documentos subidos con éxito. ¡Gracias!");
      setSolicitud({ ...solicitud, requiere_documentos: false });
    } catch (err) {
      alert("Hubo un error al subir los documentos.");
    } finally {
      setUploading(false);
    }
  };

  const getStepIndex = (estadoActual: string) => {
    // Si tienen su tabla original, manejamos sus estados
    if (ESTADOS.includes(estadoActual)) {
      return ESTADOS.indexOf(estadoActual);
    }
    // Si tienen los nuevos estados
    return TIMELINE_ESTADOS.indexOf(estadoActual);
  };

  const currentTimeline = TIMELINE_ESTADOS.includes(solicitud?.estado) ? TIMELINE_ESTADOS : ESTADOS;
  const currentStep = solicitud ? getStepIndex(solicitud.estado || solicitud.estatus) : -1;

  return (
    <div className="min-h-screen aero-bg font-sans text-gray-800 p-4 md:p-8">
      <Link href="/" className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium mb-8 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm transition-colors">
        <ChevronLeft className="w-5 h-5" /> Volver al Inicio
      </Link>

      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900 tracking-tight">Rastrea tu Folio</h1>
          <p className="text-gray-600 text-lg">Ingresa tu número de folio para conocer el estatus de tu prótesis.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 md:p-10 rounded-3xl shadow-xl border border-white/80">
          <form onSubmit={buscarFolio} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                value={folio}
                onChange={(e) => setFolio(e.target.value.toUpperCase())}
                placeholder="Ej. MAN-2024-001"
                className="pl-12 h-14 text-lg bg-white/80 border-gray-200 rounded-2xl shadow-sm focus-visible:ring-purple-500 uppercase"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="h-14 px-8 rounded-2xl glass-button-primary aero-glow font-bold text-lg disabled:opacity-70 flex items-center justify-center min-w-[140px]"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Buscar"}
            </button>
          </form>
          
          {error && <p className="mt-4 text-red-500 text-center font-medium">{error}</p>}
        </motion.div>

        <AnimatePresence>
          {solicitud && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              className="glass-panel p-6 md:p-10 rounded-3xl shadow-xl border border-white/80 mt-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8 border-b border-gray-200/50 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-purple-900">Hola, {solicitud.nombre_completo || solicitud.datos_json?.nombre}</h2>
                  <p className="text-gray-500 font-medium">Folio: <span className="text-gray-800">{solicitud.folio}</span></p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-yellow-200">
                  {solicitud.estado || solicitud.estatus || "En revisión"}
                </div>
              </div>

              {/* Timeline Horizontal */}
              <div className="relative pt-6 pb-12">
                <div className="absolute top-10 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                <div 
                  className="absolute top-10 left-0 h-1 bg-gradient-to-r from-purple-500 to-yellow-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(0, (currentStep / (currentTimeline.length - 1)) * 100)}%` }}
                ></div>
                
                <div className="relative flex justify-between">
                  {currentTimeline.map((est, idx) => (
                    <div key={idx} className="flex flex-col items-center relative group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 shadow-sm
                        ${idx <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'}`}>
                        {idx <= currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span className={`absolute top-10 w-24 text-center text-xs font-semibold mt-2
                        ${idx <= currentStep ? 'text-purple-900' : 'text-gray-400'}`}>
                        {est}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección de Requerimientos de Documentos */}
              {solicitud.requiere_documentos && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-3 rounded-full text-red-600 flex-shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-900 mb-1">¡Acción Requerida!</h3>
                      <p className="text-red-700 mb-4">{solicitud.mensaje_admin || "Necesitamos que vuelvas a subir algunos documentos para continuar con tu prótesis."}</p>
                      
                      {!isAuthenticated ? (
                        <form onSubmit={handleAuth} className="flex gap-3 mt-4">
                          <Input 
                            type="email" 
                            value={emailAuth}
                            onChange={(e) => setEmailAuth(e.target.value)}
                            placeholder="Ingresa tu correo de registro para continuar" 
                            className="bg-white"
                            required
                          />
                          <button type="submit" className="px-6 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
                            Validar
                          </button>
                        </form>
                      ) : (
                        <div className="mt-6 space-y-4 animate-in fade-in zoom-in duration-300">
                          <DropzoneUpload 
                            onFilesChange={setNewFiles} 
                            maxFiles={4} 
                            maxSizeMB={10} 
                            label="Sube los documentos requeridos aquí"
                          />
                          <button 
                            onClick={subirDocumentos}
                            disabled={uploading || newFiles.length === 0}
                            className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-purple-700 disabled:opacity-50 transition-colors"
                          >
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UploadCloud className="w-5 h-5" /> Enviar Documentos</>}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

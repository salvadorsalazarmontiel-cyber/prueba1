"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { Lock, FileText, ChevronRight, X, AlertCircle, Save, Loader2, RefreshCw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const ESTADOS = [
  "En revisión",
  "Aprobado",
  "Fabricación",
  "Entregado",
  "Prótesis solicitada",
  "En impresión",
  "En detallando",
  "Finalizando",
  "Terminada lista para envío",
  "En proceso de envío"
];

export default function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedSolicitud, setSelectedSolicitud] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLogged(true);
        fetchSolicitudes();
      }
      setCheckingSession(false);
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert("Correo o contraseña incorrectos");
    } else {
      setIsLogged(true);
      fetchSolicitudes();
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLogged(false);
    setSolicitudes([]);
  };

  const fetchSolicitudes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .order('fecha_registro', { ascending: false });
    
    if (data) setSolicitudes(data);
    setLoading(false);
  };

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await supabase
        .from('solicitudes')
        .update({
          estado: selectedSolicitud.estado,
          requiere_documentos: selectedSolicitud.requiere_documentos,
          mensaje_admin: selectedSolicitud.requiere_documentos ? selectedSolicitud.mensaje_admin : null
        })
        .eq('id', selectedSolicitud.id);
      
      alert("¡Cambios guardados con éxito!");
      fetchSolicitudes();
      setSelectedSolicitud(null);
    } catch (err) {
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen aero-bg flex items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!isLogged) {
    return (
      <div className="min-h-screen aero-bg flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-purple-900 mb-2">Acceso Admin</h1>
          <p className="text-gray-500 text-sm mb-6">Ingresa tus credenciales para gestionar solicitudes.</p>
          <Input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 text-center bg-white/70"
            placeholder="admin@fundacion.org"
            required
          />
          <Input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 text-center bg-white/70"
            placeholder="••••••••"
            required
          />
          <button type="submit" disabled={loginLoading} className="w-full py-3 glass-button-primary rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50">
            {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar al Panel"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar (Sencillo) */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-purple-900">Admin To2</span>
        </div>
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-purple-50 text-purple-700 px-4 py-3 rounded-xl font-medium">
            <FileText className="w-5 h-5" /> Solicitudes
          </a>
        </nav>
        <button onClick={handleLogout} className="text-red-500 text-sm font-semibold hover:underline text-left">Cerrar Sesión</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto h-screen relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Solicitudes y Folios</h1>
          <button onClick={fetchSolicitudes} className="p-2 bg-white border rounded-full hover:bg-gray-50 text-gray-600 shadow-sm" title="Actualizar">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading && solicitudes.length === 0 ? (
            <div className="p-10 text-center text-gray-500">Cargando datos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Folio</th>
                    <th className="px-6 py-4">Beneficiario</th>
                    <th className="px-6 py-4">Estatus Actual</th>
                    <th className="px-6 py-4">Fecha Registro</th>
                    <th className="px-6 py-4">Alerta</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {solicitudes.map(sol => (
                    <tr key={sol.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-purple-900">{sol.folio}</td>
                      <td className="px-6 py-4 text-gray-700">{sol.nombre_completo || sol.datos_json?.nombre}</td>
                      <td className="px-6 py-4">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
                          {sol.estado || "En revisión"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(sol.fecha_registro || new Date()).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-6 py-4 text-red-500">
                        {sol.requiere_documentos && <AlertCircle className="w-5 h-5" />}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedSolicitud({...sol})}
                          className="text-purple-600 font-semibold hover:text-purple-800 flex items-center justify-end gap-1"
                        >
                          Gestionar <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {solicitudes.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No hay solicitudes registradas aún.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Detalle */}
        {selectedSolicitud && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex justify-end">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Folio: {selectedSolicitud.folio}</h2>
                  <p className="text-sm text-gray-500">{selectedSolicitud.nombre_completo || selectedSolicitud.datos_json?.nombre}</p>
                </div>
                <button onClick={() => setSelectedSolicitud(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Controles de Estatus */}
                <form id="updateForm" onSubmit={guardarCambios} className="space-y-6 bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                  <h3 className="font-bold text-purple-900 flex items-center gap-2"><Lock className="w-4 h-4"/> Gestión de Estatus</h3>
                  
                  <div className="space-y-2">
                    <Label className="font-semibold">Actualizar Estatus</Label>
                    <Select 
                      value={selectedSolicitud.estado || ""} 
                      onValueChange={(val) => setSelectedSolicitud({...selectedSolicitud, estado: val})}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecciona un estatus" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADOS.map(est => (
                          <SelectItem key={est} value={est}>{est}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-purple-200/50">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="reqDocs" 
                        checked={selectedSolicitud.requiere_documentos}
                        onCheckedChange={(checked) => setSelectedSolicitud({...selectedSolicitud, requiere_documentos: checked as boolean})}
                      />
                      <Label htmlFor="reqDocs" className="font-semibold cursor-pointer">Requerir nuevos documentos / fotos</Label>
                    </div>

                    {selectedSolicitud.requiere_documentos && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label className="text-xs text-gray-600">Mensaje para el usuario (Aparecerá en su rastreo)</Label>
                        <Textarea 
                          className="bg-white h-24" 
                          placeholder="Ej. La foto médica se ve muy oscura, por favor sube otra con mejor luz."
                          value={selectedSolicitud.mensaje_admin || ""}
                          onChange={(e) => setSelectedSolicitud({...selectedSolicitud, mensaje_admin: e.target.value})}
                        />
                      </div>
                    )}
                  </div>
                </form>

                {/* Info JSON Capturada */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b pb-2">Toda la Información Capturada</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-gray-500 text-xs font-semibold uppercase">Email</span>
                      <p className="font-medium text-gray-900">{selectedSolicitud.email}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500 text-xs font-semibold uppercase">Teléfono</span>
                      <p className="font-medium text-gray-900">{selectedSolicitud.telefono}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500 text-xs font-semibold uppercase">Es Menor</span>
                      <p className="font-medium text-gray-900">{selectedSolicitud.es_menor ? "Sí" : "No"}</p>
                    </div>
                  </div>

                  {/* Renderizar dinámicamente el JSON si existe */}
                  {selectedSolicitud.datos_json && Object.keys(selectedSolicitud.datos_json).length > 0 ? (
                    <div className="bg-gray-50 p-4 rounded-xl text-xs font-mono border border-gray-200 overflow-auto">
                      <pre>{JSON.stringify(selectedSolicitud.datos_json, null, 2)}</pre>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay datos JSON adicionales para esta solicitud.</p>
                  )}
                </div>

              </div>

              <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedSolicitud(null)} className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100">
                  Cancelar
                </button>
                <button form="updateForm" type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-purple-600 text-white font-bold flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar Estatus
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

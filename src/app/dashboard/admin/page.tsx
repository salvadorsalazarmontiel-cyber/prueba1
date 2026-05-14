export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Panel Administrativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Solicitudes</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Pendientes de Revisión</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">56</p>
        </div>
      </div>
      {/* Tabla de solicitudes iría aquí */}
    </div>
  );
}

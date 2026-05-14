export default function BeneficiarioDashboard() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Mi Solicitud</h1>
      <p className="text-gray-600 mb-8">Folio: <span className="font-mono font-bold">MAN-2024-12345</span></p>
      
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Progreso de tu Prótesis</h2>
        {/* Componente visual de progreso (stepper) iría aquí */}
      </div>
    </div>
  );
}

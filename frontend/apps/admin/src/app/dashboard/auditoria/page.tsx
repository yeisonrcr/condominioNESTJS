/**
 * AUDITORÍA PAGE - ADMIN
 */

'use client';

import { FileText, Filter } from 'lucide-react';

export default function AuditoriaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Auditoría</h1>
        <p className="text-gray-600 mt-2">Registro de actividad del sistema</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Logs de Actividad</h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter size={16} />
            Filtrar
          </button>
        </div>

        <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-2 opacity-50" />
            <p className="font-medium">Sistema de Auditoría</p>
            <p className="text-sm mt-1">Los logs se mostrarán aquí</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium mb-1">Eventos Hoy</p>
          <p className="text-2xl font-bold text-blue-900">0</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium mb-1">Usuarios Activos</p>
          <p className="text-2xl font-bold text-green-900">0</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium mb-1">Total Registros</p>
          <p className="text-2xl font-bold text-purple-900">0</p>
        </div>
      </div>
    </div>
  );
}
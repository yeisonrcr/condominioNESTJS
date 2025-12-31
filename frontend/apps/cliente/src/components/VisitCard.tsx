/**
 * VISIT CARD COMPONENT
 * Tarjeta para mostrar información de visita
 */

import { formatDateTime, getVisitStatusLabel, getVisitStatusColor } from '@rosedal2/shared/lib/utils';
import { User, Car, Clock } from 'lucide-react';

interface VisitCardProps {
  visit: any;
  onClick?: () => void;
}

export const VisitCard: React.FC<VisitCardProps> = ({ visit, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{visit.visitorName}</h3>
            {visit.visitorCedula && (
              <p className="text-xs text-gray-500">CC: {visit.visitorCedula}</p>
            )}
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getVisitStatusColor(
            visit.status
          )}`}
        >
          {getVisitStatusLabel(visit.status)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} />
          <span>Entrada: {formatDateTime(visit.entryTime)}</span>
        </div>
        {visit.exitTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>Salida: {formatDateTime(visit.exitTime)}</span>
          </div>
        )}
        {visit.vehiclePlate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Car size={16} />
            <span className="font-mono font-semibold">{visit.vehiclePlate}</span>
          </div>
        )}
      </div>

      {/* Observations */}
      {visit.observations && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600 italic">{visit.observations}</p>
        </div>
      )}
    </div>
  );
};
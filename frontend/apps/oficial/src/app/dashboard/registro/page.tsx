/**
 * REGISTRO DE VISITAS PAGE
 * Registrar entrada y salida con firma digital
 */

'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { useHouses, useCreateVisit, useVisits, useExitVisit } from '@rosedal2/shared/hooks/useApi';
import { Button } from '@rosedal2/shared/components/Button';
import { Input } from '@rosedal2/shared/components/Input';
import SignatureCanvas from 'react-signature-canvas';
import toast from 'react-hot-toast';
import { Trash2, Save, ArrowRight } from 'lucide-react';

export default function RegistroPage() {
  const { user } = useAuth();
  const { data: houses } = useHouses();
  const createVisit = useCreateVisit();
  const exitVisit = useExitVisit(0);
  const { data: activeVisits } = useVisits('status=active');

  const [mode, setMode] = useState<'entry' | 'exit'>('entry');
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  
  // Formulario entrada
  const [formData, setFormData] = useState({
    houseId: '',
    visitorName: '',
    visitorCedula: '',
    visitorPhone: '',
    vehiclePlate: '',
    observations: '',
  });

  // Firma
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sigCanvas.current?.isEmpty()) {
      toast.error('Por favor firma el registro');
      return;
    }

    try {
      const signatureData = sigCanvas.current?.toDataURL();

      await createVisit.mutateAsync({
        ...formData,
        houseId: parseInt(formData.houseId),
        entrySignature: signatureData,
      } as any);

      toast.success('Visita registrada correctamente');
      
      // Limpiar formulario
      setFormData({
        houseId: '',
        visitorName: '',
        visitorCedula: '',
        visitorPhone: '',
        vehiclePlate: '',
        observations: '',
      });
      clearSignature();
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar visita');
    }
  };

  const handleSubmitExit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVisit) {
      toast.error('Selecciona una visita');
      return;
    }

    if (sigCanvas.current?.isEmpty()) {
      toast.error('Por favor firma la salida');
      return;
    }

    try {
      const signatureData = sigCanvas.current?.toDataURL();

      await exitVisit.mutateAsync({
        id: selectedVisit.id,
        exitSignature: signatureData,
      } as any);

      toast.success('Salida registrada correctamente');
      
      setSelectedVisit(null);
      clearSignature();
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar salida');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registro de Visitas</h1>
        <p className="text-gray-600 mt-2">Registra entradas y salidas del condominio</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setMode('entry')}
          className={`px-4 py-2 font-medium transition-colors ${
            mode === 'entry'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Registrar Entrada
        </button>
        <button
          onClick={() => setMode('exit')}
          className={`px-4 py-2 font-medium transition-colors ${
            mode === 'exit'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Registrar Salida
        </button>
      </div>

      {/* Form Entry */}
      {mode === 'entry' && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <form onSubmit={handleSubmitEntry} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Casa <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.houseId}
                  onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Seleccionar casa</option>
                  {houses?.map((house: any) => (
                    <option key={house.id} value={house.id}>
                      Casa {house.houseNumber}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Nombre del visitante"
                value={formData.visitorName}
                onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                required
              />

              <Input
                label="Cédula"
                value={formData.visitorCedula}
                onChange={(e) => setFormData({ ...formData, visitorCedula: e.target.value })}
              />

              <Input
                label="Teléfono"
                type="tel"
                value={formData.visitorPhone}
                onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
              />

              <Input
                label="Placa del vehículo"
                value={formData.vehiclePlate}
                onChange={(e) =>
                  setFormData({ ...formData, vehiclePlate: e.target.value.toUpperCase() })
                }
              />
            </div>

            <Input
              label="Observaciones"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            />

            {/* Firma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Firma del visitante <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    className: 'signature-canvas w-full h-40',
                  }}
                />
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={clearSignature}
                >
                  <Trash2 size={16} className="mr-1" />
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={createVisit.isPending}
              >
                <Save size={20} className="mr-2" />
                Registrar Entrada
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Form Exit */}
      {mode === 'exit' && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <form onSubmit={handleSubmitExit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar visita <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activeVisits?.data?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay visitas activas</p>
                ) : (
                  activeVisits?.data?.map((visit: any) => (
                    <div
                      key={visit.id}
                      onClick={() => setSelectedVisit(visit)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedVisit?.id === visit.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{visit.visitorName}</p>
                          <p className="text-sm text-gray-600">
                            Casa {visit.house?.houseNumber || visit.houseId}
                          </p>
                        </div>
                        <ArrowRight
                          className={selectedVisit?.id === visit.id ? 'text-red-600' : 'text-gray-400'}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedVisit && (
              <>
                {/* Firma salida */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firma de salida <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
                    <SignatureCanvas
                      ref={sigCanvas}
                      canvasProps={{
                        className: 'signature-canvas w-full h-40',
                      }}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={clearSignature}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Limpiar
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    variant="danger"
                    size="lg"
                    isLoading={exitVisit.isPending}
                  >
                    <Save size={20} className="mr-2" />
                    Registrar Salida
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
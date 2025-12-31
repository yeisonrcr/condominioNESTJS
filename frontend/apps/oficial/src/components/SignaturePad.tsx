/**
 * SIGNATURE PAD COMPONENT
 * Canvas para capturar firmas digitales
 */

'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@rosedal2/shared/components/Button';
import { Trash2 } from 'lucide-react';

interface SignaturePadProps {
  onSave?: (signature: string) => void;
}

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ onSave }, ref) => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    useImperativeHandle(ref, () => ({
      clear: () => {
        sigCanvas.current?.clear();
      },
      isEmpty: () => {
        return sigCanvas.current?.isEmpty() ?? true;
      },
      toDataURL: () => {
        return sigCanvas.current?.toDataURL() ?? '';
      },
    }));

    const handleClear = () => {
      sigCanvas.current?.clear();
    };

    const handleSave = () => {
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        const dataURL = sigCanvas.current.toDataURL();
        onSave?.(dataURL);
      }
    };

    return (
      <div className="space-y-2">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: 'signature-canvas w-full h-40',
            }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={handleClear}>
            <Trash2 size={16} className="mr-1" />
            Limpiar
          </Button>
        </div>
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';
"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  label?: string;
}

export function SignaturePad({ onSave, label = "Firma del beneficiario o tutor" }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [error, setError] = useState<string | null>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    setError(null);
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      setError("Por favor, proporciona una firma antes de continuar.");
      return;
    }
    setError(null);
    const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    if (dataURL) {
      onSave(dataURL);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "w-full h-40 cursor-crosshair touch-none",
          }}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={clear}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={save}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Confirmar Firma
        </button>
      </div>
    </div>
  );
}

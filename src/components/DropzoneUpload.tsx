"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UploadCloud, X, File as FileIcon, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface DropzoneUploadProps {
  initialFiles?: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
  label?: string;
  helperText?: string;
}

export function DropzoneUpload({
  initialFiles = [],
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "application/pdf": [".pdf"],
  },
  label = "Sube tus archivos",
  helperText = "Arrastra y suelta tus archivos aquí, o haz clic para seleccionarlos",
}: DropzoneUploadProps) {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors[0].code === "file-too-large") {
          setError(`El archivo es demasiado grande. El máximo es ${maxSizeMB}MB.`);
        } else if (rejection.errors[0].code === "file-invalid-type") {
          setError("Tipo de archivo no permitido.");
        } else if (rejection.errors[0].code === "too-many-files") {
          setError(`Solo puedes subir hasta ${maxFiles} archivos.`);
        } else {
          setError(rejection.errors[0].message);
        }
        return;
      }

      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesChange(newFiles);
    },
    [files, maxFiles, maxSizeMB, onFilesChange]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeBytes,
    maxFiles,
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100",
          error ? "border-red-500 bg-red-50" : ""
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className={clsx("w-10 h-10 mb-3", isDragActive ? "text-blue-500" : "text-gray-400")} />
        <p className="text-sm text-center text-gray-600 font-medium">{helperText}</p>
        <p className="text-xs text-center text-gray-500 mt-1">
          Máximo {maxSizeMB}MB. {maxFiles > 1 ? `Hasta ${maxFiles} archivos.` : ""}
        </p>
      </div>

      {error && (
        <div className="mt-2 flex items-center text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="flex items-center space-x-3 overflow-hidden">
                <FileIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

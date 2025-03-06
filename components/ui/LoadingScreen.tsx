// components/ui/LoadingScreen.tsx
import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
// components/CnaeSearch.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown } from "lucide-react";
import { 
  CnaeOption, 
  searchCnaeCodes, 
  getCnaeByCode 
} from '@/lib/services/cnaeService';

interface CnaeSearchProps {
  onSelect: (option: CnaeOption) => void;
  defaultValue?: string;
  className?: string;
}

export default function CnaeSearch({ onSelect, defaultValue, className }: CnaeSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(defaultValue || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<CnaeOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<CnaeOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cargar la opción seleccionada si hay un defaultValue
  useEffect(() => {
    if (defaultValue) {
      const option = getCnaeByCode(defaultValue);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [defaultValue]);

  // Actualizar opciones filtradas cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = searchCnaeCodes(searchQuery);
      setFilteredOptions(results.slice(0, 10)); // Limitar a 10 resultados para mejor rendimiento
    } else {
      setFilteredOptions([]);
    }
  }, [searchQuery]);

  // Manejar la selección de una opción
  const handleSelect = (option: CnaeOption) => {
    setSelectedOption(option);
    setSelectedCode(option.code);
    setIsOpen(false);
    onSelect(option);
  };

  // Texto a mostrar en el botón
  const displayText = selectedOption 
    ? `${selectedOption.code} - ${selectedOption.description.substring(0, 40)}${selectedOption.description.length > 40 ? '...' : ''}` 
    : 'Seleccionar actividad CNAE';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón que muestra la selección actual */}
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCode ? selectedCode : "Seleccionar actividad CNAE"}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Panel de búsqueda desplegable */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          <div className="p-2">
            <Input
              autoFocus
              placeholder="Buscar por código o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
          </div>

          {/* Lista de resultados */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 && searchQuery.length > 1 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No se encontraron resultados.
              </div>
            ) : searchQuery.length <= 1 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Escribe al menos 2 caracteres para buscar...
              </div>
            ) : (
              <ul className="py-1">
                {filteredOptions.map((option) => (
                  <li
                    key={option.code}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => handleSelect(option)}
                  >
                    <span className="font-medium">{option.code}</span> - {option.description}
                    {option.section && (
                      <span className="ml-1 text-xs text-gray-500">
                        (Sección {option.section} - {option.tipo === 'manufactura' ? 'Manufactura' : 'Servicios'})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
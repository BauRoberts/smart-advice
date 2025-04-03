import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  formatNumber?: boolean;
  locale?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      formatNumber = false,
      locale = "es-ES",
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState<
      string | number | readonly string[] | undefined
    >("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Sincronizar el valor inicial
    React.useEffect(() => {
      if (formatNumber && value !== undefined && value !== "") {
        const numValue =
          typeof value === "string"
            ? parseFloat(value.replace(/[^\d]/g, ""))
            : Number(value);
        if (!isNaN(numValue)) {
          setDisplayValue(
            new Intl.NumberFormat(locale, { useGrouping: true }).format(
              numValue
            )
          );
        } else {
          setDisplayValue("");
        }
      } else {
        setDisplayValue(value);
      }
    }, [value, formatNumber, locale]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (formatNumber) {
        const rawValue = e.target.value.replace(/[^\d]/g, ""); // Solo dígitos
        const cursorPosition = e.target.selectionStart || 0;
        const prevValue = e.target.value;

        if (rawValue === "") {
          setDisplayValue("");
          if (onChange) {
            const customEvent = {
              ...e,
              target: { ...e.target, value: "" },
            };
            onChange(customEvent);
          }
          return;
        }

        const numValue = parseFloat(rawValue);
        if (!isNaN(numValue)) {
          const formattedValue = new Intl.NumberFormat(locale, {
            useGrouping: true,
          }).format(numValue);

          setDisplayValue(formattedValue);

          // Ajustar la posición del cursor (solo para type="text")
          if (inputRef.current && inputRef.current.type === "text") {
            const diff = formattedValue.length - prevValue.length;
            const newCursorPosition = cursorPosition + diff;
            setTimeout(() => {
              inputRef.current?.setSelectionRange(
                newCursorPosition,
                newCursorPosition
              );
            }, 0);
          }

          if (onChange) {
            const customEvent = {
              ...e,
              target: { ...e.target, value: numValue.toString() }, // Convertir a string para coincidir con ChangeEvent
            };
            onChange(customEvent);
          }
        }
      } else if (onChange) {
        onChange(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (formatNumber && value !== undefined && value !== "") {
        const numValue =
          typeof value === "string"
            ? parseFloat(value.replace(/[^\d]/g, ""))
            : Number(value);
        if (!isNaN(numValue)) {
          setDisplayValue(
            new Intl.NumberFormat(locale, { useGrouping: true }).format(
              numValue
            )
          );
        } else {
          setDisplayValue("");
        }
      }
      if (onBlur) onBlur(e);
    };

    // Usar type="text" cuando formatNumber está activo para soportar setSelectionRange
    const effectiveType = formatNumber ? "text" : type;

    return (
      <input
        type={effectiveType}
        data-slot="input"
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        ref={(node) => {
          if (node) {
            (
              inputRef as React.MutableRefObject<HTMLInputElement | null>
            ).current = node;
          }
          if (typeof ref === "function") {
            ref(node);
          } else if (ref && "current" in ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current =
              node;
          }
        }}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        inputMode={formatNumber ? "numeric" : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

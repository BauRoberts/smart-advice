import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="ml-2">
          <Info className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 
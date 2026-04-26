import { HelpCircleIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export function FieldHint({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircleIcon className="inline size-3.5 cursor-help text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function OptionalBadge({ label }: { label: string }) {
  return <span className="font-normal text-muted-foreground/70 text-xs ml-1">({label})</span>;
}

import { Button } from './ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import type { ProcessInput } from '../types/process';
import { encodeProcessesToUrl } from '../utils/urlState';

interface ShareButtonProps {
  processes: ProcessInput[];
  algorithm?: string;
  quantum?: number;
}

export default function ShareButton({ processes, algorithm, quantum }: ShareButtonProps) {
  const handleShare = async () => {
    if (processes.length === 0 || !algorithm) {
      toast.error('Add processes and select an algorithm first!', {
        position: 'top-center',
      });
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set('processes', encodeProcessesToUrl(processes));
      params.set('algo', algorithm);
      if (quantum !== undefined && algorithm === 'roundRobin') {
        params.set('quantum', String(quantum));
      }

      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!', {
        position: 'top-center',
      });
    } catch {
      toast.error('Failed to copy link', {
        position: 'top-center',
      });
    }
  };

  return (
    <Button type="button" variant="outline" onClick={handleShare} className="gap-2">
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
}

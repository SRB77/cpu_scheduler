import { useState } from 'react';
import { Button } from './ui/button';
import { generateRandomColor, generateGradientColor } from '../utils/colors';
import { cn } from '../utils/cn';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
}

const presetColors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6366f1', // indigo
  '#ef4444', // red
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
];

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isGradient, setIsGradient] = useState(false);

  const handleRandomColor = () => {
    if (isGradient) {
      onChange(generateGradientColor());
    } else {
      onChange(generateRandomColor());
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={!isGradient ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setIsGradient(false);
            if (!value || value.includes('gradient')) {
              onChange(generateRandomColor());
            }
          }}
        >
          Solid
        </Button>
        <Button
          type="button"
          variant={isGradient ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setIsGradient(true);
            if (!value || !value.includes('gradient')) {
              onChange(generateGradientColor());
            }
          }}
        >
          Gradient
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleRandomColor}>
          Random
        </Button>
      </div>

      {!isGradient && (
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              className={cn(
                'h-10 w-10 rounded-md border-2 transition-all hover:scale-110',
                value === color ? 'border-foreground scale-110' : 'border-border'
              )}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
      )}

      {!isGradient && (
        <div>
          <input
            type="color"
            value={value && !value.includes('gradient') ? value : '#3b82f6'}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-md border"
          />
        </div>
      )}

      {isGradient && value && value.includes('gradient') && (
        <div
          className="h-20 w-full rounded-md border"
          style={{ background: value }}
        />
      )}
    </div>
  );
}

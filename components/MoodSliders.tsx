"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface MoodSlidersProps {
  values: Record<string, number>;
  labels?: Record<string, string>;
  min?: number;
  max?: number;
  onChange: (key: string, value: number) => void;
}

const labelKeys: Record<string, string> = {
  energy: "forms.mood.energy",
  calm: "forms.mood.calm",
  joy: "forms.mood.joy",
  fear: "forms.mood.fear",
  sadness: "forms.mood.sadness",
  awe: "forms.mood.awe",
  alignement: "forms.mood.alignment",
  long_alignment: "forms.mood.longAlignment"
};

export default function MoodSliders({
  values,
  labels,
  min = 0,
  max = 7,
  onChange
}: MoodSlidersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="grid gap-2">
          <div className="flex items-center justify-between text-sm text-white/80">
            <span>{labels?.[key] ?? t(labelKeys[key] ?? key)}</span>
            <span className="font-semibold text-magellan-vista">{value}</span>
          </div>
          <Slider
            value={[value]}
            min={min}
            max={max}
            step={1}
            onValueChange={([next]) => onChange(key, next)}
            className={cn("w-full")}
          />
        </div>
      ))}
    </div>
  );
}

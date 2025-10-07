"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MoodSliders from "@/components/MoodSliders";
import type { FormStep } from "@/config/forms";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface ConversationalFormProps {
  steps: FormStep[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  phaseLabel?: string;
}

function MultiTextField({
  items,
  maxItems = 3,
  onChange,
  emptyLabel,
  placeholder,
  addLabel
}: {
  items: string[];
  maxItems?: number;
  onChange: (next: string[]) => void;
  emptyLabel: string;
  placeholder: string;
  addLabel: string;
}) {
  const [buffer, setBuffer] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addItem = () => {
    if (!buffer.trim()) return;
    const next = [...items, buffer.trim()].slice(0, maxItems);
    onChange(next);
    setBuffer("");
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  const focusInput = (input?: HTMLInputElement | null) => {
    if (!input) return;
    input.focus();
    input.select();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge
            key={`${item}-${index}`}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => removeItem(index)}
          >
            {item}
          </Badge>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-white/40">{emptyLabel}</span>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={buffer}
          onChange={(event) => setBuffer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
              focusInput(event.currentTarget);
            }
          }}
          placeholder={placeholder}
          className="caret-animate"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            addItem();
            focusInput(inputRef.current);
          }}
        >
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

const baseMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 }
};

export default function ConversationalForm({
  steps,
  initialValues = {},
  onSubmit,
  phaseLabel
}: ConversationalFormProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const step = steps[currentIndex];

  const progress = useMemo(() => {
    if (steps.length === 0) return 0;
    return Math.round(((currentIndex + 1) / steps.length) * 100);
  }, [currentIndex, steps.length]);

  const updateValue = useCallback(
    (id: string, nextValue: any) => {
      setValues((prev) => ({
        ...prev,
        [id]: nextValue
      }));
      setError(undefined);
    },
    []
  );

  const ensureValue = (currentStep: FormStep) => {
    const value = values[currentStep.id];
    if (currentStep.type === "sliders" && currentStep.keys) {
      const valid = currentStep.keys.every((key) => typeof value?.[key] === "number");
      return valid;
    }
    if (currentStep.type === "multiText") {
      return Array.isArray(value) && value.length > 0;
    }
    return Boolean(value && String(value).trim().length > 0);
  };

  const goNext = async () => {
    if (!step) return;
    if (!ensureValue(step)) {
      setError(t("conversational.error"));
      triggerErrorFeedback();
      return;
    }
    if (currentIndex === steps.length - 1) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setCurrentIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goPrevious = () => {
    setError(undefined);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const triggerErrorFeedback = () => {
    const zone = document.querySelector("[data-question-zone]");
    if (!zone) return;
    zone.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0)" }
      ],
      {
        duration: 180,
        easing: "ease-in-out"
      }
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void goNext();
    }
    if (event.key === "ArrowLeft" && !event.shiftKey) {
      event.preventDefault();
      goPrevious();
    }
  };

  const renderField = (currentStep: FormStep) => {
    switch (currentStep.type) {
      case "sliders": {
        const keys = currentStep.keys ?? [];
        const existing = values[currentStep.id] ?? {};
        const safeRecord = keys.reduce((acc, key) => {
          acc[key] = typeof existing[key] === "number" ? existing[key] : currentStep.min ?? 0;
          return acc;
        }, {} as Record<string, number>);
        return (
          <MoodSliders
            values={safeRecord}
            min={currentStep.min}
            max={currentStep.max}
            onChange={(key, val) =>
              updateValue(currentStep.id, { ...safeRecord, [key]: val })
            }
          />
        );
      }
      case "multiText": {
        const list: string[] = values[currentStep.id] ?? [];
        return (
          <MultiTextField
            items={list}
            maxItems={currentStep.maxItems}
            onChange={(next) => updateValue(currentStep.id, next)}
            emptyLabel={t("conversational.multiEmpty")}
            placeholder={t("conversational.multiPlaceholder")}
            addLabel={t("buttons.add")}
          />
        );
      }
      case "textarea":
        return (
          <Textarea
            value={values[currentStep.id] ?? ""}
            onChange={(event) => updateValue(currentStep.id, event.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[160px]"
            placeholder={t("conversational.textareaPlaceholder")}
          />
        );
      case "input":
        return (
          <Input
            value={values[currentStep.id] ?? ""}
            onChange={(event) => updateValue(currentStep.id, event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("conversational.placeholder")}
          />
        );
      default:
        return (
          <Input
            value={values[currentStep.id] ?? ""}
            onChange={(event) => updateValue(currentStep.id, event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("conversational.placeholder")}
          />
        );
    }
  };

  if (!step) {
    return null;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
        <span>{phaseLabel ?? t("conversational.header")}</span>
        <span>
          {currentIndex + 1} / {steps.length}
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/10">
        <div
          className={cn("h-full rounded-full bg-magellan-glaucous transition-all")}
          style={{ width: `${progress}%` }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          {...baseMotion}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="glass-card border border-white/5 p-6"
          data-question-zone
        >
            <div className="flex flex-col gap-4">
              <div className="ink-label flex flex-col gap-2">
                <span className="text-sm uppercase tracking-wide text-magellan-vista/70">
                  {t("conversational.step")} {currentIndex + 1}
                </span>
                <h2 className="text-xl font-semibold text-white">
                  {t(step.labelKey)}
                </h2>
                {step.descriptionKey && (
                  <p className="text-sm text-white/60">{t(step.descriptionKey)}</p>
                )}
              </div>
              <div onKeyDown={handleKeyDown}>{renderField(step)}</div>
              {error && (
                <p className="text-sm font-semibold text-rose-300">{error}</p>
              )}
              <div className={`flex items-center pt-4 ${currentIndex > 0 ? 'justify-between' : 'justify-end'}`}>
                {currentIndex > 0 && (
                <Button
                  variant="ghost"
                  className="text-sm text-white/60 hover:text-white"
                  disabled={currentIndex === 0}
                  onClick={goPrevious}
                >
                  ← {t("buttons.back")}
                </Button>
                )}
                <Button onClick={() => void goNext()} disabled={isSubmitting}>
                  {currentIndex === steps.length - 1
                    ? t("buttons.save")
                    : t("buttons.next")}
                </Button>
              </div>
            </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

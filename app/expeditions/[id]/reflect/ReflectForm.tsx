"use client";

import { useTransition } from "react";
import ConversationalForm from "@/components/ConversationalForm";
import type { FormStep } from "@/config/forms";
import { toast } from "@/components/ui/use-toast";
import { persistReflection } from "./actions";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface Props {
  tripId: string;
  steps: FormStep[];
  initialValues: Record<string, any>;
  phaseLabel?: string;
  phase: "T24" | "T72" | "T14";
}

export default function ReflectForm({
  tripId,
  steps,
  initialValues,
  phaseLabel,
  phase
}: Props) {
  const [, startTransition] = useTransition();
  const { t } = useTranslation();
  const router = useRouter();

  const handleSubmit = async (values: Record<string, any>) => {
    startTransition(() => {
      persistReflection(tripId, phase, values)
        .then(() => {
          toast({
            title: t("toasts.reflectionSaveSuccessTitle"),
            description: t("toasts.reflectionSaveSuccessDescription")
          });
          router.push(`/expeditions/${tripId}`);
          router.refresh();
        })
        .catch((error) =>
          toast({
            title: t("toasts.reflectionSaveErrorTitle"),
            description: (error as Error).message,
            variant: "error"
          })
        );
    });
  };

  return (
    <ConversationalForm
      steps={steps}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      phaseLabel={phaseLabel ?? t("reflect.title")}
    />
  );
}

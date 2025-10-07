"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function PDFButton() {
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="rounded-full border-white/30 text-xs text-white/80"
    >
      <Printer className="mr-2 h-4 w-4" />
      {t("buttons.exportPdf")}
    </Button>
  );
}

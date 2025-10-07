"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { inviteCrew, inviteInitialState } from "./actions";
import type { Trip } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface Props {
  trips: Trip[];
}

export default function CrewForm({ trips }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(inviteCrew, inviteInitialState);
  const [pending, startTransition] = useTransition();
  const [tripId, setTripId] = useState<string>(trips[0]?.id ?? "");
  const [role, setRole] = useState<"read" | "write">("read");
  const hasTrips = trips.length > 0;
  const { t } = useTranslation();

  useEffect(() => {
    if (trips.length > 0) {
      setTripId(trips[0].id);
    }
  }, [trips]);

  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: t("toasts.invitationSuccessTitle"),
        description: t("toasts.invitationSuccessDescription")
      });
      formRef.current?.reset();
    }
    if (state.status === "error") {
      toast({
        title: t("toasts.invitationErrorTitle"),
        description: state.message,
        variant: "error"
      });
    }
  }, [state, t]);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(() => {
          formAction(formData);
        });
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("crew.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("crew.emailPlaceholder")}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>{t("crew.expedition")}</Label>
          <Select
            value={tripId}
            onValueChange={(value) => setTripId(value)}
            disabled={!hasTrips}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("crew.selectExpedition")} />
            </SelectTrigger>
            <SelectContent>
              {trips.map((trip) => (
                <SelectItem key={trip.id} value={trip.id}>
                  {trip.intention}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!hasTrips && (
            <p className="text-xs text-white/40">
              {t("crew.noTrips")}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>{t("crew.role")}</Label>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as "read" | "write")}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("crew.rolePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="read">{t("crew.roleRead")}</SelectItem>
              <SelectItem value="write">{t("crew.roleWrite")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <input type="hidden" name="trip_id" value={tripId} />
      <input type="hidden" name="role" value={role} />
      <Button type="submit" disabled={pending || !hasTrips}>
        {pending ? t("crew.submitting") : t("crew.submit")}
      </Button>
    </form>
  );
}

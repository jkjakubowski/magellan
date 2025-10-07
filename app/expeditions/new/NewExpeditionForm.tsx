"use client";

import { useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { submitExpedition } from "./actions";
import type { Tag } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TagPicker from "@/components/TagPicker";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { createTagAction } from "./actions";
import { useTranslation } from "react-i18next";

interface Props {
  tags: Tag[];
}

export default function NewExpeditionForm({ tags: initialTags }: Props) {
  const [pending, startTransition] = useTransition();
  const [, action] = useFormState(submitExpedition, null);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { t } = useTranslation();

  const createTag = async (name: string) => {
    try {
      const created = await createTagAction(name);
      setTags((prev) => [...prev, created]);
      return created;
    } catch (error) {
      toast({
        title: t("toasts.tagCreateErrorTitle"),
        description: (error as Error).message,
        variant: "error"
      });
      return undefined;
    }
  };

  return (
    <form
      action={(formData) => {
        selectedTags.forEach((tag) => formData.append("tags", tag.id));
        startTransition(() => action(formData));
      }}
      className="glass-card flex flex-col gap-6 p-6 sm:gap-8 sm:p-8"
    >
      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="intention">{t("newExpedition.intention")}</Label>
          <Input
            id="intention"
            name="intention"
            placeholder={t("newExpedition.intention")}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">{t("newExpedition.date")}</Label>
            <Input id="date" name="date" type="date" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="time">{t("newExpedition.time")}</Label>
            <Input id="time" name="time" type="time" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="substance">{t("newExpedition.substance")}</Label>
          <Input id="substance" name="substance" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dose">{t("newExpedition.dose")}</Label>
          <Input id="dose" name="dose" />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="setting">{t("newExpedition.setting")}</Label>
          <Textarea
            id="setting"
            name="setting"
            placeholder={t("newExpedition.settingPlaceholder")}
            className="min-h-[120px]"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="safety_flags">{t("newExpedition.safetyFlags")}</Label>
          <Input
            id="safety_flags"
            name="safety_flags"
            placeholder={t("newExpedition.safetyPlaceholder")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <TagPicker
          tags={tags}
          selected={selectedTags}
          onSelect={setSelectedTags}
          onCreate={createTag}
          label={t("newExpedition.tagsLabel")}
        />
        <div className="flex flex-col gap-2 text-xs text-white/60">
          <span className="uppercase tracking-[0.2em] text-white/40">
            {t("newExpedition.existingTags")}
          </span>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="border-white/15 text-xs text-white/60"
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-xs text-white/40">
              {t("newExpedition.noTags")}
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? `${t("newExpedition.submit")}...` : t("newExpedition.submit")}
        </Button>
      </div>
    </form>
  );
}

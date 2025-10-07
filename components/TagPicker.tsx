"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Tag } from "@/types/domain";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface TagPickerProps {
  tags: Tag[];
  selected: Tag[];
  onSelect: (next: Tag[]) => void;
  onCreate?: (name: string) => Promise<Tag | undefined>;
  label?: string;
}

export default function TagPicker({
  tags,
  selected,
  onSelect,
  onCreate,
  label
}: TagPickerProps) {
  const [newTag, setNewTag] = useState("");
  const selectedIds = new Set(selected.map((tag) => tag.id));
  const { t } = useTranslation();

  const toggleTag = (tag: Tag) => {
    if (selectedIds.has(tag.id)) {
      onSelect(selected.filter((item) => item.id !== tag.id));
    } else {
      onSelect([...selected, tag]);
    }
  };

  const handleCreate = async () => {
    if (!newTag.trim() || !onCreate) return;
    const created = await onCreate(newTag.trim());
    if (created) {
      onSelect([...selected, created]);
      setNewTag("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {label && <span className="text-sm font-semibold text-white/70">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = selectedIds.has(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition",
                isActive
                  ? "border-magellan-glaucous bg-magellan-glaucous/80 text-white shadow"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              )}
            >
              {tag.name}
              {isActive && <X className="h-3 w-3 opacity-70" />}
            </button>
          );
        })}
        {onCreate && (
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(event) => setNewTag(event.target.value)}
              placeholder={t("forms.tagsPlaceholder")}
              className="h-9 w-40 rounded-full bg-white/10 text-xs"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full border-white/20 text-xs"
              onClick={handleCreate}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              {t("buttons.add")}
            </Button>
          </div>
        )}
        {selected.length === 0 && (
          <Badge variant="outline" className="border-dashed border-white/20 text-white/40">
            {t("forms.noSelectedTags")}
          </Badge>
        )}
      </div>
    </div>
  );
}

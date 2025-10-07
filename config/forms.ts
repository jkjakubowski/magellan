export type FormFieldType =
  | "sliders"
  | "multiText"
  | "textarea"
  | "input"
  | "tags"
  | "toggle"
  | "date"
  | "time";

export interface FormStep {
  id: string;
  type: FormFieldType;
  labelKey: string;
  descriptionKey?: string;
  keys?: string[];
  min?: number;
  max?: number;
  maxItems?: number;
  placeholderKey?: string;
}

export const T24_STEPS: FormStep[] = [
  {
    id: "mood",
    type: "sliders",
    labelKey: "forms.t24.mood.label",
    keys: ["energy", "calm", "joy", "fear", "sadness", "awe"],
    min: 0,
    max: 7
  },
  {
    id: "key_images",
    type: "multiText",
    labelKey: "forms.t24.keyImages.label",
    maxItems: 3
  },
  {
    id: "insights",
    type: "textarea",
    labelKey: "forms.t24.insights.label"
  },
  {
    id: "body_notes",
    type: "textarea",
    labelKey: "forms.t24.bodyNotes.label"
  },
  {
    id: "action_next",
    type: "input",
    labelKey: "forms.t24.actionNext.label"
  }
];

export const T72_STEPS: FormStep[] = [
  {
    id: "contradictions",
    type: "textarea",
    labelKey: "forms.t72.contradictions.label"
  },
  {
    id: "integration",
    type: "textarea",
    labelKey: "forms.t72.integration.label"
  },
  {
    id: "action_smart",
    type: "input",
    labelKey: "forms.t72.actionSmart.label"
  },
  {
    id: "alignment_score",
    type: "sliders",
    labelKey: "forms.t72.alignment.label",
    keys: ["alignement"],
    min: 0,
    max: 7
  }
];

export const T14_STEPS: FormStep[] = [
  {
    id: "trace",
    type: "textarea",
    labelKey: "forms.t14.trace.label"
  },
  {
    id: "alignment_long",
    type: "sliders",
    labelKey: "forms.t14.longAlignment.label",
    keys: ["long_alignment"],
    min: 0,
    max: 7
  },
  {
    id: "therapy_question",
    type: "textarea",
    labelKey: "forms.t14.therapyQuestion.label"
  },
  {
    id: "closing",
    type: "input",
    labelKey: "forms.t14.closing.label"
  }
];

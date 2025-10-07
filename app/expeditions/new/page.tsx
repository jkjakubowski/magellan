import { listTags } from "@/lib/actions";
import NewExpeditionForm from "./NewExpeditionForm";
import { getServerTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function NewExpeditionPage() {
  const tags = await listTags().catch(() => []);
  const { t } = await getServerTranslation();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-magellan-vista/70">
          {t("buttons.newExpedition")}
        </p>
        <h1 className="text-3xl font-semibold text-white">
          {t("newExpedition.title")}
        </h1>
        <p className="text-sm text-white/70">
          {t("newExpedition.description")}
        </p>
      </header>
      <NewExpeditionForm tags={tags} />
    </div>
  );
}

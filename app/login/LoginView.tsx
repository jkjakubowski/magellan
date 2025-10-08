"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

type LoginForm = {
  email: string;
  password: string;
};

export function LoginView() {
  const router = useRouter();
  const { t } = useTranslation();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("auth.emailError")),
        password: z.string().min(6, t("auth.passwordError"))
      }),
    [t]
  );
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });
    setLoading(false);

    if (error) {
      toast({
        title: t("toasts.loginErrorTitle"),
        description: error.message,
        variant: "error"
      });
      return;
    }

    toast({
      title: t("toasts.loginSuccessTitle"),
      description: t("toasts.loginSuccessDescription")
    });
    router.push("/");
    router.refresh();
  };

  const sendMagicLink = async (email: string) => {
    if (!email) {
      toast({
        title: t("toasts.magicLinkMissingTitle"),
        description: t("auth.magicLinkPrompt"),
        variant: "warning"
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) {
      toast({
        title: t("toasts.magicLinkErrorTitle"),
        description: error.message,
        variant: "error"
      });
      return;
    }
    toast({
      title: t("toasts.magicLinkSuccessTitle"),
      description: t("toasts.magicLinkSuccessDescription")
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-magellan-delft/70 p-10 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-white">
          {t("auth.loginTitle")}
        </h1>
        <p className="text-sm text-white/70">{t("auth.loginSubtitle")}</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-rose-300">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-rose-300">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? `${t("auth.loginButton")}...` : t("auth.loginButton")}
        </Button>
      </form>
      <Button
        variant="outline"
        onClick={() => void sendMagicLink(watch("email"))}
        disabled={loading}
      >
        {t("auth.magicLink")}
      </Button>
      <p className="text-center text-sm text-white/60">
        {t("auth.signupPrompt")}{" "}
        <Link href="/signup" className="text-magellan-vista underline">
          {t("auth.signupLink")}
        </Link>
      </p>
    </div>
  );
}

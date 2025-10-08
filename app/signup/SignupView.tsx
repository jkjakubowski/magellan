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
import { useSupabaseClient } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

type SignupForm = {
  email: string;
  password: string;
  confirm: string;
};

export function SignupView() {
  const router = useRouter();
  const { t } = useTranslation();
  const supabase = useSupabaseClient();
  const schema = useMemo(
    () =>
      z
        .object({
          email: z.string().email(t("auth.emailError")),
          password: z.string().min(6, t("auth.passwordError")),
          confirm: z.string().min(6, t("auth.passwordError"))
        })
        .refine((data) => data.password === data.confirm, {
          message: t("auth.confirmError"),
          path: ["confirm"]
        }),
    [t]
  );
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupForm>({
    resolver: zodResolver(schema)
  });

  if (!supabase) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-magellan-delft/70 p-10 text-center text-sm text-white/80 shadow-lg backdrop-blur">
        {t("auth.supabaseMissing")}
      </div>
    );
  }

  const onSubmit = async (form: SignupForm) => {
    setLoading(true);
    if (!supabase) {
      toast({
        title: t("auth.supabaseMissing"),
        variant: "error"
      });
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password
      });

      if (error) {
        toast({
          title: t("toasts.signupErrorTitle"),
          description: error.message,
          variant: "error"
        });
        return;
      }

      toast({
        title: t("toasts.signupSuccessTitle"),
        description: t("toasts.signupSuccessDescription")
      });

      if (!data.session) {
        const { error: signinError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        });

        if (signinError) {
          toast({
            title: t("toasts.loginErrorTitle"),
            description: signinError.message,
            variant: "error"
          });
          router.push("/login");
          return;
        }
      }

      toast({
        title: t("toasts.loginSuccessTitle"),
        description: t("toasts.loginSuccessDescription")
      });
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-magellan-delft/70 p-10 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-white">
          {t("auth.signupTitle")}
        </h1>
        <p className="text-sm text-white/70">{t("auth.signupSubtitle")}</p>
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm">{t("auth.confirmPassword")}</Label>
          <Input id="confirm" type="password" {...register("confirm")} />
          {errors.confirm && (
            <p className="text-sm text-rose-300">{errors.confirm.message}</p>
          )}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? `${t("auth.signupButton")}...` : t("auth.signupButton")}
        </Button>
      </form>
      <p className="text-center text-sm text-white/60">
        {t("auth.loginCallout")}{" "}
        <Link href="/login" className="text-magellan-vista underline">
          {t("auth.loginLink")}
        </Link>
      </p>
    </div>
  );
}

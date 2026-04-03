"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  if (!name?.trim()) {
    return { error: "Name is required" };
  }

  await db
    .update(users)
    .set({
      name: name.trim(),
      phone: phone?.trim() || null,
    })
    .where(eq(users.id, authUser.id));

  revalidatePath("/profile");
  return { success: true };
}

export async function deactivateAccountAction() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return { error: "Not authenticated" };
  }

  await supabase.auth.signOut();
  return { success: true };
}

export async function resetPasswordAction() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.email) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(authUser.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/profile`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

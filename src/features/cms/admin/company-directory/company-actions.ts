"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { canManageCms } from "../access";
import { archiveCompany, createCompany, updateCompany } from "../../database/repository";
import { PLANS } from "../../plans";

export type CompanyActionState = { message: string; error: boolean; companyId?: string } | null;

export async function manageCompany(
  operation: "create" | "update" | "delete",
  id: string | null,
  _previous: CompanyActionState,
  form: FormData,
): Promise<CompanyActionState> {
  if (!canManageCms(await headers())) return { error: true, message: "Administrator access is required." };
  if (operation !== "create" && operation !== "update" && operation !== "delete") {
    return { error: true, message: "Invalid company action." };
  }
  if (operation !== "create" && (typeof id !== "string" || !/^\d{1,64}$/.test(id))) {
    return { error: true, message: "Company not found." };
  }

  let affectedId = id;
  try {
    if (operation === "delete") {
      if (!await archiveCompany(id!)) return { error: true, message: "Company not found." };
    } else {
      const rawName = form.get("name");
      const name = typeof rawName === "string" ? rawName.trim() : "";
      const plan = PLANS.find(code => code === form.get("plan"));
      if (!name || name.length > 160 || !plan) {
        return { error: true, message: "Enter a company name of up to 160 characters and select a plan." };
      }

      if (operation === "create") {
        affectedId = await createCompany(name, plan);
      } else if (!await updateCompany(id!, name, plan)) {
        return { error: true, message: "Company not found." };
      }
    }
  } catch (error) {
    console.error("Company management action failed", error);
    return { error: true, message: "The company change could not be saved. Try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  if (affectedId) {
    revalidatePath("/" + affectedId);
    revalidatePath("/admin/" + affectedId);
  }
  return {
    error: false,
    message: { create: "Company added.", update: "Company updated.", delete: "Company deleted." }[operation],
    companyId: affectedId ?? undefined,
  };
}

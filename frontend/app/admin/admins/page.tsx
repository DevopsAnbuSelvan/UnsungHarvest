import { redirect } from "next/navigation";

/** Legacy path — staff management lives under /super-cold-admin/staff */
export default function LegacyAdminsRedirect() {
  redirect("/super-cold-admin/staff");
}

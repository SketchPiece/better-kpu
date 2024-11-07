import { KPU_API_URL } from "@/lib/kpu-api/dangerous-kpu-api-instance";
import { redirect } from "next/navigation";

export default async function LaunchRedirect({
  params,
}: {
  params: { uniqueKey: string };
}) {
  return redirect(`${KPU_API_URL}/launch-task/all/${params.uniqueKey}`);
}

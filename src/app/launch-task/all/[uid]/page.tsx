import { KPU_API_URL } from "@/lib/kpu-api/dangerous-kpu-api-instance";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function LaunchRedirect({
  params,
}: {
  params: { uid: string };
}) {
  const uniqueKey = await api.kpu.getServiceUniqueKey({
    uid: params.uid,
  });
  return redirect(`${KPU_API_URL}/launch-task/all/${uniqueKey}`);
}

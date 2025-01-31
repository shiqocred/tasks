import { redirect } from "next/navigation";
import { getWorkspaces } from "../../features/workspaces/server/queries";
import { protect } from "../../features/auth/server/queries";

export default async function Home() {
  const user = await protect();
  if (!user) redirect("/sign-in");

  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}

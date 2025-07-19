import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

type Props = {
  params: {
    workspaceId: string;
  };
}

const DashboardPage = async ({ params }: Props) => {
  const auth = await onAuthenticateUser();
  if (
    !auth.success ||
    (auth.status !== 200 && auth.status !== 201)
  ) {
    return redirect("/auth/sign-in");
  }

  return redirect(`/dashboard/${auth.user.workspace[0].id}`);
};

export default DashboardPage;
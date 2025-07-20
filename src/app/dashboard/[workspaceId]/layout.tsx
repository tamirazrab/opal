import { getNotifications, onAuthenticateUser } from "@/actions/user";
import { getUserVideos, getWorkspaceFolders, getWorkspaces, verifyAccessToWorkspace } from "@/actions/workspace";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/global/sidebar";

type Props = {
  params: {
    workspaceId: string;
  };
  children: React.ReactNode;
}


const Layout = async ({ children, params }: Props) => {
  const { workspaceId } = await params;

  const auth = await onAuthenticateUser();

  if (
    !auth.success ||
    (auth.status !== 200 && auth.status !== 201)
  ) {
    return redirect("/auth/sign-in");
  }
  if(!auth.user?.workspaces || !auth.user?.workspaces.length) {
    return redirect("/auth/sign-in");
  }

  const hasAccess = await verifyAccessToWorkspace(workspaceId);
  if (!hasAccess.success || hasAccess.status !== 200) {
    return redirect(`/dashboard/${auth.user.workspaces[0].id}`);
  }
  
  if(!hasAccess.data?.workspace) {
    return null 
  }

  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceId)
  })

  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getUserVideos(workspaceId)
  })

  await query.prefetchQuery({
    queryKey: ['user-workspaces'],
    queryFn: () => getWorkspaces()
  })

  await query.prefetchQuery({
    queryKey: ['user-notifications'],
    queryFn: () => getNotifications()
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
      </div>
    </HydrationBoundary>
  );
};

export default Layout;
import { getNotifications, onAuthenticateUser } from "@/actions/user";
import { getUserVideos, getWorkspaceFolders, getWorkspaces, verifyAccessToWorkspace } from "@/actions/workspace";
import { redirect } from "next/navigation";
import { QueryClient } from "@tanstack/react-query";

type Props = {
  params: {
    
    workspaceId: string;
  };
  children: React.ReactNode;
}

const Layout = async ({ children, params: { workspaceId } }: Props) => {
  const auth = await onAuthenticateUser();
  if (
    !auth.success ||
    (auth.status !== 200 && auth.status !== 201)
  ) {
    return redirect("/auth/sign-in");
  }
  if(!auth.user?.workspace || !auth.user?.workspace.length) {
    return redirect("/auth/sign-in");
  }

  const hasAccess = await verifyAccessToWorkspace(workspaceId);
  if (!hasAccess.success || hasAccess.status !== 200) {
    return redirect(`/dashboard/${auth.user.workspace[0].id}`);
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
    <div>{ children }</div>
  );
};

export default Layout;
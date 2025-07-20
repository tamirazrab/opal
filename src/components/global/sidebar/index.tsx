'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import { SelectLabel } from "@radix-ui/react-select";
import { Separator } from "@/components/ui/separator";
import { getWorkspaces } from "@/actions/workspace";
import { useUserQueryData } from "@/hooks/user-query-data";
import { GetWorkspacesResponse } from "@/types/index.types";

type Props = {
  activeWorkspaceId: string;
}

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter()

  // TODO: fix types clutter here
  const {data, isFetched} = useUserQueryData(['user-workspaces'], getWorkspaces) 
  console.log("🚀 ~ Sidebar ~ data:", data)

  const  workspaces = (data as GetWorkspacesResponse)?.data?.workspaces || null
  console.log("🚀 ~ Sidebar ~ workspaces:", workspaces)

  const onChangeActiveWorkspace = (workspaceId: string) => {
    router.push(`/dashboard/${workspaceId}`)
  }

  return (
    <div className="flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden bg-[#111111]">
      <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        {/* TODO: add logo here */}
        <Image src="/logo.svg" alt="logo" width={32} height={32} />
        <p className="text-2xl">Opal</p>
      </div>
      <Select defaultValue={activeWorkspaceId} onValueChange={onChangeActiveWorkspace}>
        <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent className="bg-[#111111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspaces?.workspaces.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}

            {workspaces?.members && workspaces.members.length > 0 && workspaces.members.map((member) => member.Workspace && (
              <SelectItem key={member.Workspace.id} value={member.Workspace.id}>
                {member.Workspace.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default Sidebar;
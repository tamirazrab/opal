'use server'

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import {
  VerifyAccessToWorkspaceResponse,
  GetWorkspaceFoldersResponse,
  GetUserVideosResponse,
  GetWorkspacesResponse,
  Workspace
} from "@/types/index.types";

export const verifyAccessToWorkspace = async (workspaceId: string): Promise<VerifyAccessToWorkspaceResponse> => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        status: 403,
        success: false,
        message: "User not found",
      };
    }

    const isUserInWorkspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerk_id: user.id,
            }
          },
          {
            members: {
              every: {
                User: {
                  clerk_id: user.id,
                }
              }
            }
          }
        ]
      },
    });

    return isUserInWorkspace ? { status: 200, success: true, data: { workspace: isUserInWorkspace as Workspace } } : { status: 403, success: false, message: "Access denied" };

  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Internal server error"
    };
  }
};

export const getWorkspaceFolders = async (workspaceId: string): Promise<GetWorkspaceFoldersResponse> => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        workspace_id: workspaceId,
      },
      include: {
        _count: {
          select: {
            videos: true
          }
        }
      }
    });

    if (!folders || folders.length === 0) {
      return {
        status: 404,
        success: false,
        message: "No folders found"
      }
    }

    return {
      status: 200,
      success: true,
      message: "Folders fetched successfully",
      data: {
        folders
      }
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Internal server error"
    }
  }
};

export const getUserVideos = async (workspaceId: string): Promise<GetUserVideosResponse> => {
  try {
    const videos = await prisma.video.findMany({
      where: {
        OR: [{ workspace_id: workspaceId }, { folder_id: workspaceId }]
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          }
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      },
    });

    if (!videos || videos.length === 0) {
      return {
        status: 404,
        success: false,
        message: "No videos found"
      }
    }

    return {
      status: 200,
      success: true,
      message: "Videos fetched successfully",
      data: {
        videos
      }
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Internal server error"
    }
  }
}

// TODO: fix type errors later
// export const getWorkspaces = async (): Promise<GetWorkspacesResponse> => {
export const getWorkspaces = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        status: 403,
        success: false,
        message: "User not found",
      };
    }

    const workspaces = await prisma.user.findUnique({
      where: {
        clerk_id: user.id,
      },
      select: {
        subscriptions: {
          select: {
            plan: true
          }
        },
        workspaces: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        members: {
          select: {
            Workspace: {
              select: {
                id: true,
                name: true,
                type: true,
              }
            }
          }
        }
      }
    })

    if (!workspaces) {
      return {
        status: 404,
        success: false,
        message: "No workspaces found"
      }
    }

    return {
      status: 200,
      success: true,
      message: "Workspaces fetched successfully",
      data: {
        workspaces
      }
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Internal server error"
    }
  }
}
'use server'

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        status: 403,
        success: false,
        message: "User not found",
      };
    }

    const isUserInWorkspace = await prisma.workSpace.findUnique({
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

    return isUserInWorkspace ? { status: 200, success: true, data:{ workspace: isUserInWorkspace } } : { status: 403, success: false, data: { workspace: null}};

  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      data: {
        workspace: null
      }
    };
  }
};

export const getWorkspaceFolders = async (workspaceId: string) => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        _count: {
          select: {
            video: true
          }
        }
      }
    });

    if (!folders && !folders.length) {
      return {
        status: 404,
        success: false,
        message: "No folders found",
        data: {
          folders: []
        }
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
      message: "Internal server error",
      data: {
        folders: []
      }
    }
  }
};

export const getUserVideos = async (workspaceId: string) => {
  try {
    const videos = await prisma.video.findMany({
      where: {
        OR: [ { workspace_id: workspaceId}, { folder_id: workspaceId  } ]
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

    if(!videos && !videos.length) {
      return {
        status: 404,
        success: false,
        message: "No videos found",
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
  } catch(error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      data: {
        videos: []
      }
    }
  }
}

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
        subscription: {
          select: {
            plan: true
          }
        },
        workspace: {
          select: {
            id: true,
            name: true,
            image: true,
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

    if(!workspaces && !workspaces.length) {
      return {
        status: 404,
        success: false,
        message: "No workspaces found",
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
  } catch(error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      data: {
        workspaces: []
      }
    }
  }
}
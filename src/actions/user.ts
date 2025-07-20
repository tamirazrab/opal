'use server'

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        status: 403,
        success: false,
        message: "User not found",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        clerk_id: user.id,
      },
      include: {
        workspaces: {
          where: {
            User: {
              clerk_id: user.id,
            }
          },
        },
      },
    });

    if (existingUser) return {
      status: 200,
      success: true,
      user: existingUser,
    };

    const newUser = await prisma.user.create({
      data: {
        clerk_id: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {}
        },
        subscriptions: {
          create: {}
        },
        workspaces: {
          create: {
            name: `${user.firstName}'s Workspace`
          }
        }
      },
      include: {
        workspaces: true,
        subscriptions: true,
      },
    });

    if (!newUser) {
      return {
        status: 500,
        success: false,
        message: "Failed to create user",
      };
    }

    return {
      status: 201,
      success: true,
      user: newUser,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to authenticate user",
    };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        status: 403,
        success: false,
        message: "User not found",
      };
    }

    const notifications = await prisma.user.findUnique({
      where: {
        clerk_id: user.id,
      },
      include: {
        notifications: true,
        _count: {
          select: {
            notifications: true,
          }
        }
      },
    });

    if (!notifications && !notifications?.notifications.length) {
      return {
        status: 404,
        success: false,
        message: "Notifications not found",
        data: { notifications: [] },
      };
    }

    return {
      status: 200,
      success: true,
      data: { notifications, }
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Failed to get notifications",
      data: { notifications: [] },
    };
  }
};

export const searchUserInWorkspace = async (query: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        status: 403,
        success: false,
        message: "User not found",
      };
    }

    const workspaces = await prisma.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query, mode: "insensitive" } },
          { lastname: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        NOT: [{ clerk_id: user.id }],
      },
      select: {
        id: true,
        subscriptions: {
          select: {
            plan: true,
          }
        },
        firstname: true,
        lastname: true,
        email: true,
        image: true,
      }
    });

    if (!workspaces || !workspaces.length) {
      return {
        status: 404,
        success: false,
        message: "No workspaces found",
        data: { workspaces: null },
      };
    }

    return {
      status: 200,
      success: true,
      data: { workspaces },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Failed to search workspace",
      data: { workspaces: null },
    };
  }
};
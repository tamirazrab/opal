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
        workspace: {
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
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {}
        },
        susbcription: {
          create: {}
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`
          }
        }
      },
      include: {
        workspace: true,
        susbcription: true,
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

export const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      clerk_id: userId,
    },
  });
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

    if(!notifications && !notifications?.notifications.length) {
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
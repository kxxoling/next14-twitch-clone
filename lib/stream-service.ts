import { db } from "@/lib/db";

export const getStreamByUserId = async (userId: string) => {
  const stream = await db.stream.findUnique({
    where: { userId },
  });

  return stream;
};

export const addUserStream = async (userId: string, name: string) => {
  const stream = await db.stream.create({
    data: {
      userId,
      name
    },
  });

  return stream;
}

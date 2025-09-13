import { db } from "@mini/db/connection";

export const getUser = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
  return user;
}
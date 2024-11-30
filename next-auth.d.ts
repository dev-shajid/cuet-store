import { UserRole } from "@prisma/client";
import { DefaultSession, User } from "next-auth";

type ExtendUser = DefaultSession['user'] & {
  role: UserRole
  image: string | null;
}

declare module "next-auth" {
  interface User {
    role: UserRole
    image: string | null;
  }

  interface Session {
    user: ExtendUser;
  }
}

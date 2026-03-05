import { createTRPCRouter } from "~/server/api/trpc";
import { studentAuthRouter } from "./auth";

export const studentRouter = createTRPCRouter({
  auth: studentAuthRouter,
});
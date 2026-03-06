import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "~/server/api/routers/post";

import { companyRouter } from "~/server/api/routers/company";
import { studentRouter } from "~/server/api/routers/student";  //sandani
import { profileRouter } from "./routers/student/profile";     //sandani
import { examRouter } from "~/server/api/routers/exam";//dill
import { aiRouter } from "~/server/api/routers/ai";
import { jobRouter } from "~/server/api/routers/job";//nilumi
import { adminRouter } from "~/server/api/routers/admin";
import { applicationRouter } from "./routers/application";//dil
import { verificationRouter } from "./routers/verification";//dil


/**
 * Primary tRPC router
 */
export const appRouter = createTRPCRouter({
  post: postRouter,        // keep existing example router
  company: companyRouter,
  student: studentRouter,
  profile: profileRouter,
  exam: examRouter,
  ai: aiRouter,
  admin: adminRouter,
  job: jobRouter,
  application: applicationRouter,
  verification: verificationRouter,

});

// Export type definition of API
export type AppRouter = typeof appRouter;

// Server-side caller
export const createCaller = createCallerFactory(appRouter);


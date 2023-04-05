import type { AppRouter } from "../pages/api/trpc/trpc-router";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();

import { createFileRoute } from "@tanstack/react-router";
import { Studio } from "#/components/studio/Studio";

export const Route = createFileRoute("/")({ component: Studio });

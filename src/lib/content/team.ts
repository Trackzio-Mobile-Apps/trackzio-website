import teamJson from "../../../content/team/team.json";
import type { TeamMemberContent } from "./schemas";
import { teamManifestSchema } from "./schemas";

function parseTeam(): TeamMemberContent[] {
  const parsed = teamManifestSchema.safeParse(teamJson);
  if (!parsed.success) {
    throw new Error(`Invalid content/team/team.json: ${parsed.error.message}`);
  }
  return parsed.data;
}

/** Published team members for the About page (order preserved from JSON). */
export function getTeamMembers(): TeamMemberContent[] {
  return parseTeam().filter((row) => row.published);
}

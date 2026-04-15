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

/** Published team members for the About page, sorted by `order` when provided. */
export function getTeamMembers(): TeamMemberContent[] {
  return parseTeam()
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => row.published)
    .sort((a, b) => {
      const ao = a.row.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.row.order ?? Number.MAX_SAFE_INTEGER;
      return ao - bo || a.idx - b.idx;
    })
    .map(({ row }) => row);
}

/**
 * The only doPost for the shared Apps Script project.
 *
 * In the existing deletion project:
 * 1. Rename the current doPost to handleAccountDeletion_. Leave its body unchanged.
 * 2. Replace doPost with the function below.
 * 3. Add PartnerApplications.gs as a second file. It must not declare doPost.
 *
 * Two web app deployments of this same project:
 * - The existing deployment URL stays on the account deletion form.
 * - A new deployment URL is GOOGLE_SHEETS_WEBHOOK_URL for the partner form.
 * Partner posts include secret and row. Every other post stays on handleAccountDeletion_.
 */

function doPost(e) {
  var body = {};
  try {
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
  } catch (error) {
    body = {};
  }

  if (body && typeof body.secret === "string" && body.row && typeof body.row === "object") {
    return handlePartnerApplication_(body);
  }

  return handleAccountDeletion_(e);
}

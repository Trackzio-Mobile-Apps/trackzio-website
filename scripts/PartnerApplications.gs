/**
 * Partner applications tab for the existing Trackzio spreadsheet.
 * Add this file to the Apps Script project that already handles account deletion.
 * Do not add a doPost here. WebApp.gs is the only doPost.
 *
 * Script properties:
 *   WEBHOOK_SECRET = the same value as GOOGLE_SHEETS_WEBHOOK_SECRET
 *   NOTIFY_EMAIL = partners@trackzio.com
 *
 * The first partner submission creates a tab named Applications.
 * Status starts as New. The team sets Contacted, Approved, or Rejected.
 */

var PARTNER_HEADERS = [
  "Submitted at",
  "Status",
  "Full name",
  "Email",
  "Phone",
  "Country",
  "City and state",
  "Business or page",
  "Partner as",
  "Deals in",
  "Apps",
  "Years of experience",
  "Website",
  "Specialties",
  "Memberships",
  "Sells today",
  "Notes",
];

var PARTNER_STATUSES = ["New", "Contacted", "Approved", "Rejected"];
var PARTNER_SHEET_NAME = "Applications";

function handlePartnerApplication_(body) {
  try {
    var secret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
    if (!secret || !body || body.secret !== secret || !body.row) {
      return partnerJson_({ ok: false, error: "Unauthorized" });
    }

    var sheet = partnerApplicationsSheet_();
    var row = body.row;
    sheet.appendRow(
      PARTNER_HEADERS.map(function (header) {
        return row[header] == null ? "" : String(row[header]);
      })
    );
    partnerNotify_(row);
    return partnerJson_({ ok: true });
  } catch (error) {
    return partnerJson_({ ok: false, error: String(error) });
  }
}

function partnerApplicationsSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(PARTNER_SHEET_NAME) || spreadsheet.insertSheet(PARTNER_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(PARTNER_HEADERS);
    sheet.getRange(1, 1, 1, PARTNER_HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  var statusColumn = PARTNER_HEADERS.indexOf("Status") + 1;
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(PARTNER_STATUSES, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, statusColumn, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  return sheet;
}

function partnerNotify_(row) {
  try {
    var to = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL") || "partners@trackzio.com";
    var lines = PARTNER_HEADERS.map(function (header) {
      var value = row[header] == null || String(row[header]).trim() === "" ? "—" : String(row[header]);
      return header + ": " + value;
    });
    MailApp.sendEmail({
      to: to,
      replyTo: row["Email"] || to,
      subject: "New partner application: " + (row["Full name"] || "Unknown"),
      body: lines.join("\n"),
    });
  } catch (error) {
    console.error(error);
  }
}

function partnerJson_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

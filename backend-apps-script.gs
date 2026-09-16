/**
 * Backend des idées — Google Apps Script + Google Sheets
 * ------------------------------------------------------
 * Gratuit, sans serveur à gérer. Voir INSTALLATION.md pour les étapes.
 *
 * Une seule chose à changer ci-dessous : CODE.
 */

const CODE = "change-moi-vraiment";   // code d'accès à la modération
const SHEET = "idees";                // nom de l'onglet du tableur

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const action = body.action;

    if (action === "submit")    return json(submit(body));
    if (action === "published") return json({ ideas: read("published") });
    if (action === "login")     return json({ ok: body.code === CODE });

    // actions réservées à la modération
    if (body.code !== CODE) return json({ error: "unauthorized" });

    if (action === "list")   return json({ ideas: read(body.status === "published" ? "published" : "pending") });
    if (action === "status") return json(setStatus(body.id, body.status));
    if (action === "delete") return json(remove(body.id));

    return json({ error: "unknown action" });
  } catch (err) {
    return json({ error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput("ok");
}

/* ---------------------------------------------------------------- */

function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(["id", "texte", "auteur", "date", "statut"]);
  }
  return sh;
}

function submit(body) {
  const text = String(body.text || "").trim().slice(0, 400);
  if (text.length < 4) return { error: "trop court" };
  const who = String(body.who || "").trim().slice(0, 40);
  const id = Utilities.getUuid().slice(0, 8);
  sheet().appendRow([id, text, who, new Date().getTime(), "pending"]);
  return { ok: true };
}

function read(status) {
  const rows = sheet().getDataRange().getValues().slice(1);
  return rows
    .filter(r => r[4] === status)
    .map(r => ({ id: String(r[0]), text: String(r[1]), who: String(r[2]), at: Number(r[3]) }))
    .reverse();
}

function rowOf(id) {
  const values = sheet().getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) return i + 1;
  }
  return 0;
}

function setStatus(id, status) {
  const row = rowOf(id);
  if (!row) return { error: "introuvable" };
  sheet().getRange(row, 5).setValue(status === "published" ? "published" : "pending");
  return { ok: true };
}

function remove(id) {
  const row = rowOf(id);
  if (!row) return { error: "introuvable" };
  sheet().deleteRow(row);
  return { ok: true };
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

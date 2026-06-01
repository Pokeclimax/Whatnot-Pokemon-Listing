const SPREADSHEET_ID = 'VOTRE_SPREADSHEET_ID';
const SHEET_NAME = 'Template';
const EXPECTED_TOKEN = 'VOTRE_TOKEN_SECRET';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({ ok: false, error: 'Aucune donnée POST reçue' });
    }

    const data = JSON.parse(e.postData.contents || '{}');
    const title = String(data.title || '').trim();
    const imageUrl = String(data.imageUrl || '').trim();
    const token = String(data.token || '').trim();

    if (token !== EXPECTED_TOKEN) {
      return jsonOutput({ ok: false, error: 'Token invalide' });
    }

    if (!title) {
      return jsonOutput({ ok: false, error: 'Titre manquant' });
    }

    if (!imageUrl) {
      return jsonOutput({ ok: false, error: 'Image URL manquante' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonOutput({
        ok: false,
        error: 'Sheet introuvable: ' + SHEET_NAME + ' | Onglets disponibles: ' + ss.getSheets().map(s => s.getName()).join(', ')
      });
    }

    const row = sheet.getLastRow() + 1;

    const values = [[
      '',
      '',
      title,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      imageUrl
    ]];

    sheet.getRange(row, 1, 1, 14).setValues(values);

    return jsonOutput({
      ok: true,
      row: row,
      title: title,
      imageUrl: imageUrl
    });
  } catch (err) {
    return jsonOutput({
      ok: false,
      error: err && err.message ? err.message : String(err)
    });
  }
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

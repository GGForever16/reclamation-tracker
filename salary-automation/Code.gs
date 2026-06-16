// ============================================================
// Salarisslip WhatsApp Automatie - Meta WhatsApp Cloud API
// Platform : Google Apps Script (gratis)
// WhatsApp : Meta Cloud API (officieel, veilig, direct)
// ============================================================

// ── CONFIGURATIE ─────────────────────────────────────────────
// Vul deze drie waarden in nadat je de Meta setup hebt gedaan
// (zie SETUP.md voor stap-voor-stap instructies)

const META_ACCESS_TOKEN = "JOUW_PERMANENT_TOKEN";    // System User token
const PHONE_NUMBER_ID   = "JOUW_PHONE_NUMBER_ID";    // van Meta Developer Console
const TEMPLATE_NAME     = "salarisslip_maandelijks"; // naam van je goedgekeurde template
const TEMPLATE_LANGUAGE = "nl";                       // taalcode van de template

const COMPANY_NAME = "Landbouw Josefina & Tropical Garden N.V.";
const SHEET_NAME   = "Medewerkers";
const META_API_VERSION = "v20.0";

// ── Hoofdfunctie: stuurt slips naar alle medewerkers ─────────
function stuurMaandelijkseSlips() {
  if (!configIngevuld()) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log("FOUT: Sheet '" + SHEET_NAME + "' niet gevonden.");
    return;
  }

  const data  = sheet.getDataRange().getValues();
  const maand = getMaandNaam();
  let verstuurd = 0, mislukt = 0;

  for (let i = 1; i < data.length; i++) {
    const r = data[i];
    if (!r[0]) continue; // sla lege rijen over

    const m = rijNaarMedewerker(r);
    const ok = stuurMetaWhatsApp(m.telefoon, maakTemplateParameters(m, maand));

    if (ok) verstuurd++; else mislukt++;

    Utilities.sleep(1000); // 1 seconde tussen berichten
  }

  Logger.log("Klaar — verstuurd: " + verstuurd + " | mislukt: " + mislukt);
}

// ── Zet een spreadsheet-rij om naar een medewerker-object ────
function rijNaarMedewerker(r) {
  return {
    naam:           String(r[0]).trim(),
    adres:          String(r[1]).trim(),
    geboortedatum:  String(r[2]).trim(),
    telefoon:       String(r[3]).trim(),
    // kolom E (index 4) niet gebruikt - was CallMeBot key, nu leeg laten
    afdeling:       String(r[5]).trim(),
    functie:        String(r[6]).trim(),
    datumInDienst:  String(r[7]).trim(),
    uurloon:        Number(r[8]),
    salaris:        Number(r[9]),
    toeslagBVZ:     Number(r[10]),
    toeslagAOV:     Number(r[11]),
    toeslagSVBZiek: Number(r[12]),
    toeslagSVBOng:  Number(r[13]),
    toeslagAVBZ:    Number(r[14]),
    premieBVZ:      Number(r[15]),
    premieAOV:      Number(r[16]),
    premieSVBOng:   Number(r[17]),
    premieSVBZiek:  Number(r[18]),
    premieAVBZ:     Number(r[19]),
    kortingAOV:     Number(r[20]),
  };
}

// ── Bereken totalen en bouw de template-variabelen ───────────
// Volgorde moet EXACT overeenkomen met {{1}} t/m {{19}} in de template
function maakTemplateParameters(m, maand) {
  const totaalInkomsten = m.salaris + m.toeslagBVZ + m.toeslagAOV +
                          m.toeslagSVBZiek + m.toeslagSVBOng + m.toeslagAVBZ;
  const totaalInhouding = m.premieBVZ + m.premieAOV + m.premieSVBOng +
                          m.premieSVBZiek + m.premieAVBZ + m.kortingAOV;
  const nettoBetaling   = totaalInkomsten - totaalInhouding;

  const waarden = [
    maand,                   // {{1}}  loontijdvak
    m.naam,                  // {{2}}  naam medewerker
    m.afdeling,              // {{3}}
    m.functie,               // {{4}}
    fmt(m.salaris),          // {{5}}
    fmt(m.toeslagBVZ),       // {{6}}
    fmt(m.toeslagAOV),       // {{7}}
    fmt(m.toeslagSVBZiek),   // {{8}}
    fmt(m.toeslagSVBOng),    // {{9}}
    fmt(m.toeslagAVBZ),      // {{10}}
    fmt(totaalInkomsten),    // {{11}}
    fmt(m.premieBVZ),        // {{12}}
    fmt(m.premieAOV),        // {{13}}
    fmt(m.premieSVBOng),     // {{14}}
    fmt(m.premieSVBZiek),    // {{15}}
    fmt(m.premieAVBZ),       // {{16}}
    fmt(m.kortingAOV),       // {{17}}
    fmt(totaalInhouding),    // {{18}}
    fmt(nettoBetaling),      // {{19}}
  ];

  return waarden.map(val => ({ type: "text", text: String(val) }));
}

// ── Verstuur via Meta WhatsApp Cloud API ─────────────────────
function stuurMetaWhatsApp(telefoon, templateParameters) {
  const url = "https://graph.facebook.com/" + META_API_VERSION + "/" +
              PHONE_NUMBER_ID + "/messages";

  const payload = {
    messaging_product: "whatsapp",
    to: telefoon,
    type: "template",
    template: {
      name: TEMPLATE_NAME,
      language: { code: TEMPLATE_LANGUAGE },
      components: [
        {
          type: "body",
          parameters: templateParameters
        }
      ]
    }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + META_ACCESS_TOKEN },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const code     = response.getResponseCode();
    const body     = response.getContentText();
    const ok       = (code === 200);
    Logger.log((ok ? "OK" : "FOUT") + " → " + telefoon + " | HTTP " + code + " | " + body);
    return ok;
  } catch (e) {
    Logger.log("FOUT → " + telefoon + ": " + e.message);
    return false;
  }
}

// ── Testfunctie: stuur testbericht naar jouw nummer ──────────
function testEenMedewerker() {
  if (!configIngevuld()) return;

  const testMedewerker = rijNaarMedewerker([
    "Genel Montas",    // A naam
    "Carawaraweg 45",  // B adres
    "1979.10.22",      // C geboortedatum
    "+59996970016",    // D telefoon (jouw testnummer)
    "",                // E ongebruikt
    "Planten",         // F afdeling
    "Arbeider",        // G functie
    "10/1/2025",       // H datum in dienst
    15.12,             // I uurloon
    2620.25,           // J salaris
    239.81,            // K toeslag BVZ
    244.97,            // L toeslag AOV
    49.78,             // M toeslag SVB ziek
    32.75,             // N toeslag SVB ong
    12.89,             // O toeslag AVBZ
    350.69,            // P premie BVZ
    412.58,            // Q premie AOV
    32.75,             // R premie SVB ong
    49.78,             // S premie SVB ziek
    51.57,             // T premie AVBZ
    3.07,              // U korting AOV
  ]);

  const parameters = maakTemplateParameters(testMedewerker, "April 2026");

  Logger.log("=== TEMPLATE VARIABELEN ===");
  parameters.forEach((p, i) => Logger.log("  {{" + (i + 1) + "}} = " + p.text));
  Logger.log("===========================");

  stuurMetaWhatsApp(testMedewerker.telefoon, parameters);
}

// ── Maandelijkse trigger instellen (1 keer uitvoeren) ────────
function installeerMaandelijkseTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("stuurMaandelijkseSlips")
    .timeBased()
    .onMonthDay(5)
    .atHour(8)
    .create();
  Logger.log("Trigger ingesteld: elke maand op de 5e om 08:00 Curaçao tijd");
}

// ── Hulpfuncties ─────────────────────────────────────────────
function fmt(n) {
  return Number(n).toFixed(2);
}

function getMaandNaam() {
  const maanden = [
    "Januari","Februari","Maart","April","Mei","Juni",
    "Juli","Augustus","September","Oktober","November","December"
  ];
  const nu = new Date();
  const vorigeMaand = new Date(nu.getFullYear(), nu.getMonth() - 1, 1);
  return maanden[vorigeMaand.getMonth()] + " " + vorigeMaand.getFullYear();
}

function configIngevuld() {
  if (META_ACCESS_TOKEN === "JOUW_PERMANENT_TOKEN" || PHONE_NUMBER_ID === "JOUW_PHONE_NUMBER_ID") {
    Logger.log("STOP: vul META_ACCESS_TOKEN en PHONE_NUMBER_ID in bovenaan het script. Zie SETUP.md.");
    return false;
  }
  return true;
}

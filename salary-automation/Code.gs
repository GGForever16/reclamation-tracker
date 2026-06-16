// ============================================================
// Salarisslip WhatsApp Automatie - Landbouw Josefina & Tropical Garden N.V.
// Platform: Google Apps Script (gratis)
// WhatsApp API: CallMeBot (gratis)
// ============================================================

const COMPANY_NAME = "Landbouw Josefina & Tropical Garden N.V.";
const SHEET_NAME = "Medewerkers";

// ── Hoofdfunctie: wordt automatisch uitgevoerd op de 1e van de maand ──
function stuurMaandelijkseSlips() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log("Sheet '" + SHEET_NAME + "' niet gevonden.");
    return;
  }

  const data = sheet.getDataRange().getValues();
  const maand = getMaandNaam();

  // Rij 1 = headers, data begint op rij 2
  for (let i = 1; i < data.length; i++) {
    const r = data[i];

    // Sla lege rijen over
    if (!r[0]) continue;

    const medewerker = {
      naam:             r[0],
      adres:            r[1],
      geboortedatum:    r[2],
      telefoon:         String(r[3]).trim(),
      apiKey:           String(r[4]).trim(),
      afdeling:         r[5],
      functie:          r[6],
      datumInDienst:    r[7],
      uurloon:          Number(r[8]),
      // Inkomsten
      salaris:          Number(r[9]),
      toeslagBVZ:       Number(r[10]),
      toeslagAOV:       Number(r[11]),
      toeslagSVBZiek:   Number(r[12]),
      toeslagSVBOng:    Number(r[13]),
      toeslagAVBZ:      Number(r[14]),
      // Inhoudingen
      premieBVZ:        Number(r[15]),
      premieAOV:        Number(r[16]),
      premieSVBOng:     Number(r[17]),
      premieSVBZiek:    Number(r[18]),
      premieAVBZ:       Number(r[19]),
      kortingAOV:       Number(r[20]),
    };

    const bericht = maakSalarisSlip(medewerker, maand);
    stuurWhatsApp(medewerker.telefoon, medewerker.apiKey, bericht);

    // 3 seconden wachten tussen berichten (CallMeBot limiet)
    Utilities.sleep(3000);
  }
}

// ── Formatteer het salarisslip bericht ──
function maakSalarisSlip(m, maand) {
  const totaalInkomsten = m.salaris + m.toeslagBVZ + m.toeslagAOV +
                          m.toeslagSVBZiek + m.toeslagSVBOng + m.toeslagAVBZ;
  const totaalInhouding = m.premieBVZ + m.premieAOV + m.premieSVBOng +
                          m.premieSVBZiek + m.premieAVBZ + m.kortingAOV;
  const nettoBetaling   = totaalInkomsten - totaalInhouding;
  const vandaag         = Utilities.formatDate(new Date(), "America/Curacao", "d/M/yyyy");

  return (
    "📋 *SALARISSLIP - " + maand + "*\n" +
    "━━━━━━━━━━━━━━━━━━━\n" +
    "👤 " + m.naam + "\n" +
    "📍 " + m.adres + "\n" +
    "🏢 " + COMPANY_NAME + "\n" +
    "📅 Datum: " + vandaag + "\n" +
    "━━━━━━━━━━━━━━━━━━━\n" +
    "💼 Afdeling       : " + m.afdeling + "\n" +
    "🔨 Functie        : " + m.functie + "\n" +
    "📆 Datum in dienst: " + m.datumInDienst + "\n" +
    "⏰ Uurloon        : ƒ " + fmt(m.uurloon) + "\n" +
    "━━━━━━━━━━━━━━━━━━━\n" +
    "📈 *INKOMSTEN*\n" +
    "Salaris                    : ƒ " + fmt(m.salaris) + "\n" +
    "Toeslag BVZ Basisverzekering: ƒ " + fmt(m.toeslagBVZ) + "\n" +
    "Toeslag AOV/AWW            : ƒ " + fmt(m.toeslagAOV) + "\n" +
    "Toeslag SVB Ziektekosten   : ƒ " + fmt(m.toeslagSVBZiek) + "\n" +
    "Toeslag SVB Ongevallen     : ƒ " + fmt(m.toeslagSVBOng) + "\n" +
    "Toeslag AVBZ               : ƒ " + fmt(m.toeslagAVBZ) + "\n" +
    "*Totaal Inkomsten: ƒ " + fmt(totaalInkomsten) + "*\n" +
    "━━━━━━━━━━━━━━━━━━━\n" +
    "📉 *INHOUDINGEN*\n" +
    "Premie BVZ Basisverzekering: ƒ " + fmt(m.premieBVZ) + "\n" +
    "Premie AOV/AWW             : ƒ " + fmt(m.premieAOV) + "\n" +
    "Premie SVB Ongevallen      : ƒ " + fmt(m.premieSVBOng) + "\n" +
    "Premie SVB Ziektekosten    : ƒ " + fmt(m.premieSVBZiek) + "\n" +
    "Premie AVBZ                : ƒ " + fmt(m.premieAVBZ) + "\n" +
    "Korting AOV/AWW            : ƒ " + fmt(m.kortingAOV) + "\n" +
    "*Totaal Inhoudingen: ƒ " + fmt(totaalInhouding) + "*\n" +
    "━━━━━━━━━━━━━━━━━━━\n" +
    "💰 *NETTO UITBETALEN CASH: ƒ " + fmt(nettoBetaling) + "*\n" +
    "━━━━━━━━━━━━━━━━━━━\n" +
    "_Aangemaakt met automatisch systeem_"
  );
}

// ── Verstuur via CallMeBot (gratis WhatsApp API) ──
function stuurWhatsApp(telefoon, apiKey, bericht) {
  const url = "https://api.callmebot.com/whatsapp.php" +
    "?phone=" + encodeURIComponent(telefoon) +
    "&text="  + encodeURIComponent(bericht) +
    "&apikey=" + encodeURIComponent(apiKey);

  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    Logger.log("Verstuurd naar " + telefoon + " | Status: " + response.getResponseCode());
  } catch (e) {
    Logger.log("Fout bij verzenden naar " + telefoon + ": " + e.message);
  }
}

// ── Testfunctie: stuur een testbericht naar de eigenaar ──
// STAP VOOR GEBRUIK:
//   1. Stuur "I allow callmebot to send me messages" naar +34 644 76 21 01 op WhatsApp
//   2. Je ontvangt een API-sleutel (6-cijferig getal)
//   3. Vul die sleutel in bij JOUW_API_SLEUTEL hieronder
//   4. Selecteer deze functie en klik Uitvoeren
function testEenMedewerker() {
  const JOUW_API_SLEUTEL = "XXXXXX"; // <-- vervang dit na activatie CallMeBot

  const testMedewerker = {
    naam:           "Genel Montas",
    adres:          "Carawaraweg 45",
    geboortedatum:  "1979.10.22",
    telefoon:       "+59996970060",   // jouw Curaçao nummer
    apiKey:         JOUW_API_SLEUTEL,
    afdeling:       "Planten",
    functie:        "Arbeider",
    datumInDienst:  "10/1/2025",
    uurloon:        15.12,
    salaris:        2620.25,
    toeslagBVZ:     239.81,
    toeslagAOV:     244.97,
    toeslagSVBZiek: 49.78,
    toeslagSVBOng:  32.75,
    toeslagAVBZ:    12.89,
    premieBVZ:      350.69,
    premieAOV:      412.58,
    premieSVBOng:   32.75,
    premieSVBZiek:  49.78,
    premieAVBZ:     51.57,
    kortingAOV:     3.07,
  };

  const bericht = maakSalarisSlip(testMedewerker, "April 2026");
  Logger.log("VOORBEELD BERICHT:\n" + bericht);

  if (JOUW_API_SLEUTEL === "XXXXXX") {
    Logger.log("STOP: vervang JOUW_API_SLEUTEL eerst met je echte CallMeBot sleutel.");
    return;
  }

  stuurWhatsApp(testMedewerker.telefoon, testMedewerker.apiKey, bericht);
  Logger.log("Testbericht verstuurd naar +59996970060");
}

// ── Hulpfuncties ──
function fmt(n) {
  return Number(n).toFixed(2);
}

function getMaandNaam() {
  const maanden = [
    "Januari","Februari","Maart","April","Mei","Juni",
    "Juli","Augustus","September","Oktober","November","December"
  ];
  const nu = new Date();
  // Stuur de slip voor de VORIGE maand (de maand die net afliep)
  const vorigeMaand = new Date(nu.getFullYear(), nu.getMonth() - 1, 1);
  return maanden[vorigeMaand.getMonth()] + " " + vorigeMaand.getFullYear();
}

// ── Installeer de maandelijkse trigger (voer dit 1 keer uit) ──
function installeerMaandelijkseTrigger() {
  // Verwijder bestaande triggers om duplicaten te voorkomen
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // Elke maand op de 5e om 08:00 (Curaçao tijd = UTC-4)
  ScriptApp.newTrigger("stuurMaandelijkseSlips")
    .timeBased()
    .onMonthDay(5)
    .atHour(8)
    .create();

  Logger.log("Trigger ingesteld: elke maand op de 5e om 08:00");
}

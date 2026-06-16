# Salarisslip WhatsApp Automatie — Instalgids (Meta Cloud API)

> Officieel, veilig, gratis. Berichten gaan direct via Meta's servers — geen tussenpersoon leest mee.

---

## Vereisten

- Google-account (voor Sheets + Apps Script)
- Facebook/Meta account
- Een telefoonnummer voor de WhatsApp Business lijn
  _(je kunt je eigen Curaçao-nummer gebruiken: +59996970016)_

---

## Stap 1 — Meta Developer Account aanmaken

1. Ga naar **https://developers.facebook.com**
2. Klik **Get Started** (rechts bovenaan)
3. Log in met je Facebook-account of maak een nieuw account
4. Voltooi de registratie als developer

---

## Stap 2 — Meta App aanmaken

1. Ga naar **https://developers.facebook.com/apps**
2. Klik **Create App**
3. Kies als type: **Business**
4. Vul in:
   - App name: `Salarisslip Josefina`
   - Contact email: je e-mailadres
5. Klik **Create App**

---

## Stap 3 — WhatsApp product toevoegen

1. In de App-pagina scroll je naar beneden naar **Add products to your app**
2. Klik **Set up** naast **WhatsApp**
3. Maak of koppel een **Meta Business Account**
4. Je krijgt een **gratis testnummer** van Meta (bijv. +1 555 XXXX) en een tijdelijke **Access Token**
5. Noteer de volgende twee waarden — je hebt ze straks nodig:
   - **Phone Number ID** (te zien op de WhatsApp > API Setup pagina)
   - **Temporary Access Token** (voor testen, verlooopt na 24 uur)

---

## Stap 4 — Jouw eigen nummer toevoegen (voor productie)

> Tijdens de testfase kun je 5 nummers registreren die berichten ontvangen.
> Voor productie moet je een eigen nummer verifiëren.

1. In WhatsApp > API Setup klik **Add phone number**
2. Voer je bedrijfsnaam en categorie in
3. Voer je telefoonnummer in: **+59996970016**
4. Verifieer via SMS of spraakoproep

⚠️ **Belangrijk:** Een nummer dat al actief is als gewone WhatsApp of WhatsApp Business kan
niet tegelijk als API-nummer worden gebruikt. Je kunt het nummer overzetten naar de API —
WhatsApp begeleidt je door dit proces.

---

## Stap 5 — WhatsApp Message Template aanmaken

Templates zijn vereist voor berichten die je zelf initieert (zoals salarisslips).
Meta moet de template goedkeuren (duurt 24–72 uur).

### Ga naar:
**Meta Business Suite → Business settings → WhatsApp accounts → [jouw account] → Message templates**

### Klik: Create template

Vul in:
- **Category:** Utility _(transactioneel — wordt gratis geleverd)_
- **Name:** `salarisslip_maandelijks`
- **Language:** Dutch (nl)

### Template body (kopieer dit exact):

```
Salarisslip {{1}} - {{2}}
Afdeling: {{3}} | Functie: {{4}}

INKOMSTEN
Salaris: f {{5}}
Toeslag BVZ Basisverzekering: f {{6}}
Toeslag AOV/AWW: f {{7}}
Toeslag SVB Ziektekosten: f {{8}}
Toeslag SVB Ongevallen: f {{9}}
Toeslag AVBZ: f {{10}}
Totaal Inkomsten: f {{11}}

INHOUDINGEN
Premie BVZ Basisverzekering: f {{12}}
Premie AOV/AWW: f {{13}}
Premie SVB Ongevallen: f {{14}}
Premie SVB Ziektekosten: f {{15}}
Premie AVBZ: f {{16}}
Korting AOV/AWW: f {{17}}
Totaal Inhoudingen: f {{18}}

NETTO UITBETALEN CASH: f {{19}}

Landbouw Josefina & Tropical Garden N.V.
```

Klik **Submit** en wacht op goedkeuring.

---

## Stap 6 — Permanente Access Token aanmaken

De tijdelijke token verloopt na 24 uur. Maak een permanente System User token:

1. Ga naar **Meta Business Suite → Business settings → Users → System users**
2. Klik **Add** → geef de system user een naam (bijv. `Salarisslip Bot`)
3. Rol: **Admin**
4. Klik **Generate new token**
5. Selecteer jouw App
6. Vink aan: `whatsapp_business_messaging`, `whatsapp_business_management`
7. Klik **Generate token**
8. **Kopieer de token en bewaar hem veilig** — je ziet hem maar één keer

---

## Stap 7 — Google Sheet instellen

Maak een Google Sheet. Noem het eerste tabblad **Medewerkers**.

Gebruik deze kolomvolgorde (rij 1 = headers, data vanaf rij 2):

| Kolom | Header | Voorbeeld |
|-------|--------|-----------|
| A | Naam | Genel Montas |
| B | Adres | Carawaraweg 45 |
| C | Geboortedatum | 1979.10.22 |
| D | Telefoon | +59996970016 |
| E | _(ongebruikt)_ | — |
| F | Afdeling | Planten |
| G | Functie | Arbeider |
| H | Datum in dienst | 10/1/2025 |
| I | Uurloon | 15.12 |
| J | Salaris | 2620.25 |
| K | Toeslag BVZ | 239.81 |
| L | Toeslag AOV/AWW | 244.97 |
| M | Toeslag SVB Ziektekosten | 49.78 |
| N | Toeslag SVB Ongevallen | 32.75 |
| O | Toeslag AVBZ | 12.89 |
| P | Premie BVZ | 350.69 |
| Q | Premie AOV/AWW | 412.58 |
| R | Premie SVB Ongevallen | 32.75 |
| S | Premie SVB Ziektekosten | 49.78 |
| T | Premie AVBZ | 51.57 |
| U | Korting AOV/AWW | 3.07 |

---

## Stap 8 — Apps Script instellen

1. Open de Google Sheet
2. Klik **Extensies → Apps Script**
3. Verwijder alle bestaande code
4. Kopieer de inhoud van `Code.gs` en plak het
5. Vul bovenaan in:
   ```
   const META_ACCESS_TOKEN = "jouw permanente token hier";
   const PHONE_NUMBER_ID   = "jouw phone number ID hier";
   ```
6. Klik **Opslaan**

---

## Stap 9 — Testen

1. Selecteer functie `testEenMedewerker` in het dropdown
2. Klik **Uitvoeren**
3. Kijk in **Logs** (Ctl+Enter) of er `OK → +59996970016 | HTTP 200` staat
4. Controleer je WhatsApp — je zou het testbericht moeten ontvangen

---

## Stap 10 — Automatische trigger instellen (1 keer)

1. Selecteer functie `installeerMaandelijkseTrigger`
2. Klik **Uitvoeren**
3. Geef toestemming als Google erom vraagt

Vanaf nu stuurt het systeem elke maand op de **5e om 08:00** automatisch alle salarisslips.

---

## Kosten

| Component | Kosten |
|-----------|--------|
| Google Sheets + Apps Script | Gratis |
| Meta WhatsApp Cloud API | Gratis |
| Utility template berichten | Gratis (binnen 24u service window) |
| **Totaal** | **ƒ 0.00 per maand** |

> Utility templates (zoals salarisslips) worden door Meta als gratis beschouwd
> wanneer ze worden verzonden als onderdeel van een bestaande service-interactie.
> Voor kleine aantallen medewerkers blijf je ruim binnen de gratis limieten.

---

## Veelgestelde vragen

**Moeten medewerkers iets doen?**
Nee. Geen opt-in, geen app, geen actie vereist van medewerkers.
Ze ontvangen de slip gewoon op hun WhatsApp.

**Hoe lang duurt template-goedkeuring?**
Gemiddeld 24–72 uur. Utility templates worden sneller goedgekeurd dan marketing templates.

**Wat als een bericht mislukt?**
Check de Apps Script logs na de 5e van de maand. Mislukte nummers worden gelogd.
Je kunt `stuurMaandelijkseSlips()` handmatig opnieuw uitvoeren voor specifieke nummers.

**Kan ik meerdere medewerkers hebben?**
Ja. Voeg gewoon meer rijen toe aan de sheet. Het script stuurt naar iedereen automatisch.

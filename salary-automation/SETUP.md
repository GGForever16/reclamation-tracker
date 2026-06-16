# Salarisslip WhatsApp Automatie - Instalgids

## Stap 1 — Google Sheet aanmaken

Maak een nieuw Google Sheet. Noem het eerste tabblad **Medewerkers**.

Gebruik deze kolomvolgorde (rij 1 = headers):

| Kolom | Header | Voorbeeld |
|-------|--------|-----------|
| A | Naam | Genel Montas |
| B | Adres | Carawaraweg 45 |
| C | Geboortedatum | 1979.10.22 |
| D | Telefoon | +5999XXXXXXX |
| E | CallMeBot API Key | 123456 |
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

## Stap 2 — CallMeBot API sleutel per medewerker

Elke medewerker doet dit **eenmalig**:

1. Sla het nummer **+34 644 76 21 01** op in hun telefoon als "CallMeBot"
2. Stuur via WhatsApp het bericht: `I allow callmebot to send me messages`
3. Ze ontvangen een API-sleutel (bijv. `123456`)
4. Vul die sleutel in kolom E van hun rij in de Google Sheet

---

## Stap 3 — Apps Script instellen

1. Open je Google Sheet
2. Klik op **Extensies → Apps Script**
3. Verwijder alle bestaande code
4. Kopieer de volledige inhoud van `Code.gs` en plak het
5. Klik op **Opslaan** (diskette-icoon)

---

## Stap 4 — Testen

1. Vul jouw eigen telefoonnummer en API-sleutel in de functie `testEenMedewerker()`
2. Verwijder de `//` voor de `stuurWhatsApp(...)` regel
3. Selecteer functie `testEenMedewerker` in het dropdown menu
4. Klik op **Uitvoeren**
5. Controleer of je het bericht ontvangt op WhatsApp

---

## Stap 5 — Automatische maandelijkse trigger instellen

1. Selecteer functie `installeerMaandelijkseTrigger` in het dropdown
2. Klik op **Uitvoeren** (dit doe je maar 1 keer)
3. Geef toestemming als Google erom vraagt

De slips worden nu automatisch elke maand op de **5e om 08:00** verstuurd.

---

## Voorbeeld van het WhatsApp bericht

```
📋 *SALARISSLIP - April 2026*
━━━━━━━━━━━━━━━━━━━
👤 Genel Montas
📍 Carawaraweg 45
🏢 Landbouw Josefina & Tropical Garden N.V.
📅 Datum: 5/5/2026
━━━━━━━━━━━━━━━━━━━
💼 Afdeling       : Planten
🔨 Functie        : Arbeider
📆 Datum in dienst: 10/1/2025
⏰ Uurloon        : ƒ 15.12
━━━━━━━━━━━━━━━━━━━
📈 *INKOMSTEN*
Salaris                    : ƒ 2620.25
Toeslag BVZ Basisverzekering: ƒ 239.81
Toeslag AOV/AWW            : ƒ 244.97
Toeslag SVB Ziektekosten   : ƒ 49.78
Toeslag SVB Ongevallen     : ƒ 32.75
Toeslag AVBZ               : ƒ 12.89
*Totaal Inkomsten: ƒ 3200.45*
━━━━━━━━━━━━━━━━━━━
📉 *INHOUDINGEN*
Premie BVZ Basisverzekering: ƒ 350.69
Premie AOV/AWW             : ƒ 412.58
Premie SVB Ongevallen      : ƒ 32.75
Premie SVB Ziektekosten    : ƒ 49.78
Premie AVBZ                : ƒ 51.57
Korting AOV/AWW            : ƒ 3.07
*Totaal Inhoudingen: ƒ 900.44*
━━━━━━━━━━━━━━━━━━━
💰 *NETTO UITBETALEN CASH: ƒ 2300.01*
━━━━━━━━━━━━━━━━━━━
_Aangemaakt met automatisch systeem_
```

---

## Kosten

| Component | Kosten |
|-----------|--------|
| Google Sheets | Gratis |
| Google Apps Script | Gratis |
| CallMeBot API | Gratis |
| **Totaal** | **ƒ 0.00 per maand** |

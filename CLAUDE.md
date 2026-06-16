# Salary Slip WhatsApp Automation — Best Practices

## Project Overview

This project automates sending monthly salary slips (salarisslips) via WhatsApp
to employees of Landbouw Josefina & Tropical Garden N.V. (Curaçao).

**Stack:** Google Sheets + Google Apps Script + CallMeBot API
**Cost:** ƒ 0.00 per month (100% free)
**Auto-send:** Every month on the 5th at 08:00 AM Curaçao time

---

## Architecture

```
Google Sheets (employee data)
        ↓
Google Apps Script (reads data, formats slip, sends)
        ↓
CallMeBot API (free WhatsApp gateway)
        ↓
Employee WhatsApp
```

---

## Best Practices (from research)

### 1. Always Get Opt-In First
- **Required by WhatsApp policy.** Every employee MUST activate CallMeBot once
  before you can message them.
- Each employee sends: `I allow callmebot to send me messages`
  to WhatsApp number **+34 644 76 21 01**
- They receive a personal API key — store it in column E of the sheet
- Without opt-in, messages will fail and your number risks being flagged

### 2. Rate Limiting — Never Send Too Fast
- CallMeBot imposes rate limits. The script already waits **3 seconds** between
  each employee message
- Do NOT reduce this delay — rapid sending can trigger a block
- For more than 20 employees, increase the delay to 5 seconds

### 3. Message Quality
- Keep messages professional and consistent every month
- WhatsApp monitors user feedback — if employees block or report messages,
  your account gets flagged
- The formatted slip already looks clean and professional on mobile

### 4. Error Logging
- Always check Apps Script logs after the monthly run:
  `Apps Script → Executions → View logs`
- Any failed sends are logged with the phone number and error
- Re-send manually to failed numbers if needed

### 5. Test Before Going Live
- Run `testEenMedewerker()` on your own number (+59996970060) first
- Confirm the layout looks correct on WhatsApp before sending to employees
- Run the test 1–2 days before the live date

### 6. Protect Employee Data
- The Google Sheet contains sensitive salary data
- Set sheet sharing to **"Restricted — only you"**
- Never share the sheet link publicly
- Do not store API keys in any public file or commit them to GitHub

### 7. Backup
- Export the Google Sheet monthly as Excel before updating new salary figures
- Keep the previous month's data in a separate tab

### 8. Update Salary Data Monthly
- Before the 5th of each month, update all salary values in the sheet
- The script reads live data at the moment it runs — update before 08:00 AM

### 9. Trigger Reliability
- Google Apps Script time-based triggers can occasionally be delayed by
  5–15 minutes — this is normal
- If a trigger fails to fire, run `stuurMaandelijkseSlips()` manually

### 10. When an Employee Leaves
- Remove their row from the sheet immediately
- Do NOT leave old employees with 0 values — delete the entire row

---

## File Structure

```
salary-automation/
├── Code.gs       — paste this into Google Apps Script
└── SETUP.md      — step-by-step setup guide
CLAUDE.md         — this file (best practices)
```

---

## Quick Reference

| Task | Function to run |
|------|----------------|
| Test with your number | `testEenMedewerker()` |
| Send to all employees | `stuurMaandelijkseSlips()` |
| Set up auto-trigger (once) | `installeerMaandelijkseTrigger()` |

---

## Owner Contact

- Business: Landbouw Josefina & Tropical Garden N.V.
- Owner WhatsApp test number: +59996970016 (Curaçao)

---

## Sources

- [CallMeBot FAQ](https://www.callmebot.com/faq/)
- [CallMeBot Free WhatsApp API](https://www.callmebot.com/blog/free-api-whatsapp-messages/)
- [WhatsApp API Rate Limits 2026 — Webmaxy](https://www.webmaxy.co/blog/whatsapp-business-api/whatsapp-api-rate-limits-avoid-blocks-and-grow-faster-in-2026/)
- [Automated Digital Payslips via WhatsApp — PerkPayroll](https://www.perkpayroll.com/post/automated-digital-payslips-via-whatsapp)
- [WhatsApp Salary Slip Automation — Pabbly](https://www.pabbly.com/automate-sending-salary-slips-on-whatsapp-with-pabbly-connect/)

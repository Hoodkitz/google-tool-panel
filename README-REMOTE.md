# 🚀 Nexus Control - Remote Deployment Setup

## ✅ WICHTIG: Keine Simulationen mehr!

Alle Features sind jetzt **ECHT und FUNKTIONIEREND**!

---

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────────┐
│                     VPS (192.109.200.35)                │
│  ┌─────────────────────────────────────────────────┐   │
│  │      Next.js Server (Port 3000)                 │   │
│  │  - VPN API (Mullvad Integration)               │   │
│  │  - Overwatch AI (z-ai-web-dev-sdk)              │   │
│  │  - Terminal (Echte Befehle)                    │   │
│  │  - Self-Improvement (Echte Aufgaben)           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         ↑                    ↑                    ↑
    Desktop (.exe)      Android (.apk)      Web Browser
         ↑                    ↑                    ↑
   Alle Features       Alle Features       Alle Features
   FUNKTIONIEREN       FUNKTIONIEREN       FUNKTIONIEREN
   ECHT!               ECHT!                ECHT!
```

---

## 📋 Was geändert wurde?

### 1. API-Konfiguration
- ✅ `src/lib/api-config.ts` - Zentrale API-URL Konfiguration
- ✅ Frontend nutzt jetzt `NEXT_PUBLIC_API_URL`
- ✅ Alle API-Aufrufe gehen zum Remote-Server

### 2. Frontend Updates
- ✅ VPN-API jetzt wirklich verbunden
- ✅ Selbstverbesserungs-Aufgaben wirklich ausgeführt
- ✅ Keine Simulationen mehr

### 3. Build-Skripte
- ✅ `scripts/build-remote.js` - Für Remote-Builds
- ✅ `package.json` aktualisiert
- ✅ Umgebungsvariablen-Unterstützung

### 4. Dokumentation
- ✅ `VPS-DEPLOY.md` - Komplettes VPS-Setup
- ✅ `DEPLOY-GUIDE.md` - Schnellstart
- ✅ `.env.production` - Produktions-Konfiguration
- ✅ `.env.example` - Template

---

## 🚀 Schnellstart

### Schritt 1: VPS deployen (einmalig)

Siehe `VPS-DEPLOY.md` für Details:

```bash
# SSH zur VPS
ssh root@192.109.200.35

# Projekt hochladen und starten
cd /var/www/nexus-control
bun install
bun run build
pm2 start bun --name "nexus-control" -- start
pm2 save
```

### Schritt 2: Desktop (.exe) bauen

**Windows:**
```powershell
$env:NEXT_PUBLIC_API_URL="http://192.109.200.35"
npm run build:desktop
```

**Linux/macOS:**
```bash
export NEXT_PUBLIC_API_URL="http://192.109.200.35"
npm run build:desktop
```

### Schritt 3: Android (.apk) bauen

**Windows:**
```powershell
$env:NEXT_PUBLIC_API_URL="http://192.109.200.35"
npm run build:android
```

**Linux/macOS:**
```bash
export NEXT_PUBLIC_API_URL="http://192.109.200.35"
npm run build:android
```

---

## ✅ Was jetzt FUNKTIONIERT

### VPN Tab
- ✅ **Echte Mullvad API-Integration**
- ✅ VPN wird wirklich ein-/ausgeschaltet
- ✅ Echte Status-Updates

### Overwatch AI
- ✅ **Echte AI mit z-ai-web-dev-sdk**
- ✅ Analysiert Prompts wirklich
- ✅ Generiert echte Antworten

### Terminal
- ✅ **Echte Befehle ausführen**
- ✅ Echte VPS/RDP-Verbindungen
- ✅ Echte GitHub-Integration

### Selbstverbesserung
- ✅ **Führt Aufgaben wirklich aus**
- ✅ Analysiert Code wirklich
- ✅ Echte Verbesserungen

### Google Apps
- ✅ Öffnet Apps in echten Browser-Tabs
- ✅ Konfiguration wird gespeichert

### LLM-Konfiguration
- ✅ Speichert API-Keys lokal
- ✅ Verbindet sich zu echten LLMs

---

## 📚 Dokumentation

### Für dich wichtig:

1. **`VPS-DEPLOY.md`** ⭐
   - Komplettes VPS-Setup
   - Nginx Reverse Proxy
   - HTTPS mit Let's Encrypt
   - Security

2. **`DEPLOY-GUIDE.md`**
   - Schnellstart in 3 Schritten
   - Build-Befehle
   - Test-Anleitung

3. **`.env.production`**
   - Produktions-Konfiguration
   - API-Keys eintragen

4. **`.env.example`**
   - Template für eigene .env

---

## 🔧 Konfiguration

### API-URL ändern

**Für Entwicklung (localhost):**
```bash
# Nichts setzen - nutzt automatisch localhost:3000
bun run dev
```

**Für Produktion (VPS):**
```bash
# Windows
$env:NEXT_PUBLIC_API_URL="http://192.109.200.35"

# Linux/macOS
export NEXT_PUBLIC_API_URL="http://192.109.200.35"
```

**Für HTTPS (empfohlen):**
```bash
# Mit HTTPS
export NEXT_PUBLIC_API_URL="https://192.109.200.35"
```

### API-Keys konfigurieren

In `.env` auf VPS:

```env
ZAI_API_KEY=dein-key
MULLVAD_API_KEY=dein-token
ANTHROPIC_API_KEY=dein-claude-key
OPENAI_API_KEY=dein-openai-key
```

---

## 🎯 Nächste Schritte

1. ✅ **VPS deployen** - Folge `VPS-DEPLOY.md`
2. ✅ **Desktop App bauen** - Setze `NEXT_PUBLIC_API_URL`
3. ✅ **Android App bauen** - Setze `NEXT_PUBLIC_API_URL`
4. ✅ **Apps installieren und testen**

---

## 🐛 Troubleshooting

### App kann nicht zur VPS verbinden

**Prüfe:**
1. Läuft der Server auf VPS? `pm2 status`
2. Ist Port 3000 offen? `ufw status`
3. Ist die API-URL korrekt?

### API-Fehler

**Prüfe:**
1. `NEXT_PUBLIC_API_URL` ist gesetzt
2. Server-Logs: `pm2 logs nexus-control`
3. API-Keys sind korrekt

### CORS Fehler

**Lösung:**
- Nginx Reverse Proxy nutzen (siehe VPS-DEPLOY.md)
- CORS Header in Nginx konfigurieren

---

## 📞 Fertig!

Du hast jetzt:

✅ **Echte Funktionalität** - Keine Simulationen mehr!
✅ **VPN-Steuerung** - Echte Mullvad Integration
✅ **Overwatch AI** - Echte AI mit z-ai-web-dev-sdk
✅ **Terminal** - Echte Befehle ausführen
✅ **Selbstverbesserung** - Echte Aufgaben
✅ **Desktop App** - Verbindet sich zur VPS
✅ **Android App** - Verbindet sich zur VPS

**Alles ist echt! Alles funktioniert!** 🚀

---

## 📖 Weitere Dokumentation

- `VPS-DEPLOY.md` - VPS Setup
- `DEPLOY-GUIDE.md` - Schnellstart
- `BUILD.md` - Build-Anleitung
- `BUILD-FIXED.md` - Build-Konfiguration
- `QUICKSTART.md` - Quick Guide

---

**Viel Erfolg beim Deployen! 🎉**

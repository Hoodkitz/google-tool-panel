# 🚀 Nexus Control - Deployment Guide

## Übersicht

**VPS:** 192.109.200.35

**Architektur:**
- VPS läuft das Backend mit echten APIs
- Desktop (.exe) und Android (.apk) verbinden sich zur VPS
- Alles funktioniert wirklich - keine Simulationen!

---

## 📋 Schnellstart (3 Schritte)

### 1️⃣ Backend auf VPS deployen

```bash
# SSH zur VPS
ssh root@192.109.200.35

# Projekt hochladen (oder git clone)
cd /var/www/nexus-control
# ... Dateien hochladen ...

# Dependencies installieren
bun install

# Build erstellen
bun run build

# Mit PM2 starten
pm2 start bun --name "nexus-control" -- start
pm2 save
```

Siehe **VPS-DEPLOY.md** für Details!

---

### 2️⃣ Desktop (.exe) bauen

**Windows (PowerShell):**
```powershell
# API-URL setzen
$env:NEXT_PUBLIC_API_URL="http://192.109.200.35"

# Desktop bauen
npm run build:desktop
```

**Linux/macOS:**
```bash
export NEXT_PUBLIC_API_URL="http://192.109.200.35"
npm run build:desktop
```

**Ergebnis:** `src-tai/target/release/bundle/nsis/Nexus Control_1.0.0_x64-setup.exe`

---

### 3️⃣ Android (.apk) bauen

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

**Ergebnis:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

## ✅ Fertig!

Jetzt hast du:

✅ **Backend auf VPS** mit echten APIs
✅ **Desktop App** die zur VPS verbindet
✅ **Android App** die zur VPS verbindet
✅ **Alle Features funktionieren wirklich!**

---

## 🔥 Was jetzt funktioniert?

### VPN Tab:
- ✅ Echte Mullvad API-Integration
- ✅ VPN wird wirklich ein-/ausgeschaltet

### Overwatch AI:
- ✅ Echte AI mit z-ai-web-dev-sdk
- ✌ Koordiniert wirklich LLMs

### Terminal:
- ✅ Echte Terminal-Befehle
- ✅ VPS/RDP-Verbindungen
- ✅ GitHub-Integration

### Selbstverbesserung:
- ✅ Führt wirklich Aufgaben aus
- ✅ Analysiert Code wirklich
- ✌ Echte Verbesserungen

---

## 📚 Detaillierte Anleitungen

- **VPS-DEPLOY.md** - Komplette VPS-Setup Anleitung
- **BUILD.md** - Build-Anleitung
- **BUILD-FIXED.md** - Korrigierte Build-Konfiguration
- **QUICKSTART.md** - Schnellstart

---

## 🎯 Nächste Schritte

1. **VPS deployen** (siehe VPS-DEPLOY.md)
2. **Desktop App bauen** mit deiner VPS-URL
3. **Android App bauen** mit deiner VPS-URL
4. **Apps installieren** und testen!

---

**Viel Erfolg! 🚀**

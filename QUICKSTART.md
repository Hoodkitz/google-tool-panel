# Nexus Control - Schnellstart Guide

Diese Anleitung hilft dir, schnell **.exe** und **.apk** Dateien zu erstellen.

## 🚀 In 5 Minuten zum ersten Build

### 1. Dependencies installieren

```bash
# Projekt-Dependencies
bun install
# oder
npm install
```

### 2. Icons generieren (optional)

```bash
# Terminal 1: Dev-Server starten
bun run dev

# Terminal 2: Icons generieren
curl -X POST http://localhost:3000/api/generate-icons
```

### 3. Desktop (.exe) bauen

```bash
# Voraussetzung: Rust installiert (siehe BUILD.md)
bun run tauri:build
```

Die .exe findest du unter: `src-tai/target/release/bundle/nsis/`

### 4. Android (.apk) bauen

```bash
# Voraussetzung: Android Studio installiert (siehe BUILD.md)
bun run cap:android:build
```

Die APK findest du unter: `android/app/build/outputs/apk/debug/`

### 5. Beide auf einmal bauen

```bash
bun run build:all
```

---

## 📋 Minimale Voraussetzungen

### Für Desktop (.exe):
- ✅ Rust & Cargo
- ✅ Windows SDK (nur Windows)

### Für Android (.apk):
- ✅ Android Studio
- ✅ Java JDK 17
- ✅ Android SDK

---

## 🛠️ Häufige Befehle

### Development
```bash
bun run dev              # Next.js Dev Server
bun run tauri:dev        # Desktop App mit Hot Reload
```

### Build
```bash
bun run tauri:build              # Desktop Release (.exe)
bun run tauri:build:debug        # Desktop Debug
bun run cap:android:build        # Android Debug (.apk)
bun run cap:android:build:release  # Android Release (.apk)
bun run build:all                # Beide Builds
```

### Android
```bash
bun run cap:android:sync   # Mit Android Projekt synchronisieren
bun run cap:android:open   # Android Studio öffnen
```

---

## ⚠️ Schnelle Fehlerbehebung

### "Rust not found"
```bash
# Installieren unter Windows:
winget install Rustlang.Rust.MSVC
```

### "ANDROID_HOME not set"
```powershell
# Windows:
$env:ANDROID_HOME="C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
```

### "gradlew: permission denied"
```bash
chmod +x android/gradlew
```

---

## 📚 Detaillierte Anleitung

Siehe **[BUILD.md](./BUILD.md)** für vollständige Anleitungen und Fehlerbehebung.

---

**Viel Erfolg! 🚀**

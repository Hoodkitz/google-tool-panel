# Nexus Control - Build Anleitung (Korrigiert)

## ✅ Behobene Fehler

Die folgenden Fehler wurden behoben:
1. ✅ `"theme": "system"` wurde aus `tauri.conf.json` entfernt (nicht in Tauri 2 gültig)
2. ✅ `"windowsState"` wurde aus `tauri.conf.json` entfernt (existiert nicht in Tauri 2)
3. ✅ Statischer Export für Desktop und Android Builds hinzugefügt
4. ✅ Build-Skripte aktualisiert

---

## 🚀 Build-Befehle

### Beide Builds gleichzeitig (.exe + .apk)

```bash
npm run build:all
```

Dies wird:
1. Statischen Build für Desktop erstellen
2. .exe Datei bauen
3. Statischen Build für Android erstellen
4. .apk Datei bauen

### Nur Desktop (.exe)

```bash
npm run build:desktop
# oder
npm run tauri:build
```

Die .exe findest du hier:
```
src-tai/target/release/bundle/nsis/Nexus Control_1.0.0_x64-setup.exe
```

### Nur Android (.apk)

```bash
npm run build:android
# oder
npm run cap:android:build
```

Die .apk findest du hier:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📋 Voraussetzungen

### Für Desktop (.exe):
- ✅ Rust & Cargo installiert:
  ```bash
  winget install Rustlang.Rust.MSVC
  ```
- ✅ Windows SDK (Visual Studio Build Tools)

### Für Android (.apk):
- ✅ Android Studio installiert
- ✅ Java JDK 17
- ✅ Android SDK
- ✅ Umgebungsvariablen gesetzt:
  ```bash
  export ANDROID_HOME=/path/to/Android/Sdk
  export JAVA_HOME=/path/to/jdk-17
  ```

---

## 🔧 Debug-Builds (schneller für Tests)

### Desktop Debug:
```bash
npm run tauri:build:debug
```

### Android Debug:
```bash
npm run cap:android:build
```

---

## 📁 Build-Ausgabe

Nach `npm run build:all`:

```
nexus-control/
├── src-tai/target/release/bundle/
│   ├── nsis/
│   │   └── Nexus Control_1.0.0_x64-setup.exe  ← Windows Installer
│   └── msi/
│       └── Nexus Control_1.0.0_x64_en-US.msi  ← MSI Installer
└── android/app/build/outputs/apk/
    ├── debug/
    │   └── app-debug.apk  ← Android Debug APK
    └── release/
        └── app-release.apk  ← Android Release APK (mit Signierung)
```

---

## ⚠️ Häufige Probleme

### "tauri: command not found"
```bash
# Globale Installation
npm install -g @tauri-apps/cli

# Oder lokal nutzen
npx tauri build
```

### "gradlew: permission denied" (Linux/macOS)
```bash
chmod +x android/gradlew
```

### "ANDROID_HOME not set"
```powershell
# Windows (PowerShell)
$env:ANDROID_HOME="C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
```

### "Rust compiler not found"
```bash
# Windows
winget install Rustlang.Rust.MSVC

# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

---

## 🎯 Build-Prozess im Detail

### Desktop Build:
1. ✅ `npm run build:static` - Erstellt statischen Export im `/out` Verzeichnis
2. ✅ Tauri packt die `/out` Dateien in die .exe

### Android Build:
1. ✅ `npm run build:static` - Erstellt statischen Export im `/out` Verzeichnis
2. ✅ `npm run cap:android:sync` - Kopiert Dateien zum Android Projekt
3. ✅ Gradle baut die .apk

---

## 📝 Weitere Informationen

- **Detaillierte Anleitung:** Siehe [BUILD.md](./BUILD.md)
- **Schnellstart:** Siehe [QUICKSTART.md](./QUICKSTART.md)
- **Tauri Docs:** https://tauri.app/v2/guides/
- **Capacitor Docs:** https://capacitorjs.com/docs

---

**Viel Erfolg beim Bauen! 🚀**

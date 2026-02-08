# Nexus Control - Build Anleitung

Diese Anleitung erklärt, wie du aus dem Nexus Control Projekt echte **.exe** (Windows) und **.apk** (Android) Dateien erstellst.

## 📋 Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Schnellstart](#schnellstart)
- [Desktop Build (.exe) mit Tauri](#desktop-build-exe-mit-tauri)
- [Android Build (.apk) mit Capacitor](#android-build-apk-mit-capacitor)
- [Beide Builds gleichzeitig](#beide-builds-gleichzeitig)
- [Fehlerbehebung](#fehlerbehebung)
- [Release-Builds](#release-builds)

---

## 🚀 Voraussetzungen

### Für alle Builds:
- **Node.js** (v18 oder höher)
- **Bun** oder **npm**
- **Git**

### Für Desktop (.exe) - Tauri:
- **Rust** und **Cargo** (https://www.rust-lang.org/tools/install)
- **Windows SDK** (für Windows-Builds)
- **WebView2** (in der Regel bereits auf Windows installiert)

### Für Android (.apk) - Capacitor:
- **Android Studio** (https://developer.android.com/studio)
- **Java JDK** (Version 17 oder 11)
- **Android SDK** (API Level 33+)
- **Gradle** (wird automatisch mit Android Studio installiert)

---

## ⚡ Schnellstart

### 1. Projekt herunterladen und Dependencies installieren:

```bash
# Projekt klonen
git clone <dein-repo-url>
cd nexus-control

# Dependencies installieren
bun install
# oder
npm install
```

### 2. Icons generieren (optional):

```bash
# Starte den Dev-Server
bun run dev

# In einem anderen Terminal:
curl -X POST http://localhost:3000/api/generate-icons
```

### 3. Build wählen:

- **Nur Desktop (.exe):** Siehe [Desktop Build](#desktop-build-exe-mit-tauri)
- **Nur Android (.apk):** Siehe [Android Build](#android-build-apk-mit-capacitor)
- **Beide:** `bun run build:all`

---

## 🖥️ Desktop Build (.exe) mit Tauri

### Schritt 1: Rust installieren

#### Windows:
```powershell
# PowerShell als Administrator ausführen
winget install Rustlang.Rust.MSVC

# Oder herunterladen von: https://www.rust-lang.org/tools/install
```

#### macOS:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### Linux:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Schritt 2: Windows SDK installieren (nur Windows)

Tauri benötigt das Windows SDK für Windows-Builds:

1. Lade **Visual Studio Build Tools** herunter: https://visualstudio.microsoft.com/downloads/
2. Wähle **"Desktopentwicklung mit C++"** während der Installation
3. Stelle sicher, dass **Windows 10 SDK** (oder neuer) installiert ist

### Schritt 3: Icons vorbereiten

Kopiere deine Icons in das `src-tai/icons/` Verzeichnis:

```bash
# Die folgenden Dateien werden benötigt:
# - src-tai/icons/32x32.png
# - src-tai/icons/128x128.png
# - src-tai/icons/128x128@2x.png
# - src-tai/icons/icon.ico
# - src-tai/icons/icon.icns (nur für macOS)

# Platzhalter-Icons erstellen (zum Testen):
# Windows ICO erstellen (benötigt ImageMagick)
convert public/icon-512.png src-tai/icons/icon.ico -define icon:auto-resize=256,128,96,64,48,32,16

# PNGs erstellen
cp public/icon-192.png src-tai/icons/128x128.png
cp public/icon-512.png src-tai/icons/128x128@2x.png
```

**Wichtig:** Für Release-Builds sollten hochwertige Icons verwendet werden!

### Schritt 4: Debug-Build erstellen

```bash
# Tauri Development Mode (mit Hot Reload)
bun run tauri:dev
```

Dies öffnet ein Fenster mit deiner App und aktiviert Hot Reload.

### Schritt 5: Release-Build erstellen

```bash
# Vollständiger Release-Build
bun run tauri:build

# Oder Debug-Build (schneller, für Tests)
bun run tauri:build:debug
```

### Schritt 6: Die .exe Datei finden

Nach erfolgreichem Build findest du die Installationsdateien hier:

```
src-tai/target/release/bundle/
├── msi/              # MSI Installer
│   └── Nexus Control_1.0.0_x64_en-US.msi
├── nsis/             # NSIS Installer (empfohlen)
│   └── Nexus Control_1.0.0_x64-setup.exe
└── bundle/           # Andere Formate
```

**Empfohlen:** Verwende die `.exe` aus dem `nsis/` Ordner.

### Tauri-Konfiguration anpassen

Bearbeite `src-tai/tauri.conf.json` um:

- App-Name und Version
- Fenstergröße und -einstellungen
- Icons und Metadaten
- Build-Targets (MSI, NSIS, etc.)

```json
{
  "productName": "Nexus Control",
  "version": "1.0.0",
  "bundle": {
    "targets": ["msi", "nsis"],
    "icon": ["icons/icon.ico"]
  }
}
```

---

## 📱 Android Build (.apk) mit Capacitor

### Schritt 1: Android Studio installieren

1. Lade Android Studio herunter: https://developer.android.com/studio
2. Installiere Android Studio
3. Starte Android Studio und schließe den Willkommensbildschirm
4. Öffne **Settings → Appearance & Behavior → System Settings → Android SDK**
5. Installiere:
   - **Android SDK Platform-Tools**
   - **Android SDK Build-Tools** (neueste Version)
   - **Android 13.0 (API Level 33)** oder neuer

### Schritt 2: Umgebungsvariablen einstellen

#### Windows (PowerShell):
```powershell
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"
```

Füge diese zu deinen Systemumgebungsvariablen hinzu.

#### macOS/Linux:
```bash
# Füge zu ~/.bashrc, ~/.zshrc oder ~/.profile hinzu:
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# oder
export ANDROID_HOME=$HOME/Android/Sdk          # Linux

export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jbr/Contents/Home  # macOS
# oder
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64  # Linux

export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
```

Lade dein Terminal neu (`source ~/.bashrc` oder `source ~/.zshrc`).

### Schritt 3: Gradle Wrapper erstellen

```bash
cd android
gradle wrapper
cd ..
```

### Schritt 4: Icons vorbereiten

```bash
# Android App Icons
# Die folgenden Größen werden benötigt:
# - mipmap-mdpi: 48x48
# - mipmap-hdpi: 72x72
# - mipmap-xhdpi: 96x96
# - mipmap-xxhdpi: 144x144
# - mipmap-xxxhdpi: 192x192

# Verzeichnisse erstellen
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Icons skalieren (benötigt ImageMagick)
convert public/icon-512.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert public/icon-512.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert public/icon-512.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert public/icon-512.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert public/icon-512.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Rund für runde Icons
convert public/icon-512.png -resize 48x48 -gravity center -extent 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
convert public/icon-512.png -resize 72x72 -gravity center -extent 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
convert public/icon-512.png -resize 96x96 -gravity center -extent 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
convert public/icon-512.png -resize 144x144 -gravity center -extent 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
convert public/icon-512.png -resize 192x192 -gravity center -extent 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
```

### Schritt 5: Capacitor initialisieren

```bash
# Capacitor installieren (falls noch nicht geschehen)
bun install

# Capacitor Projekt initialisieren
bun run cap:sync

# Android Plattform hinzufügen (automatisch bei sync)
bun run cap:android:sync
```

### Schritt 6: App in Android Studio öffnen (optional)

```bash
# Öffnet Android Studio mit dem Projekt
bun run cap:android:open
```

In Android Studio kannst du:
- App im Emulator testen
- App auf echtem Gerät testen
- APK manuell bauen

### Schritt 7: Debug APK bauen

```bash
# App als statisches Export bauen
bun run build:web
bun run export

# Mit Capacitor synchronisieren
bun run cap:android:sync

# APK bauen
cd android
./gradlew assembleDebug
cd ..
```

Die APK findest du hier:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Schritt 8: Release APK bauen

Für eine signierte Release-APK benötigst du einen Keystore:

```bash
# Keystore erstellen (einmalig)
keytool -genkey -v -keystore nexus-control-release.keystore -alias nexus-control -keyalg RSA -keysize 2048 -validity 10000

# Umgebungsvariablen für den Build setzen
export ANDROID_KEYSTORE_PATH=nexus-control-release.keystore
export ANDROID_KEYSTORE_ALIAS=nexus-control
export ANDROID_KEYSTORE_PASSWORD=dein-passwort
export ANDROID_KEYSTORE_ALIAS_PASSWORD=dein-passwort

# Release APK bauen
bun run cap:android:build:release
```

Die Release-APK findest du hier:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Android Manifest anpassen

Bearbeite `android/app/src/main/AndroidManifest.xml` um:

- App-Berechtigungen
- App-Name
- Theme und Erscheinungsbild

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme">
        <!-- Konfiguration -->
    </application>

    <!-- Berechtigungen -->
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
```

---

## 🎯 Beide Builds gleichzeitig

Um sowohl Desktop (.exe) als auch Android (.apk) in einem Schritt zu bauen:

```bash
# Voraussetzungen installieren
# - Rust und Windows SDK (für Desktop)
# - Android Studio und SDK (für Android)

# Alle Dependencies installieren
bun install

# Icons generieren
bun run dev
# (in anderem Terminal)
curl -X POST http://localhost:3000/api/generate-icons

# Beide Builds ausführen
bun run build:all
```

Dies führt `build:desktop` und `build:android` nacheinander aus.

---

## 🔧 Fehlerbehebung

### Tauri (Desktop) Fehler

**Fehler: "linker `link.exe` not found"**
- Lösung: Installiere Visual Studio Build Tools mit "Desktopentwicklung mit C++"

**Fehler: "WebView2 not found"**
- Lösung: Installiere WebView2 Runtime von https://developer.microsoft.com/microsoft-edge/webview2/

**Fehler: "Icon not found"**
- Lösung: Stelle sicher, dass alle Icons in `src-tai/icons/` vorhanden sind
- Oder kommentiere die icon-Pfade in `tauri.conf.json` aus

**Fehler: Rust compilation failed**
```bash
# Rust aktualisieren
rustup update

# Cache leeren
cd src-tai
cargo clean
cd ..
```

### Capacitor (Android) Fehler

**Fehler: "ANDROID_HOME not set"**
- Lösung: Setze die ANDROID_HOME Umgebungsvariable (siehe Schritt 2)

**Fehler: "JAVA_HOME not set"**
- Lösung: Setze die JAVA_HOME Umgebungsvariable auf JDK 17 oder 11

**Fehler: "gradlew: permission denied" (Linux/macOS)**
```bash
cd android
chmod +x gradlew
cd ..
```

**Fehler: "SDK location not found"**
- Lösung: Erstelle `android/local.properties`:
  ```properties
  sdk.dir=/path/to/Android/Sdk
  ```

**Fehler: "Failed to install APK"**
- Lösung: Aktiviere "USB Debugging" auf deinem Android-Gerät
- Lösung: Überprüfe, ob dein Gerät autorisiert ist (`adb devices`)

**Fehler: Build schlägt mit "Compilation error" fehl**
```bash
# Gradle Cache leeren
cd android
./gradlew clean
./gradlew build --refresh-dependencies
cd ..
```

**Fehler: "Out of memory"**
```bash
# Gradle mehr Speicher zuweisen
cd android
export GRADLE_OPTS="-Xmx4g -XX:MaxMetaspaceSize=512m"
./gradlew assembleDebug
cd ..
```

---

## 📦 Release-Builds

### Desktop Release (.exe)

Für einen signierten Release-Build unter Windows:

1. **Code Signing Zertifikat erhalten** (z.B. von DigiCert, Sectigo)
2. **Zertifikat konfigurieren** in `src-tai/tauri.conf.json`:
   ```json
   {
     "bundle": {
       "windows": {
         "certificateThumbprint": "DEIN-ZERTIFIKAT-THUMBPRINT",
         "digestAlgorithm": "sha256",
         "timestampUrl": "http://timestamp.digicert.com"
       }
     }
   }
   ```
3. **Build ausführen**:
   ```bash
   bun run tauri:build
   ```

### Android Release (.apk)

Für eine signierte Release-APK:

1. **Keystore erstellen** (siehe Schritt 8 oben)
2. **Build-Skript mit Keystore**:
   ```bash
   export ANDROID_KEYSTORE_PATH=nexus-control-release.keystore
   export ANDROID_KEYSTORE_ALIAS=nexus-control
   export ANDROID_KEYSTORE_PASSWORD=dein-passwort
   export ANDROID_KEYSTORE_ALIAS_PASSWORD=dein-passwort

   bun run cap:android:build:release
   ```

3. **oder in `android/app/build.gradle` konfigurieren**:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file("nexus-control-release.keystore")
               storePassword "dein-passwort"
               keyAlias "nexus-control"
               keyPassword "dein-passwort"
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

---

## 📝 Nützliche Befehle

### Tauri (Desktop)
```bash
bun run tauri:dev          # Development Mode mit Hot Reload
bun run tauri:build        # Release-Build
bun run tauri:build:debug  # Debug-Build
bun run tauri              # Tauri CLI
```

### Capacitor (Android)
```bash
bun run cap:sync           # Alle Plattformen synchronisieren
bun run cap:android:sync   # Nur Android synchronisieren
bun run cap:android:open   # Android Studio öffnen
bun run cap:android:build  # Debug APK bauen
```

### Allgemein
```bash
bun install                # Dependencies installieren
bun run dev                # Next.js Development Server
bun run build:web          # Next.js Build
bun run build:all          # Desktop + Android bauen
```

---

## 🎨 Anpassung

### App-Name ändern

**Desktop:** `src-tai/tauri.conf.json`
```json
{
  "productName": "Dein App Name",
  "bundle": {
    "shortDescription": "Kurze Beschreibung",
    "longDescription": "Lange Beschreibung"
  }
}
```

**Android:**
- `android/app/src/main/res/values/strings.xml`
- `capacitor.config.ts`

### App-Version ändern

Ändere die Version in:
- `package.json` → `"version": "1.0.0"`
- `src-tai/Cargo.toml` → `version = "1.0.0"`
- `src-tai/tauri.conf.json` → `"version": "1.0.0"`

### Fenstergröße ändern (Desktop)

`src-tai/tauri.conf.json`:
```json
{
  "app": {
    "windows": [{
      "width": 1400,
      "height": 900,
      "minWidth": 1024,
      "minHeight": 768,
      "resizable": true
    }]
  }
}
```

---

## 📚 Weitere Ressourcen

- **Tauri Dokumentation:** https://tauri.app/v1/guides/
- **Capacitor Dokumentation:** https://capacitorjs.com/docs
- **Android Studio Dokumentation:** https://developer.android.com/studio
- **Rust Buch:** https://doc.rust-lang.org/book/

---

## ✅ Checkliste vor dem Build

- [ ] Alle Dependencies installiert (`bun install`)
- [ ] Rust installiert (für Desktop)
- [ ] Windows SDK installiert (für Desktop)
- [ ] Android Studio installiert (für Android)
- [ ] Umgebungsvariablen gesetzt (ANDROID_HOME, JAVA_HOME)
- [ ] Icons vorbereitet und kopiert
- [ ] App-Name und Version angepasst
- [ ] Konfigurationen überprüft (`tauri.conf.json`, `capacitor.config.ts`)
- [ ] Lokaler Test erfolgreich (`bun run dev`)

---

**Viel Erfolg beim Bauen deiner Nexus Control App! 🚀**

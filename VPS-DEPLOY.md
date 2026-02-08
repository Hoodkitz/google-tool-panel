# Nexus Control - VPS Deployment Anleitung

Deine VPS: **192.109.200.35**

Diese Anleitung erklärt, wie du das Backend auf deiner VPS deployst und es mit Desktop (.exe) und Android (.apk) Apps verbindest.

---

## 🚀 Übersicht

**Architektur:**
- **VPS (192.109.200.35)**: Läuft das Next.js Backend mit allen APIs
- **Desktop App (.exe)**: Verbindet sich zur VPS
- **Android App (.apk)**: Verbindet sich zur VPS
- **Web-Browser**: Nutzt direkt die VPS

---

## 📋 Voraussetzungen

### Auf deiner VPS:
- ✅ SSH-Zugang
- ✅ Node.js (v18+) oder Bun
- ✅ Git
- ✅ pm2 (für Prozess-Management)
- ✅ UFW Firewall (optional)
- ✅ Nginx oder Caddy (empfohlen für HTTPS/Reverse Proxy)

### Lokal:
- ✅ SSH-Client
- ✅ Projekt-Dateien

---

## 🔧 Schritt 1: VPS vorbereiten

### 1.1 Per SSH verbinden

```bash
ssh root@192.109.200.35
```

### 1.2 System aktualisieren

```bash
# Debian/Ubuntu
apt update && apt upgrade -y

# Alpine
apk update && apk upgrade

# CentOS/RHEL
yum update -y
```

### 1.3 Node.js oder Bun installieren

#### Option A: Bun (empfohlen - schneller)

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

#### Option B: Node.js

```bash
# Debian/Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs
```

### 1.4 PM2 installieren

```bash
npm install -g pm2
# oder
bun install -g pm2
```

### 1.5 Git installieren

```bash
# Debian/Ubuntu
apt install -y git

# CentOS/RHEL
yum install -y git
```

### 1.6 Verzeichnis erstellen

```bash
mkdir -p /var/www/nexus-control
cd /var/www/nexus-control
```

---

## 📦 Schritt 2: Projekt auf VPS deployen

### 2.1 Projekt hochladen

#### Option A: Git Clone (empfohlen)

Lade dein Projekt zu GitHub/GitLab hoch, dann:

```bash
cd /var/www/nexus-control
git clone <dein-repo-url> .
```

#### Option B: SCP/SFTP

```bash
# Von deinem lokalen Computer
scp -r nexus-control root@192.109.200.35:/var/www/
```

#### Option C: SFTP-Client

Nutze FileZilla, WinSCP oder ähnliches um Dateien hochzuladen.

### 2.2 Dependencies installieren

```bash
cd /var/www/nexus-control
bun install
# oder
npm install
```

### 2.3 Build erstellen

```bash
bun run build
# oder
npm run build
```

### 2.4 Umgebungsvariablen konfigurieren

Erstelle `.env` Datei:

```bash
nano /var/www/nexus-control/.env
```

Inhalt:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# API Base URL (für Builds)
NEXT_PUBLIC_API_URL=http://192.109.200.35:3000

# Z.ai SDK (falls benötigt)
ZAI_API_KEY=dein-api-key

# Mullvad VPN (wenn du echte VPN-Integration nutzt)
MULLVAD_API_KEY=dein-mullvad-token

# Andere API-Keys
ANTHROPIC_API_KEY=dein-claude-key
OPENAI_API_KEY=dein-openai-key
```

### 2.5 Mit PM2 starten

```bash
# Starten
pm2 start bun --name "nexus-control" -- start

# Oder mit Node
pm2 start npm --name "nexus-control" -- start

# Status prüfen
pm2 status

# Logs ansehen
pm2 logs nexus-control

# Bei System-Neustart automatisch starten
pm2 startup
pm2 save
```

### 2.6 Firewall konfigurieren

```bash
# UFW (Ubuntu/Debian)
ufw allow 22/tcp    # SSH
ufw allow 3000/tcp  # App
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Firewall-cmd (CentOS/RHEL)
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## 🔒 Schritt 3: HTTPS mit Nginx Reverse Proxy (Empfohlen)

### 3.1 Nginx installieren

```bash
# Debian/Ubuntu
apt install -y nginx

# CentOS/RHEL
yum install -y nginx
```

### 3.2 Nginx Konfiguration erstellen

```bash
nano /etc/nginx/sites-available/nexus-control
```

Inhalt:

```nginx
server {
    listen 80;
    server_name 192.109.200.35;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS Header
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization';
    }
}
```

### 3.3 Konfiguration aktivieren

```bash
ln -s /etc/nginx/sites-available/nexus-control /etc/nginx/sites-enabled/

# Testen
nginx -t

# Neu starten
systemctl restart nginx

# Bei Boot starten
systemctl enable nginx
```

### 3.4 HTTPS mit Let's Encrypt (Optional aber empfohlen)

```bash
# Certbot installieren
apt install -y certbot python3-certbot-nginx

# Zertifikat erhalten
certbot --nginx -d 192.109.200.35

# Auto-Renewal konfigurieren
certbot renew --dry-run
```

### 3.5 Nginx Konfiguration für HTTPS aktualisieren

Nach Certbot wird die Konfiguration automatisch aktualisiert.

---

## 🏗️ Schritt 4: Desktop und Android Builds erstellen

### 4.1 Umgebungsvariable setzen

Erstelle `.env.production` im Projekt lokal:

```env
NEXT_PUBLIC_API_URL=http://192.109.200.35
# Oder mit HTTPS:
# NEXT_PUBLIC_API_URL=https://192.109.200.35
```

### 4.2 Desktop (.exe) bauen

```bash
# Setze die API-URL
export NEXT_PUBLIC_API_URL=http://192.109.200.35

# Baue
npm run build:desktop
```

Die .exe wird finden unter:
```
src-tai/target/release/bundle/nsis/Nexus Control_1.0.0_x64-setup.exe
```

### 4.3 Android (.apk) bauen

```bash
# Setze die API-URL
export NEXT_PUBLIC_API_URL=http://192.109.200.35

# Baue
npm run build:android
```

Die .apk findest du unter:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 4.4 APK auf Android Gerät installieren

```bash
# Über ADB
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Oder APK-Datei auf Gerät kopieren und installieren
```

---

## ✅ Schritt 5: Testen

### 5.1 Server testen

```bash
# Teste API auf VPS
curl http://192.109.200.35:3000/api

# Oder über Browser
http://192.109.200.35:3000
```

### 5.2 Desktop App testen

1. Installiere die .exe
2. Öffne die App
3. Teste VPN, Overwatch AI, Terminal - alles sollte funktionieren!

### 5.3 Android App testen

1. Installiere die .apk
2. Öffne die App
3. Teste alle Features

---

## 🔄 Schritt 6: Updates deployen

### Updates auf VPS:

```bash
# SSH zur VPS
ssh root@192.109.200.35

# Zum Projekt
cd /var/www/nexus-control

# Pull
git pull

# Dependencies aktualisieren
bun install

# Build
bun run build

# PM2 neustarten
pm2 restart nexus-control
```

### Oder Deploy-Script erstellen:

Erstelle `deploy.sh` auf VPS:

```bash
#!/bin/bash
cd /var/www/nexus-control
git pull
bun install
bun run build
pm2 restart nexus-control
echo "Deployment completed!"
```

Ausführbar machen:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📊 Monitoring

### PM2 Monitor

```bash
# Echtzeit-Monitoring
pm2 monit

# Logs
pm2 logs nexus-control

# Logs löschen
pm2 flush

# Dashboard
pm2 web
```

### Nginx Logs

```bash
# Access Logs
tail -f /var/log/nginx/access.log

# Error Logs
tail -f /var/log/nginx/error.log
```

---

## 🛡️ Security

### 1. SSH Key Authentication

```bash
# SSH Key lokal erstellen (falls nicht vorhanden)
ssh-keygen -t rsa -b 4096

# Public Key auf VPS kopieren
ssh-copy-id root@192.109.200.35

# Password-Login deaktivieren
nano /etc/ssh/sshd_config
# PasswordAuthentication no

# SSH neustarten
systemctl restart sshd
```

### 2. Fail2Ban installieren

```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. API-Rate Limiting

In deiner Next.js App:

```typescript
// middleware.ts oder API Routes
import { NextRequest, NextResponse } from 'next/server'

const rateLimit = new Map()

export function rateLimiter(req: NextRequest) {
  const ip = req.ip
  const now = Date.now()

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 })
    return true
  }

  const data = rateLimit.get(ip)
  if (now > data.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 })
    return true
  }

  if (data.count >= 100) {
    return false
  }

  data.count++
  return true
}
```

---

## 🐛 Troubleshooting

### App kann nicht zur VPS verbinden:

1. **Firewall prüfen:**
   ```bash
   ufw status
   ```

2. **Port prüfen:**
   ```bash
   netstat -tlnp | grep 3000
   ```

3. **PM2 Status prüfen:**
   ```bash
   pm2 status
   pm2 logs nexus-control
   ```

### CORS Fehler:

Stelle sicher, dass Nginx CORS Header sendet (siehe Schritt 3.2).

### 404 auf API-Endpunkten:

1. Backend läuft nicht → `pm2 restart nexus-control`
2. Falsche URL → `NEXT_PUBLIC_API_URL` prüfen
3. Build ohne API-URL → Neu builden mit `NEXT_PUBLIC_API_URL`

---

## 📞 Fertig!

Jetzt hast du:

✅ Backend auf VPS: `http://192.109.200.35`
✅ Desktop App (.exe) mit echter Funktionalität
✅ Android App (.apk) mit echter Funktionalität
✅ Web-Zugriff über Browser
✅ Alle APIs funktionieren wirklich!

**Viel Erfolg! 🚀**

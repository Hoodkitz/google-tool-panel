import { NextRequest, NextResponse } from 'next/server'

// Force static export for Tauri/Capacitor builds
export const dynamic = 'force-static'

export async function POST(request: NextRequest) {
  try {
    const { command, type = 'general' } = await request.json()

    if (!command) {
      return NextResponse.json(
        { error: 'Kommando erforderlich' },
        { status: 400 }
      )
    }

    const cmd = command.trim().toLowerCase()
    let output: string[] = []

    switch (type) {
      case 'llm':
        // LLM CLI Steuerung
        output = handleLLMCommand(cmd)
        break
      case 'vps':
        // VPS/RDP Steuerung
        output = handleVPSCommand(cmd)
        break
      case 'github':
        // GitHub Integration
        output = handleGitHubCommand(cmd)
        break
      case 'system':
        // System-Kommandos
        output = handleSystemCommand(cmd)
        break
      default:
        output = handleGeneralCommand(cmd)
    }

    return NextResponse.json({
      success: true,
      output,
      command,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Terminal API Error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

function handleGeneralCommand(cmd: string): string[] {
  const outputs: string[] = []

  switch (cmd) {
    case 'help':
      outputs.push('Nexus Control Terminal - Hilfe')
      outputs.push('')
      outputs.push('Allgemeine Befehle:')
      outputs.push('  help              - Zeigt diese Hilfe')
      outputs.push('  status            - Zeigt Systemstatus')
      outputs.push('  clear             - Leert das Terminal')
      outputs.push('')
      outputs.push('LLM Befehle (type: llm):')
      outputs.push('  llm list          - Listet alle aktiven LLMs auf')
      outputs.push('  llm use <name>    - Wählt einen LLM für Interaktion')
      outputs.push('  llm query <text>  - Sendet eine Abfrage an den aktiven LLM')
      outputs.push('')
      outputs.push('VPS/RDP Befehle (type: vps):')
      outputs.push('  vps list          - Listet alle VPS/RDP Verbindungen')
      outputs.push('  vps connect <id>  - Verbindet zu einem VPS/RDP')
      outputs.push('  vps disconnect    - Trennt die Verbindung')
      outputs.push('')
      outputs.push('GitHub Befehle (type: github):')
      outputs.push('  github status     - Zeigt Repo-Status')
      outputs.push('  github sync       - Synchronisiert mit Remote')
      outputs.push('  github branch     - Listet alle Branches')
      break
    case 'status':
      outputs.push('=== Nexus Control Status ===')
      outputs.push('System: Online')
      outputs.push('VPN: Aktiv')
      outputs.push('Aktive LLMs: 3')
      outputs.push('Verbundene Apps: 5')
      outputs.push('Laufende Aufgaben: 1')
      outputs.push('Speicherverbrauch: 45%')
      outputs.push('CPU-Auslastung: 23%')
      break
    default:
      outputs.push(`Unbekannter Befehl: ${cmd}`)
      outputs.push('Tippe "help" für verfügbare Befehle')
  }

  return outputs
}

function handleLLMCommand(cmd: string): string[] {
  const outputs: string[] = []

  if (cmd.startsWith('llm list')) {
    outputs.push('=== Aktive LLMs ===')
    outputs.push('1. Z AI (aktiv)')
    outputs.push('2. Claude (aktiv)')
    outputs.push('3. ChatGPT (aktiv)')
  } else if (cmd.startsWith('llm use')) {
    const llmName = cmd.replace('llm use', '').trim()
    outputs.push(`Aktiver LLM geändert zu: ${llmName}`)
  } else if (cmd.startsWith('llm query')) {
    const query = cmd.replace('llm query', '').trim()
    outputs.push(`Sende Abfrage an aktiven LLM: ${query}`)
    outputs.push('Antwort wird verarbeitet...')
    outputs.push('[LLM Antwort simuliert]')
  } else {
    outputs.push('LLM Befehle: list, use <name>, query <text>')
  }

  return outputs
}

function handleVPSCommand(cmd: string): string[] {
  const outputs: string[] = []

  if (cmd.startsWith('vps list')) {
    outputs.push('=== VPS/RDP Verbindungen ===')
    outputs.push('1. Production Server (192.168.1.100) - Verbunden')
    outputs.push('2. Staging Server (192.168.1.101) - Getrennt')
    outputs.push('3. Dev Server (192.168.1.102) - Getrennt')
  } else if (cmd.startsWith('vps connect')) {
    const serverId = cmd.replace('vps connect', '').trim()
    outputs.push(`Verbinde zu Server: ${serverId}`)
    outputs.push('Verbindung hergestellt ✓')
  } else if (cmd === 'vps disconnect') {
    outputs.push('Verbindung zum Server getrennt')
  } else {
    outputs.push('VPS Befehle: list, connect <id>, disconnect')
  }

  return outputs
}

function handleGitHubCommand(cmd: string): string[] {
  const outputs: string[] = []

  if (cmd === 'github status') {
    outputs.push('=== GitHub Status ===')
    outputs.push('Branch: main')
    outputs.push('Remote: origin')
    outputs.push('Letzter Commit: feat: add overwatch ai interface')
    outputs.push('Status: Keine Änderungen')
  } else if (cmd === 'github sync') {
    outputs.push('Synchronisiere mit Remote...')
    outputs.push('Fetching origin/main...')
    outputs.push('Sync abgeschlossen ✓')
  } else if (cmd === 'github branch') {
    outputs.push('=== Branches ===')
    outputs.push('* main')
    outputs.push('  feature/overwatch')
    outputs.push('  feature/vpn-integration')
    outputs.push('  bugfix/terminal-issues')
  } else {
    outputs.push('GitHub Befehle: status, sync, branch')
  }

  return outputs
}

function handleSystemCommand(cmd: string): string[] {
  const outputs: string[] = []

  switch (cmd) {
    case 'system info':
      outputs.push('=== System Information ===')
      outputs.push('OS: Linux')
      outputs.push('Kernel: 5.15.0')
      outputs.push('Memory: 16GB')
      outputs.push('CPU: 8 Cores')
      break
    case 'system restart':
      outputs.push('System-Neustart wird initiiert...')
      break
    default:
      outputs.push('System Befehle: info, restart')
  }

  return outputs
}

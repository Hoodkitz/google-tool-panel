'use client'

import { useState, useEffect } from 'react'
import { API_CONFIG, apiCall } from '@/lib/api-config'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Wifi, 
  WifiOff, 
  Bot, 
  Terminal, 
  GitBranch, 
  Server, 
  Cpu,
  Brain,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Settings,
  LayoutDashboard
} from 'lucide-react'

type VPNStatus = 'connected' | 'disconnected' | 'connecting' | 'error'

interface LLMServer {
  id: string
  name: string
  type: 'claude' | 'chatgpt' | 'venice-ai' | 'z-ai' | 'openrouter' | 'custom'
  apiKey?: string
  baseUrl?: string
  enabled: boolean
}

interface GoogleApp {
  id: string
  name: string
  url: string
  category: 'aistudio' | 'antigravity' | 'lab' | 'other'
  enabled: boolean
}

interface SelfImprovementTask {
  id: string
  title: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high'
  timestamp: Date
}

export default function NexusControlDashboard() {
  const [vpnStatus, setVpnStatus] = useState<VPNStatus>('disconnected')
  const [vpnApiKey, setVpnApiKey] = useState('')
  const [llmServers, setLlmServers] = useState<LLMServer[]>([
    { id: '1', name: 'Claude', type: 'claude', enabled: false },
    { id: '2', name: 'ChatGPT', type: 'chatgpt', enabled: false },
    { id: '3', name: 'Venice AI', type: 'venice-ai', enabled: false },
    { id: '4', name: 'Z AI', type: 'z-ai', enabled: true },
    { id: '5', name: 'OpenRouter', type: 'openrouter', enabled: false },
  ])
  const [googleApps, setGoogleApps] = useState<GoogleApp[]>([
    { id: '1', name: 'Google AI Studio', url: 'https://aistudio.google.com', category: 'aistudio', enabled: true },
    { id: '2', name: 'Project Antigravity', url: 'https://antigravity.google', category: 'antigravity', enabled: true },
    { id: '3', name: 'Google Labs', url: 'https://labs.google', category: 'lab', enabled: true },
    { id: '4', name: 'NotebookLM', url: 'https://notebooklm.google', category: 'lab', enabled: true },
    { id: '5', name: 'Gemini', url: 'https://gemini.google.com', category: 'other', enabled: true },
  ])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selfImprovementTasks, setSelfImprovementTasks] = useState<SelfImprovementTask[]>([
    {
      id: '1',
      title: 'Code-Optimierung analysieren',
      description: 'Analyse der Codebasis für Performance-Verbesserungen',
      status: 'completed',
      priority: 'medium',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      title: 'Sicherheitsscanning durchführen',
      description: 'Automatische Überprüfung auf Sicherheitslücken',
      status: 'running',
      priority: 'high',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: '3',
      title: 'Neue Integration hinzufügen',
      description: 'Automatische Erkennung und Integration neuer Tools',
      status: 'pending',
      priority: 'medium',
      timestamp: new Date()
    },
    {
      id: '4',
      title: 'Performance-Metriken optimieren',
      description: 'Optimierung der Anwendungsleistung basierend auf Nutzungsdaten',
      status: 'pending',
      priority: 'low',
      timestamp: new Date()
    }
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> Nexus Control Terminal v1.0',
    '> System bereit für Befehle...',
    '> Tippe "help" für verfügbare Befehle'
  ])
  const [newLLMName, setNewLLMName] = useState('')
  const [newLLMType, setNewLLMType] = useState<'claude' | 'chatgpt' | 'venice-ai' | 'z-ai' | 'openrouter' | 'custom'>('custom')
  const [newLLMKey, setNewLLMKey] = useState('')
  const [newLLMUrl, setNewLLMUrl] = useState('')

  // Register Service Worker for PWA
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }
  }, [])

  const toggleVPN = async () => {
    if (vpnStatus === 'connecting') return

    const newStatus = vpnStatus === 'connected' ? 'disconnected' : 'connected'
    setVpnStatus('connecting')

    try {
      const response = await apiCall(API_CONFIG.endpoints.vpn, {
        method: 'POST',
        body: JSON.stringify({ action: newStatus, apiKey: vpnApiKey })
      })

      if (response.ok) {
        const data = await response.json()
        setVpnStatus(newStatus)
        addTerminalOutput(`VPN ${newStatus === 'connected' ? 'aktiviert' : 'deaktiviert'}`)
        if (data.message) {
          addTerminalOutput(data.message)
        }
      } else {
        setVpnStatus('error')
        addTerminalOutput('Fehler beim VPN-Verbindungsaufbau')
      }
    } catch (error) {
      setVpnStatus('error')
      addTerminalOutput('Verbindungsfehler zum VPN-Service: ' + (error as Error).message)
    }
  }

  const addTerminalOutput = (message: string) => {
    setTerminalOutput(prev => [...prev, `> ${message}`])
  }

  const handleTerminalCommand = (command: string) => {
    const cmd = command.trim().toLowerCase()
    addTerminalOutput(command)
    
    switch (cmd) {
      case 'help':
        addTerminalOutput('Verfügbare Befehle:')
        addTerminalOutput('  help      - Zeigt diese Hilfe')
        addTerminalOutput('  status    - Zeigt Systemstatus')
        addTerminalOutput('  llm       - LLM CLI Befehle')
        addTerminalOutput('  vps       - VPS/RDP Verbindung')
        addTerminalOutput('  github    - GitHub Integration')
        addTerminalOutput('  clear     - Terminal leeren')
        break
      case 'status':
        addTerminalOutput(`VPN Status: ${vpnStatus}`)
        addTerminalOutput(`Aktive LLMs: ${llmServers.filter(l => l.enabled).length}`)
        addTerminalOutput(`Google Apps: ${googleApps.filter(g => g.enabled).length}`)
        addTerminalOutput(`Selbstverbesserung: ${selfImprovementTasks.filter(t => t.status === 'running').length} aktiv`)
        break
      case 'llm':
        addTerminalOutput('LLM CLI aktiviert. Wähle LLM für Interaktion:')
        llmServers.filter(l => l.enabled).forEach(l => addTerminalOutput(`  - ${l.name}`))
        break
      case 'clear':
        setTerminalOutput(['> Terminal geleert'])
        break
      default:
        addTerminalOutput(`Unbekannter Befehl: ${command}`)
        addTerminalOutput('Tippe "help" für verfügbare Befehle')
    }
  }

  const openGoogleApp = (app: GoogleApp) => {
    window.open(app.url, '_blank')
    addTerminalOutput(`Öffne ${app.name}...`)
  }

  const addLLMServer = () => {
    if (!newLLMName) return
    
    const newServer: LLMServer = {
      id: Date.now().toString(),
      name: newLLMName,
      type: newLLMType,
      apiKey: newLLMKey,
      baseUrl: newLLMUrl,
      enabled: true
    }
    
    setLlmServers(prev => [...prev, newServer])
    setNewLLMName('')
    setNewLLMKey('')
    setNewLLMUrl('')
    addTerminalOutput(`LLM Server "${newLLMName}" hinzugefügt`)
  }

  const removeLLMServer = (id: string) => {
    setLlmServers(prev => prev.filter(l => l.id !== id))
    addTerminalOutput(`LLM Server entfernt`)
  }

  const toggleLLMServer = (id: string) => {
    setLlmServers(prev => prev.map(l => 
      l.id === id ? { ...l, enabled: !l.enabled } : l
    ))
  }

  const runNextTask = async () => {
    const pendingTask = selfImprovementTasks.find(t => t.status === 'pending')
    if (!pendingTask) {
      addTerminalOutput('Keine ausstehenden Aufgaben')
      return
    }

    setSelfImprovementTasks(prev => prev.map(t =>
      t.id === pendingTask.id ? { ...t, status: 'running' as const } : t
    ))
    addTerminalOutput(`Starte Aufgabe: ${pendingTask.title}`)

    try {
      const response = await apiCall(`${API_CONFIG.endpoints.selfImprovement}?action=execute`, {
        method: 'POST',
        body: JSON.stringify({ action: 'execute', taskId: pendingTask.id })
      })

      if (response.ok) {
        const data = await response.json()
        setSelfImprovementTasks(prev => prev.map(t =>
          t.id === pendingTask.id
            ? { ...t, status: 'completed' as const }
            : t
        ))
        addTerminalOutput(`✓ Aufgabe abgeschlossen: ${pendingTask.title}`)
        if (data.result?.output) {
          addTerminalOutput(data.result.output)
        }
      } else {
        setSelfImprovementTasks(prev => prev.map(t =>
          t.id === pendingTask.id
            ? { ...t, status: 'failed' as const }
            : t
        ))
        addTerminalOutput(`✗ Aufgabe fehlgeschlagen: ${pendingTask.title}`)
      }
    } catch (error) {
      setSelfImprovementTasks(prev => prev.map(t =>
        t.id === pendingTask.id
          ? { ...t, status: 'failed' as const }
          : t
      ))
      addTerminalOutput(`✗ Fehler bei Aufgabe: ${pendingTask.title} - ${(error as Error).message}`)
    }
  }

  const getVPNStatusColor = () => {
    switch (vpnStatus) {
      case 'connected': return 'text-green-500'
      case 'disconnected': return 'text-red-500'
      case 'connecting': return 'text-yellow-500'
      case 'error': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  const getVPNStatusIcon = () => {
    switch (vpnStatus) {
      case 'connected': return <Wifi className="h-5 w-5" />
      case 'disconnected': return <WifiOff className="h-5 w-5" />
      case 'connecting': return <Cpu className="h-5 w-5 animate-pulse" />
      case 'error': return <XCircle className="h-5 w-5" />
      default: return <Shield className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Nexus Control</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Integration Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${getVPNStatusColor()}`}>
                {getVPNStatusIcon()}
                <span className="text-sm font-medium">
                  {vpnStatus === 'connected' ? 'VPN Aktiv' : 
                   vpnStatus === 'connecting' ? 'Verbinde...' :
                   vpnStatus === 'error' ? 'Fehler' : 'VPN Inaktiv'}
                </span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Einstellungen
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="vpn">
              <Shield className="h-4 w-4 mr-2" />
              VPN
            </TabsTrigger>
            <TabsTrigger value="google-apps">
              <Bot className="h-4 w-4 mr-2" />
              Google Apps
            </TabsTrigger>
            <TabsTrigger value="llm">
              <Cpu className="h-4 w-4 mr-2" />
              LLMs
            </TabsTrigger>
            <TabsTrigger value="overwatch" className="hidden lg:flex">
              <Zap className="h-4 w-4 mr-2" />
              Overwatch
            </TabsTrigger>
            <TabsTrigger value="terminal" className="hidden lg:flex">
              <Terminal className="h-4 w-4 mr-2" />
              Terminal
            </TabsTrigger>
            <TabsTrigger value="self-improvement">
              <Brain className="h-4 w-4 mr-2" />
              Selbstverbesserung
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">VPN Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${getVPNStatusColor()}`}>
                      {getVPNStatusIcon()}
                      <span className="text-2xl font-bold">
                        {vpnStatus === 'connected' ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Aktive LLMs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {llmServers.filter(l => l.enabled).length}
                    </span>
                    <Bot className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Google Apps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {googleApps.filter(g => g.enabled).length}
                    </span>
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Laufende Aufgaben</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {selfImprovementTasks.filter(t => t.status === 'running').length}
                    </span>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Schnellaktionen</CardTitle>
                <CardDescription>Häufig verwendete Funktionen</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={toggleVPN}
                  disabled={vpnStatus === 'connecting'}
                  className="h-auto py-4 flex-col gap-2"
                  variant={vpnStatus === 'connected' ? 'destructive' : 'default'}
                >
                  {getVPNStatusIcon()}
                  <span>{vpnStatus === 'connected' ? 'VPN Deaktivieren' : 'VPN Aktivieren'}</span>
                </Button>
                <Button 
                  onClick={() => setActiveTab('overwatch')}
                  className="h-auto py-4 flex-col gap-2"
                  variant="outline"
                >
                  <Zap className="h-5 w-5" />
                  <span>Overwatch AI öffnen</span>
                </Button>
                <Button 
                  onClick={runNextTask}
                  className="h-auto py-4 flex-col gap-2"
                  variant="outline"
                >
                  <Play className="h-5 w-5" />
                  <span>Nächste Aufgabe ausführen</span>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Aktuelle Aktivität</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {terminalOutput.slice(-5).map((output, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground font-mono">
                        {output}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VPN Tab */}
          <TabsContent value="vpn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mullvad VPN Steuerung</CardTitle>
                <CardDescription>Aktiviere oder deaktiviere VPN für die gesamte Anwendung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-6 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    {getVPNStatusIcon()}
                    <div>
                      <div className="text-2xl font-bold">
                        {vpnStatus === 'connected' ? 'VPN Verbunden' : 
                         vpnStatus === 'connecting' ? 'Verbinde...' :
                         vpnStatus === 'error' ? 'Verbindungsfehler' : 'VPN Getrennt'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {vpnStatus === 'connected' ? 'Alle Verbindungen sind geschützt' : 'Verbindungen ohne VPN-Schutz'}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={toggleVPN}
                    disabled={vpnStatus === 'connecting'}
                    size="lg"
                    variant={vpnStatus === 'connected' ? 'destructive' : 'default'}
                  >
                    {vpnStatus === 'connecting' ? 'Verbinde...' : 
                     vpnStatus === 'connected' ? 'Deaktivieren' : 'Aktivieren'}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="vpn-api-key">Mullvad API Key</Label>
                  <Input
                    id="vpn-api-key"
                    type="password"
                    placeholder="Dein Mullvad Account Token"
                    value={vpnApiKey}
                    onChange={(e) => setVpnApiKey(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Finde deinen Account Token im Mullvad Account Dashboard
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google Apps Tab */}
          <TabsContent value="google-apps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Google Anwendungen</CardTitle>
                <CardDescription>Öffne Google AI Studio, Antigravity, Labs und mehr in separaten Tabs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['aistudio', 'antigravity', 'lab', 'other'].map(category => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {category === 'aistudio' ? 'AI Studio' : 
                       category === 'antigravity' ? 'Antigravity' : 
                       category === 'lab' ? 'Labs' : 'Andere'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {googleApps
                        .filter(app => app.category === category)
                        .map(app => (
                          <div 
                            key={app.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{app.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={app.enabled}
                                onCheckedChange={() => {
                                  setGoogleApps(prev => prev.map(a => 
                                    a.id === app.id ? { ...a, enabled: !a.enabled } : a
                                  ))
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openGoogleApp(app)}
                                disabled={!app.enabled}
                              >
                                Öffnen
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LLM Tab */}
          <TabsContent value="llm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Multi-LLM Konfiguration</CardTitle>
                <CardDescription>Verwalte Claude, ChatGPT, Venice AI, Z AI, OpenRouter und mehr</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {llmServers.map(llm => (
                    <div key={llm.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Bot className={`h-5 w-5 ${llm.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div>
                          <div className="font-medium">{llm.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">{llm.type}</div>
                        </div>
                        {llm.enabled && (
                          <Badge variant="default" className="ml-2">Aktiv</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={llm.enabled}
                          onCheckedChange={() => toggleLLMServer(llm.id)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeLLMServer(llm.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Neuen LLM hinzufügen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="llm-name">Name</Label>
                      <Input
                        id="llm-name"
                        placeholder="z.B. Mein Custom LLM"
                        value={newLLMName}
                        onChange={(e) => setNewLLMName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="llm-type">Typ</Label>
                      <select
                        id="llm-type"
                        value={newLLMType}
                        onChange={(e) => setNewLLMType(e.target.value as any)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="custom">Custom</option>
                        <option value="claude">Claude</option>
                        <option value="chatgpt">ChatGPT</option>
                        <option value="venice-ai">Venice AI</option>
                        <option value="z-ai">Z AI</option>
                        <option value="openrouter">OpenRouter</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="llm-key">API Key (optional)</Label>
                      <Input
                        id="llm-key"
                        type="password"
                        placeholder="API Key"
                        value={newLLMKey}
                        onChange={(e) => setNewLLMKey(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="llm-url">Base URL (optional)</Label>
                      <Input
                        id="llm-url"
                        placeholder="https://api.example.com"
                        value={newLLMUrl}
                        onChange={(e) => setNewLLMUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={addLLMServer}>
                    <Plus className="h-4 w-4 mr-2" />
                    LLM hinzufügen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overwatch Tab */}
          <TabsContent value="overwatch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Overwatch AI Interface
                </CardTitle>
                <CardDescription>
                  Zentrale Kommunikations- und Arbeitsfläche für alle Anwendungen und LLMs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertDescription>
                    Overwatch AI verbindet alle deine Anwendungen und ermöglicht ihnen, miteinander zu kommunizieren und zusammenzuarbeiten.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Verbundene LLMs</Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {llmServers.filter(l => l.enabled).map(llm => (
                        <div key={llm.id} className="flex items-center gap-2 p-3 border rounded-lg">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{llm.name}</span>
                        </div>
                      ))}
                      {llmServers.filter(l => l.enabled).length === 0 && (
                        <div className="text-sm text-muted-foreground p-3 border rounded-lg border-dashed">
                          Keine LLMs aktiviert. Aktiviere mindestens einen im LLM Tab.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Verbundene Google Apps</Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {googleApps.filter(g => g.enabled).map(app => (
                        <div key={app.id} className="flex items-center gap-2 p-3 border rounded-lg">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{app.name}</span>
                        </div>
                      ))}
                      {googleApps.filter(g => g.enabled).length === 0 && (
                        <div className="text-sm text-muted-foreground p-3 border rounded-lg border-dashed">
                          Keine Google Apps aktiviert.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="overwatch-prompt">Overwatch AI Anweisung</Label>
                  <div className="flex gap-2">
                    <Input
                      id="overwatch-prompt"
                      placeholder="Gib eine Anweisung für Overwatch AI..."
                      className="flex-1"
                    />
                    <Button>
                      <Zap className="h-4 w-4 mr-2" />
                      Ausführen
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Overwatch AI wird alle verbundenen Dienste nutzen, um deine Anweisung auszuführen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terminal Tab */}
          <TabsContent value="terminal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Nexus Control Terminal
                </CardTitle>
                <CardDescription>
                  Interagiere mit LLM CLI, VPS/RDP, GitHub und mehr
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 w-full rounded-md border p-4 bg-muted">
                  <div className="space-y-1 font-mono text-sm">
                    {terminalOutput.map((output, idx) => (
                      <div key={idx} className="text-muted-foreground">
                        {output}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Gib einen Befehl ein..."
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTerminalCommand(terminalInput)
                        setTerminalInput('')
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      handleTerminalCommand(terminalInput)
                      setTerminalInput('')
                    }}
                  >
                    Ausführen
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleTerminalCommand('help')}>
                    <Terminal className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTerminalCommand('status')}>
                    <Server className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTerminalCommand('llm')}>
                    <Bot className="h-4 w-4 mr-2" />
                    LLM
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTerminalCommand('vps')}>
                    <Server className="h-4 w-4 mr-2" />
                    VPS
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTerminalCommand('github')}>
                    <GitBranch className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTerminalCommand('clear')}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Self Improvement Tab */}
          <TabsContent value="self-improvement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Autonomer Selbstverbesserungs-Bereich
                </CardTitle>
                <CardDescription>
                  Kontinuierliche Selbstverbesserung, Self-Debugging und autonome Entwicklung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={runNextTask} disabled={selfImprovementTasks.filter(t => t.status === 'pending').length === 0}>
                    <Play className="h-4 w-4 mr-2" />
                    Nächste Aufgabe ausführen
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSelfImprovementTasks(prev => prev.filter(t => t.status !== 'completed' && t.status !== 'failed'))
                  }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                        Abgeschlossen entfernen
                  </Button>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {selfImprovementTasks.map(task => (
                      <Card key={task.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                {task.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {task.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                                {task.status === 'running' && <Cpu className="h-4 w-4 text-yellow-500 animate-pulse" />}
                                {task.status === 'pending' && <Clock className="h-4 w-4 text-gray-500" />}
                                <h4 className="font-semibold">{task.title}</h4>
                                <Badge variant={
                                  task.priority === 'high' ? 'destructive' :
                                  task.priority === 'medium' ? 'default' : 'secondary'
                                }>
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {task.timestamp.toLocaleString('de-DE')}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {task.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelfImprovementTasks(prev => prev.map(t => 
                                      t.id === task.id ? { ...t, status: 'running' as const } : t
                                    ))
                                    addTerminalOutput(`Starte: ${task.title}`)
                                  }}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Starten
                                </Button>
                              )}
                              {task.status === 'running' && (
                                <Badge variant="outline" className="animate-pulse">
                                  Läuft...
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>© 2025 Nexus Control - AI-Powered Integration Hub</span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Geschützt durch {vpnStatus === 'connected' ? 'Mullvad VPN' : 'kein VPN'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Play({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

// Force static export for Tauri/Capacitor builds
export const dynamic = 'force-static'

export async function POST(request: NextRequest) {
  try {
    const zai = await ZAI.create()

    // Icon prompts
    const iconPrompt = 'Simple minimalist logo featuring a brain with network connections, modern tech style, blue gradient, clean geometric shapes, white background, high quality, app icon design'

    // Generate 512x512 icon
    const response512 = await zai.images.generations.create({
      prompt: iconPrompt,
      size: '1024x1024'
    })

    // Generate 192x192 icon
    const response192 = await zai.images.generations.create({
      prompt: iconPrompt,
      size: '1024x1024'
    })

    // Save icons
    const publicDir = path.join(process.cwd(), 'public')
    
    const icon512Base64 = response512.data[0].base64
    const buffer512 = Buffer.from(icon512Base64, 'base64')
    fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buffer512)

    const icon192Base64 = response192.data[0].base64
    const buffer192 = Buffer.from(icon192Base64, 'base64')
    fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buffer192)

    return NextResponse.json({
      success: true,
      message: 'Icons generated successfully',
      icons: {
        'icon-512.png': buffer512.length,
        'icon-192.png': buffer192.length
      }
    })
  } catch (error) {
    console.error('Icon generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate icons', details: error.message },
      { status: 500 }
    )
  }
}

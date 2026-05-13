// Vercel Serverless Function — proxies code execution to OneCompiler API
// Place this file at: api/oc-run.js
// ES module format — package.json must have "type": "module"

export default async function handler(req, res) {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const apiKey = process.env.VITE_ONECOMPILER_API_KEY

    if (!apiKey) {
        return res.status(500).json({ success: false, error: 'OneCompiler API key not configured on server.' })
    }

    try {
        const response = await fetch('https://api.onecompiler.com/v1/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(req.body)
        })

        const rawText = await response.text()
        let data
        try {
            data = JSON.parse(rawText)
        } catch (e) {
            return res.status(response.status).json({
                success: false,
                error: `OneCompiler returned HTTP ${response.status} non-JSON: ${rawText.slice(0, 200)}`
            })
        }

        return res.status(response.status).json(data)
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message })
    }
}
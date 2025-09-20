import { Router } from 'express'
import multer from 'multer'
import csvParser from 'csv-parser'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

// In-memory storage (replace with DB later)
let companyProfile: any = null
const instances: any[] = []

const profileSchema = z.object({
  name: z.string().min(1),
  industry: z.string().min(1),
  size: z.string().min(1),
  contactEmail: z.string().email()
})

const instanceSchema = z.object({
  name: z.string().min(1),
  provider: z.enum(['aws','gcp','azure']),
  region: z.string().min(1),
  type: z.string().min(1),
  cpu: z.number().positive(),
  memoryGb: z.number().positive(),
  storageGb: z.number().nonnegative(),
  monthlyCost: z.number().nonnegative(),
  environment: z.enum(['prod','staging','dev']),
  // Performance & Analytics fields
  status: z.enum(['running','stopped','terminated','pending']),
  cpuUtilization: z.number().min(0).max(100),
  memoryUtilization: z.number().min(0).max(100),
  networkInGb: z.number().nonnegative(),
  networkOutGb: z.number().nonnegative(),
  // Cost breakdown
  computeCost: z.number().nonnegative(),
  storageCost: z.number().nonnegative(),
  networkCost: z.number().nonnegative(),
  // Metadata for analytics
  tags: z.array(z.string()),
  createdDate: z.string(),
  lastActivity: z.string(),
  uptime: z.number().min(0).max(744), // Max hours in a month
  // Usage patterns
  peakCpuUsage: z.number().min(0).max(100),
  avgResponseTime: z.number().nonnegative(),
  requestsPerHour: z.number().nonnegative()
})

const upload = multer({ dest: path.join(process.cwd(), 'backend', 'uploads') })

const router = Router()

router.post('/profile', (req, res) => {
  try {
    const parsed = profileSchema.parse(req.body)
    companyProfile = parsed
    return res.json({ success: true, profile: companyProfile })
  } catch (e: any) {
    return res.status(400).json({ error: 'Invalid profile', details: e.errors })
  }
})

router.get('/profile', (_req, res) => {
  if (!companyProfile) return res.status(404).json({ error: 'No profile' })
  return res.json(companyProfile)
})

router.post('/instance', (req, res) => {
  try {
    const parsed = instanceSchema.parse({ 
      ...req.body, 
      cpu: Number(req.body.cpu), 
      memoryGb: Number(req.body.memoryGb), 
      storageGb: Number(req.body.storageGb), 
      monthlyCost: Number(req.body.monthlyCost),
      cpuUtilization: Number(req.body.cpuUtilization),
      memoryUtilization: Number(req.body.memoryUtilization),
      networkInGb: Number(req.body.networkInGb),
      networkOutGb: Number(req.body.networkOutGb),
      computeCost: Number(req.body.computeCost),
      storageCost: Number(req.body.storageCost),
      networkCost: Number(req.body.networkCost),
      uptime: Number(req.body.uptime),
      peakCpuUsage: Number(req.body.peakCpuUsage),
      avgResponseTime: Number(req.body.avgResponseTime),
      requestsPerHour: Number(req.body.requestsPerHour),
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      createdDate: req.body.createdDate || new Date().toISOString(),
      lastActivity: req.body.lastActivity || new Date().toISOString()
    })
    const stored = { id: crypto.randomUUID(), ...parsed }
    instances.push(stored)
    return res.json({ success: true, instance: stored })
  } catch (e: any) {
    return res.status(400).json({ error: 'Invalid instance', details: e.errors })
  }
})

router.get('/instances', (_req, res) => {
  return res.json({ instances })
})

router.post('/import-csv', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File required' })
  const filePath = req.file.path
  const parsed: any[] = []
  const errors: any[] = []
  const headerExpect = ['name','provider','region','type','cpu','memoryGb','storageGb','monthlyCost','environment','status','cpuUtilization','memoryUtilization','networkInGb','networkOutGb','computeCost','storageCost','networkCost','tags','uptime','peakCpuUsage','avgResponseTime','requestsPerHour']
  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('headers', (headers: string[]) => {
          const normalized = headers.map(h => h.trim())
          if (headerExpect.join(',') !== normalized.join(',')) {
            reject(new Error('Invalid headers. Expected '+ headerExpect.join(',')))
          }
        })
        .on('data', (row: any) => {
          try {
            const parsedRow = instanceSchema.parse({
              name: row.name,
              provider: (row.provider||'').toLowerCase(),
              region: row.region,
              type: row.type,
              cpu: Number(row.cpu),
              memoryGb: Number(row.memoryGb),
              storageGb: Number(row.storageGb),
              monthlyCost: Number(row.monthlyCost),
              environment: (row.environment||'').toLowerCase(),
              status: (row.status||'').toLowerCase(),
              cpuUtilization: Number(row.cpuUtilization),
              memoryUtilization: Number(row.memoryUtilization),
              networkInGb: Number(row.networkInGb),
              networkOutGb: Number(row.networkOutGb),
              computeCost: Number(row.computeCost),
              storageCost: Number(row.storageCost),
              networkCost: Number(row.networkCost),
              tags: row.tags ? row.tags.split(';').filter((t: string) => t.trim()) : [],
              uptime: Number(row.uptime),
              peakCpuUsage: Number(row.peakCpuUsage),
              avgResponseTime: Number(row.avgResponseTime),
              requestsPerHour: Number(row.requestsPerHour),
              createdDate: new Date().toISOString(),
              lastActivity: new Date().toISOString()
            })
            const stored = { id: crypto.randomUUID(), ...parsedRow }
            parsed.push(stored)
          } catch (err: any) {
            errors.push({ row, err: err.errors })
          }
        })
        .on('end', () => resolve())
        .on('error', (err: any) => reject(err))
    })
    // add valid
    parsed.forEach(p => instances.push(p))
    return res.json({ success: true, imported: parsed.length, errors, instances })
  } catch (e: any) {
    return res.status(400).json({ error: e.message })
  } finally {
    fs.unlink(filePath, () => {})
  }
})

export { router as companyRouter }
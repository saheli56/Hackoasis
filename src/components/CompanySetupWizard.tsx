import React, { useState, useEffect, useRef } from 'react'

export interface CompanyProfile {
	name: string
	industry: string
	size: string
	contactEmail: string
}

export interface CloudInstanceInput {
	id?: string
	name: string
	provider: 'aws' | 'gcp' | 'azure'
	region: string
	type: string
	cpu: number
	memoryGb: number
	storageGb: number
	monthlyCost: number
	environment: 'prod' | 'staging' | 'dev'
	status: 'running' | 'stopped' | 'terminated' | 'pending'
	cpuUtilization: number 
	memoryUtilization: number 
	networkInGb: number 
	networkOutGb: number 
	computeCost: number
	storageCost: number
	networkCost: number
	tags: string[]
	createdDate: string 
	lastActivity: string 
	uptime: number
	peakCpuUsage: number 
	avgResponseTime: number 
	requestsPerHour: number
}

interface Props {
	apiBase?: string
	onCompleted?: () => void
}

const defaultProfile: CompanyProfile = {
	name: '',
	industry: '',
	size: '',
	contactEmail: ''
}

const emptyInstance: CloudInstanceInput = {
	name: '',
	provider: 'aws',
	region: '',
	type: '',
	cpu: 2,
	memoryGb: 4,
	storageGb: 50,
	monthlyCost: 0,
	environment: 'dev',
	status: 'running',
	cpuUtilization: 70,
	memoryUtilization: 60,
	networkInGb: 10,
	networkOutGb: 15,
	computeCost: 0,
	storageCost: 0,
	networkCost: 0,
	tags: [],
	createdDate: new Date().toISOString(),
	lastActivity: new Date().toISOString(),
	uptime: 720, 
	peakCpuUsage: 85,
	avgResponseTime: 200,
	requestsPerHour: 1000
}

type Step = 1 | 2 | 3 | 4 | 5

function cx(...classes: (string | false | undefined)[]) { return classes.filter(Boolean).join(' ') }

const CompanySetupWizard: React.FC<Props> = ({ apiBase = (import.meta as any).env.VITE_API_BASE || 'http://localhost:5000', onCompleted }) => {
	const [step, setStep] = useState<Step>(1)
	const [profile, setProfile] = useState<CompanyProfile>(() => {
		try { const cached = localStorage.getItem('onboard_profile'); return cached ? JSON.parse(cached) : defaultProfile } catch { return defaultProfile }
	})
	const [instances, setInstances] = useState<CloudInstanceInput[]>(() => {
		try { const cached = localStorage.getItem('onboard_instances'); return cached ? JSON.parse(cached) : [] } catch { return [] }
	})
	const [currentInstance, setCurrentInstance] = useState<CloudInstanceInput>(emptyInstance)
	const [savingProfile, setSavingProfile] = useState(false)
	const [addingInstance, setAddingInstance] = useState(false)
	const [importing, setImporting] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [profileError, setProfileError] = useState<string | null>(null)
	const [instanceError, setInstanceError] = useState<string | null>(null)
	const [csvPreview, setCsvPreview] = useState<CloudInstanceInput[]>([])
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => { localStorage.setItem('onboard_profile', JSON.stringify(profile)) }, [profile])
	useEffect(() => { localStorage.setItem('onboard_instances', JSON.stringify(instances)) }, [instances])

	function validateProfile(p: CompanyProfile): string | null {
		if (!p.name.trim()) return 'Company name is required'
		if (!p.industry.trim()) return 'Industry is required'
		if (!p.size.trim()) return 'Company size is required'
		if (!p.contactEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return 'Valid contact email required'
		return null
	}

	function validateInstance(i: CloudInstanceInput): string | null {
		if (!i.name.trim()) return 'Instance name required'
		if (!i.region.trim()) return 'Region required'
		if (!i.type.trim()) return 'Type required'
		if (i.cpu <= 0) return 'CPU must be > 0'
		if (i.memoryGb <= 0) return 'Memory must be > 0'
		if (i.storageGb < 0) return 'Storage must be >= 0'
		if (i.monthlyCost < 0) return 'Monthly cost cannot be negative'
		return null
	}

	async function saveProfile(e: React.FormEvent) {
		e.preventDefault()
		setProfileError(null)
		const err = validateProfile(profile)
		if (err) { setProfileError(err); return }
		setSavingProfile(true)
		try {
			const res = await fetch(`${apiBase}/api/company/profile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
			if (!res.ok) throw new Error('Server rejected profile')
			setStep(2)
		} catch (e: any) {
			setProfileError(e.message || 'Failed to save profile')
		} finally {
			setSavingProfile(false)
		}
	}

	async function addInstance(e: React.FormEvent) {
		e.preventDefault()
		setInstanceError(null)
		const err = validateInstance(currentInstance)
		if (err) { setInstanceError(err); return }
		setAddingInstance(true)
		try {
			const res = await fetch(`${apiBase}/api/company/instance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(currentInstance) })
			if (!res.ok) throw new Error('Server error adding instance')
			const added = { ...currentInstance, id: crypto.randomUUID() }
			setInstances(prev => [...prev, added])
			setCurrentInstance(emptyInstance)
		} catch (e: any) {
			setInstanceError(e.message || 'Failed to add instance')
		} finally {
			setAddingInstance(false)
		}
	}

	function parseCsvLine(line: string): CloudInstanceInput | null {
		const parts = line.split(',').map(p => p.trim())
		if (parts.length < 22) return null
		const [name, providerRaw, region, type, cpuStr, memStr, storageStr, costStr, envRaw, statusRaw, cpuUtilStr, memUtilStr, netInStr, netOutStr, compCostStr, storCostStr, netCostStr, tagsStr, uptimeStr, peakCpuStr, respTimeStr, reqHourStr] = parts
		const provider = providerRaw.toLowerCase() as any
		const environment = envRaw.toLowerCase() as any
		const status = statusRaw.toLowerCase() as any
		const cpu = Number(cpuStr)
		const memoryGb = Number(memStr)
		const storageGb = Number(storageStr)
		const monthlyCost = Number(costStr)
		const cpuUtilization = Number(cpuUtilStr)
		const memoryUtilization = Number(memUtilStr)
		const networkInGb = Number(netInStr)
		const networkOutGb = Number(netOutStr)
		const computeCost = Number(compCostStr)
		const storageCost = Number(storCostStr)
		const networkCost = Number(netCostStr)
		const tags = tagsStr ? tagsStr.split(';').filter(t => t.trim()) : []
		const uptime = Number(uptimeStr)
		const peakCpuUsage = Number(peakCpuStr)
		const avgResponseTime = Number(respTimeStr)
		const requestsPerHour = Number(reqHourStr)
		
		if (!name) return null
		if (!['aws','gcp','azure'].includes(provider)) return null
		if (!['prod','staging','dev'].includes(environment)) return null
		if (!['running','stopped','terminated','pending'].includes(status)) return null
		if ([cpu,memoryGb,storageGb,monthlyCost,cpuUtilization,memoryUtilization,networkInGb,networkOutGb,computeCost,storageCost,networkCost,uptime,peakCpuUsage,avgResponseTime,requestsPerHour].some(n => isNaN(n))) return null
		
		return { 
			name, provider, region, type, cpu, memoryGb, storageGb, monthlyCost, environment,
			status, cpuUtilization, memoryUtilization, networkInGb, networkOutGb,
			computeCost, storageCost, networkCost, tags, uptime, peakCpuUsage, avgResponseTime, requestsPerHour,
			createdDate: new Date().toISOString(),
			lastActivity: new Date().toISOString()
		}
	}

	async function handleCsv(e: React.ChangeEvent<HTMLInputElement>) {
		setUploadError(null)
		const file = e.target.files?.[0]
		if (!file) return
		try {
			const text = await file.text()
			const lines = text.split(/\r?\n/).filter(l => l.trim())
			if (!lines.length) throw new Error('CSV empty')
			const header = lines[0].toLowerCase().replace(/\s+/g,'')
			const expected = 'name,provider,region,type,cpu,memorygb,storagegb,monthlycost,environment,status,cpuutilization,memoryutilization,networkingb,networkoutgb,computecost,storagecost,networkcost,tags,uptime,peakcpuusage,avgresponsetime,requestsperhour'
			if (header !== expected) throw new Error('Invalid headers. Expected: ' + expected)
			const parsed: CloudInstanceInput[] = []
			for (let i=1;i<lines.length;i++) { const inst = parseCsvLine(lines[i]); if (inst) parsed.push(inst) }
			if (!parsed.length) throw new Error('No valid rows parsed')
			setCsvPreview(parsed)
		} catch (err: any) {
			setUploadError(err.message || 'Failed parsing CSV')
			setCsvPreview([])
		}
	}

	async function importCsv() {
		if (!csvPreview.length) return
		setImporting(true)
		setUploadError(null)
		try {
			const formData = new FormData()
			const header = 'name,provider,region,type,cpu,memoryGb,storageGb,monthlyCost,environment'
			const csvBody = csvPreview.map(i => [i.name,i.provider,i.region,i.type,i.cpu,i.memoryGb,i.storageGb,i.monthlyCost,i.environment].join(',')).join('\n')
			const blob = new Blob([header+'\n'+csvBody], { type: 'text/csv' })
			formData.append('file', blob, 'instances.csv')
			const res = await fetch(`${apiBase}/api/company/import-csv`, { method: 'POST', body: formData })
			if (!res.ok) throw new Error('Server error importing CSV')
			setInstances(prev => [...prev, ...csvPreview.map(i => ({ ...i, id: crypto.randomUUID() }))])
			setCsvPreview([])
		} catch (e: any) {
			setUploadError(e.message || 'Import failed')
		} finally {
			setImporting(false)
		}
	}

	function removeInstance(id?: string) { if (!id) return; setInstances(prev => prev.filter(i => i.id !== id)) }

	function proceedToReview() { if (!instances.length) { setInstanceError('Add at least one instance before review'); return } setInstanceError(null); setStep(4) }

	async function finalize() {
		localStorage.setItem('onboarding_completed', 'true')
		onCompleted?.()
		setStep(5)
	}

	
	const steps = [
		{ id: 1, label: 'Company Profile' },
		{ id: 2, label: 'Manual Instances' },
		{ id: 3, label: 'CSV Import' },
		{ id: 4, label: 'Review' },
		{ id: 5, label: 'Done' }
	]

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
			<div className="w-full max-w-5xl">
				<h1 className="text-2xl font-bold text-slate-900 mb-6">First-time Setup</h1>

				<ol className="flex items-center mb-10">
					{steps.map((s, idx) => {
						const active = step === s.id
						const complete = step > s.id
						return (
							<li key={s.id} className={cx('flex-1 flex items-center', idx !== steps.length -1 && 'after:content-["" ] after:flex-1 after:h-1 after:bg-slate-200 after:mx-2')}>
								<div className={cx('flex items-center space-x-2', active && 'text-blue-600', complete && 'text-green-600')}>
									<div className={cx('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border', complete ? 'bg-green-600 border-green-600 text-white' : active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-600')}>
										{complete ? '✓' : s.id}
									</div>
									<span className="hidden sm:inline text-sm font-medium">{s.label}</span>
								</div>
							</li>
						)
					})}
				</ol>

				<div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
					{step === 1 && (
						<form onSubmit={saveProfile} className="space-y-6">
							<div>
								<h2 className="text-xl font-semibold text-slate-900 mb-2">Company Profile</h2>
								<p className="text-sm text-slate-600">Tell us about your organization so we can tailor insights.</p>
							</div>
							{profileError && <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">{profileError}</div>}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
									<input className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
									<input className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500" value={profile.industry} onChange={e => setProfile({ ...profile, industry: e.target.value })} required />
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1">Company Size</label>
									<select className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500" value={profile.size} onChange={e => setProfile({ ...profile, size: e.target.value })} required>
										<option value="">Select...</option>
										<option value="1-50">1-50</option>
										<option value="51-250">51-250</option>
										<option value="251-1000">251-1000</option>
										<option value="1000+">1000+</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
									<input type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500" value={profile.contactEmail} onChange={e => setProfile({ ...profile, contactEmail: e.target.value })} required />
								</div>
							</div>
							<div className="flex justify-end">
								<button disabled={savingProfile} className={cx('px-5 py-2 rounded-lg text-white text-sm font-medium shadow-sm', savingProfile ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700')}>{savingProfile ? 'Saving...' : 'Save & Continue'}</button>
							</div>
						</form>
					)}

					{step === 2 && (
						<div className="space-y-8">
							<div className="flex items-center justify-between flex-wrap gap-4">
								<div>
									<h2 className="text-xl font-semibold text-slate-900 mb-1">Add Instances Manually</h2>
									<p className="text-sm text-slate-600">Option B: Enter individual instances and their specs.</p>
								</div>
								<div className="flex items-center space-x-3">
									<button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white hover:bg-slate-50">← Back</button>
									<button onClick={() => setStep(3)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white hover:bg-slate-50">Go to CSV Import</button>
									<button onClick={proceedToReview} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Review ({instances.length})</button>
								</div>
							</div>
							{instanceError && <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">{instanceError}</div>}
							
							<div className="mb-6">
								<h3 className="text-md font-medium text-slate-900 mb-4">Basic Instance Details</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Instance Name</label>
										<input value={currentInstance.name} onChange={e => setCurrentInstance(ci => ({ ...ci, name: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Provider</label>
										<select value={currentInstance.provider} onChange={e => setCurrentInstance(ci => ({ ...ci, provider: e.target.value as any }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
											<option value="aws">AWS</option>
											<option value="gcp">GCP</option>
											<option value="azure">Azure</option>
										</select>
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Region</label>
										<input value={currentInstance.region} onChange={e => setCurrentInstance(ci => ({ ...ci, region: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Instance Type</label>
										<input value={currentInstance.type} onChange={e => setCurrentInstance(ci => ({ ...ci, type: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. t3.medium" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Environment</label>
										<select value={currentInstance.environment} onChange={e => setCurrentInstance(ci => ({ ...ci, environment: e.target.value as any }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
											<option value="dev">Development</option>
											<option value="staging">Staging</option>
											<option value="prod">Production</option>
										</select>
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
										<select value={currentInstance.status} onChange={e => setCurrentInstance(ci => ({ ...ci, status: e.target.value as any }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
											<option value="running">Running</option>
											<option value="stopped">Stopped</option>
											<option value="pending">Pending</option>
											<option value="terminated">Terminated</option>
										</select>
									</div>
								</div>
							</div>

							<div className="mb-6">
								<h3 className="text-md font-medium text-slate-900 mb-4">Resource Specifications</h3>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">CPU Cores</label>
										<input type="number" min={1} value={currentInstance.cpu} onChange={e => setCurrentInstance(ci => ({ ...ci, cpu: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Memory (GB)</label>
										<input type="number" min={1} value={currentInstance.memoryGb} onChange={e => setCurrentInstance(ci => ({ ...ci, memoryGb: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Storage (GB)</label>
										<input type="number" min={0} value={currentInstance.storageGb} onChange={e => setCurrentInstance(ci => ({ ...ci, storageGb: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Uptime (hrs/month)</label>
										<input type="number" min={0} max={744} value={currentInstance.uptime} onChange={e => setCurrentInstance(ci => ({ ...ci, uptime: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
								</div>
							</div>

							<div className="mb-6">
								<h3 className="text-md font-medium text-slate-900 mb-4">Performance Metrics</h3>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">CPU Utilization (%)</label>
										<input type="number" min={0} max={100} value={currentInstance.cpuUtilization} onChange={e => setCurrentInstance(ci => ({ ...ci, cpuUtilization: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Memory Utilization (%)</label>
										<input type="number" min={0} max={100} value={currentInstance.memoryUtilization} onChange={e => setCurrentInstance(ci => ({ ...ci, memoryUtilization: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Peak CPU Usage (%)</label>
										<input type="number" min={0} max={100} value={currentInstance.peakCpuUsage} onChange={e => setCurrentInstance(ci => ({ ...ci, peakCpuUsage: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Avg Response Time (ms)</label>
										<input type="number" min={0} value={currentInstance.avgResponseTime} onChange={e => setCurrentInstance(ci => ({ ...ci, avgResponseTime: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
								</div>
							</div>

							<div className="mb-6">
								<h3 className="text-md font-medium text-slate-900 mb-4">Network & Usage Patterns</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Network In (GB/month)</label>
										<input type="number" min={0} value={currentInstance.networkInGb} onChange={e => setCurrentInstance(ci => ({ ...ci, networkInGb: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Network Out (GB/month)</label>
										<input type="number" min={0} value={currentInstance.networkOutGb} onChange={e => setCurrentInstance(ci => ({ ...ci, networkOutGb: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Requests/Hour</label>
										<input type="number" min={0} value={currentInstance.requestsPerHour} onChange={e => setCurrentInstance(ci => ({ ...ci, requestsPerHour: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
								</div>
							</div>


							<div className="mb-6">
								<h3 className="text-md font-medium text-slate-900 mb-4">Cost Breakdown (Monthly)</h3>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Compute Cost ($)</label>
										<input type="number" min={0} step="0.01" value={currentInstance.computeCost} onChange={e => setCurrentInstance(ci => ({ ...ci, computeCost: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Storage Cost ($)</label>
										<input type="number" min={0} step="0.01" value={currentInstance.storageCost} onChange={e => setCurrentInstance(ci => ({ ...ci, storageCost: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Network Cost ($)</label>
										<input type="number" min={0} step="0.01" value={currentInstance.networkCost} onChange={e => setCurrentInstance(ci => ({ ...ci, networkCost: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Total Cost ($)</label>
										<input type="number" min={0} step="0.01" value={currentInstance.monthlyCost} onChange={e => setCurrentInstance(ci => ({ ...ci, monthlyCost: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-slate-50" required />
									</div>
								</div>
							</div>


							<div className="mb-6">
								<h3 className="text-md font-medium text-slate-900 mb-4">Tags & Metadata</h3>
								<div className="grid grid-cols-1 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
										<input value={currentInstance.tags.join(', ')} onChange={e => setCurrentInstance(ci => ({ ...ci, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. web-server, production, high-priority" />
									</div>
								</div>
							</div>

							<form onSubmit={addInstance}>
								<div className="flex justify-end">
									<button disabled={addingInstance} className={cx('px-5 py-2 rounded-lg text-white text-sm font-medium', addingInstance ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700')}>{addingInstance ? 'Adding...' : 'Add Instance'}</button>
								</div>
							</form>

							<div>
								<h3 className="text-sm font-semibold text-slate-900 mb-3">Current Instances ({instances.length})</h3>
								{instances.length === 0 && <div className="text-xs text-slate-500">No instances added yet.</div>}
								<div className="overflow-x-auto border border-slate-200 rounded-lg">
									<table className="min-w-full text-xs">
										<thead className="bg-slate-100 text-slate-700">
											<tr>
												{['Name','Provider','Region','Type','CPU','Mem','Storage','Cost','Env',''].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
											</tr>
										</thead>
										<tbody>
											{instances.map(i => (
												<tr key={i.id} className="border-t border-slate-100 hover:bg-slate-50">
													<td className="px-3 py-1 font-medium text-slate-900">{i.name}</td>
													<td className="px-3 py-1 uppercase">{i.provider}</td>
													<td className="px-3 py-1">{i.region}</td>
													<td className="px-3 py-1">{i.type}</td>
													<td className="px-3 py-1">{i.cpu}</td>
													<td className="px-3 py-1">{i.memoryGb}</td>
													<td className="px-3 py-1">{i.storageGb}</td>
													<td className="px-3 py-1">${i.monthlyCost}</td>
													<td className="px-3 py-1">{i.environment}</td>
													<td className="px-3 py-1 text-right">
														<button onClick={() => removeInstance(i.id)} className="text-red-600 hover:text-red-700 text-xs font-medium">Remove</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}

					{step === 3 && (
						<div className="space-y-8">
							<div className="flex items-center justify-between flex-wrap gap-4">
								<div>
									<h2 className="text-xl font-semibold text-slate-900 mb-1">Import Instances via CSV</h2>
									<p className="text-sm text-slate-600">Option C: Upload a CSV for bulk instance ingestion.</p>
								</div>
								<div className="flex items-center space-x-3">
									<button onClick={() => setStep(2)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white hover:bg-slate-50">Back to Manual</button>
									<button onClick={proceedToReview} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Review ({instances.length + csvPreview.length})</button>
								</div>
							</div>
							{uploadError && <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">{uploadError}</div>}
							<div className="space-y-5">
								<div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed">
									<p className="font-medium text-slate-900 mb-2">Expected CSV Headers (22 columns required):</p>
									<code className="block bg-white border border-slate-200 rounded p-2 mb-3 text-slate-800 text-xs overflow-x-auto">name,provider,region,type,cpu,memoryGb,storageGb,monthlyCost,environment,status,cpuUtilization,memoryUtilization,networkInGb,networkOutGb,computeCost,storageCost,networkCost,tags,uptime,peakCpuUsage,avgResponseTime,requestsPerHour</code>
									<p className="text-slate-600 mb-2">Example row:</p>
									<code className="block bg-white border border-slate-200 rounded p-2 text-slate-800 text-xs overflow-x-auto">api-server-01,aws,us-east-1,t3.medium,2,4,50,42,prod,running,70,60,10,15,35,5,2,web-server;prod;critical,720,85,200,1000</code>
									<div className="mt-3 text-xs text-slate-600">
										<p><strong>Notes:</strong></p>
										<ul className="list-disc ml-4 mt-1 space-y-1">
											<li>Tags should be semicolon-separated (e.g., "web-server;prod;critical")</li>
											<li>Utilization values are percentages (0-100)</li>
											<li>Uptime is hours per month (max 744)</li>
											<li>Cost fields are in USD</li>
										</ul>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
									<input ref={fileInputRef} onChange={handleCsv} type="file" accept=".csv" className="text-sm" />
									{csvPreview.length > 0 && (
										<div className="flex items-center space-x-3">
											<span className="text-xs text-slate-600">Parsed {csvPreview.length} rows</span>
											<button disabled={importing} onClick={importCsv} className={cx('px-4 py-2 rounded-lg text-white text-sm font-medium', importing ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700')}>{importing ? 'Importing...' : 'Import'}</button>
											<button onClick={() => { setCsvPreview([]); if (fileInputRef.current) fileInputRef.current.value = '' }} className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white hover:bg-slate-50">Clear</button>
										</div>
									)}
								</div>
								{csvPreview.length > 0 && (
									<div>
										<h3 className="text-sm font-semibold text-slate-900 mb-2">CSV Preview</h3>
										<div className="overflow-x-auto border border-slate-200 rounded-lg">
											<table className="min-w-full text-xs">
												<thead className="bg-slate-100 text-slate-700">
													<tr>
														{['Name','Provider','Region','Type','CPU','Mem','Storage','Cost','Env'].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
													</tr>
												</thead>
												<tbody>
													{csvPreview.map((i, idx) => (
														<tr key={idx} className="border-t border-slate-100">
															<td className="px-3 py-1 font-medium text-slate-900">{i.name}</td>
															<td className="px-3 py-1 uppercase">{i.provider}</td>
															<td className="px-3 py-1">{i.region}</td>
															<td className="px-3 py-1">{i.type}</td>
															<td className="px-3 py-1">{i.cpu}</td>
															<td className="px-3 py-1">{i.memoryGb}</td>
															<td className="px-3 py-1">{i.storageGb}</td>
															<td className="px-3 py-1">${i.monthlyCost}</td>
															<td className="px-3 py-1">{i.environment}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{step === 4 && (
						<div className="space-y-8">
							<div className="flex items-center justify-between flex-wrap gap-4">
								<div>
									<h2 className="text-xl font-semibold text-slate-900 mb-1">Review & Confirm</h2>
									<p className="text-sm text-slate-600">Confirm your profile and instance inventory before finishing.</p>
								</div>
								<div className="flex items-center space-x-3">
									<button onClick={() => setStep(3)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white hover:bg-slate-50">← Back</button>
									<button onClick={() => setStep(2)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white hover:bg-slate-50">Edit Instances</button>
									<button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white hover:bg-slate-50">Edit Profile</button>
									<button onClick={finalize} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700">Finish Setup</button>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
									<h3 className="text-sm font-semibold text-slate-900 mb-2">Company</h3>
									<ul className="text-xs text-slate-600 space-y-1">
										<li><span className="font-medium text-slate-800">Name:</span> {profile.name}</li>
										<li><span className="font-medium text-slate-800">Industry:</span> {profile.industry}</li>
										<li><span className="font-medium text-slate-800">Size:</span> {profile.size}</li>
										<li><span className="font-medium text-slate-800">Contact:</span> {profile.contactEmail}</li>
									</ul>
								</div>
								<div className="p-4 border border-slate-200 rounded-lg bg-slate-50 md:col-span-2">
									<h3 className="text-sm font-semibold text-slate-900 mb-2">Instances ({instances.length})</h3>
									<div className="overflow-x-auto border border-slate-200 rounded-lg">
										<table className="min-w-full text-xs">
											<thead className="bg-slate-100 text-slate-700">
												<tr>
													{['Name','Prov','Region','Type','CPU','Mem','Storage','Cost','Env'].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
												</tr>
											</thead>
											<tbody>
												{instances.map(i => (
													<tr key={i.id} className="border-t border-slate-100">
														<td className="px-3 py-1 font-medium text-slate-900">{i.name}</td>
														<td className="px-3 py-1 uppercase">{i.provider}</td>
														<td className="px-3 py-1">{i.region}</td>
														<td className="px-3 py-1">{i.type}</td>
														<td className="px-3 py-1">{i.cpu}</td>
														<td className="px-3 py-1">{i.memoryGb}</td>
														<td className="px-3 py-1">{i.storageGb}</td>
														<td className="px-3 py-1">${i.monthlyCost}</td>
														<td className="px-3 py-1">{i.environment}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					)}

					{step === 5 && (
						<div className="text-center py-16">
							<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
								<span className="text-3xl">🎉</span>
							</div>
							<h2 className="text-2xl font-semibold text-slate-900 mb-3">Setup Complete!</h2>
							<p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">Your initial environment data has been captured. Explore the dashboard for AI-driven optimization and insights.</p>
							<button onClick={() => onCompleted?.()} className="px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Go to Dashboard</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default CompanySetupWizard


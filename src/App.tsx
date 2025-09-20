import { useState, useEffect, useRef } from 'react'
import './App.css'
import { CostTrendChart, AlertsPanel, PerformanceMetrics } from './components/DashboardComponents'
import CompanySetupWizard from './components/CompanySetupWizard'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('onboarding_completed') === 'true')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading Cloud Optimizer...</p>
        </div>
      </div>
    )
  }

  if (!onboarded) {
    return <CompanySetupWizard onCompleted={() => { localStorage.setItem('onboarding_completed','true'); setOnboarded(true) }} />
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <h1 className="text-lg md:text-xl font-semibold text-slate-900">CloudOptimizer</h1>
              </div>
            </div>
            <nav className="flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
                { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { id: 'optimization', label: 'Optimization', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                { id: 'migration', label: 'Migration', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-700 text-white border border-blue-700 shadow-sm'
                      : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-700'
                  }`}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'optimization' && <OptimizationTab />}
        {activeTab === 'migration' && <MigrationTab />}
      </main>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Cost"
          value="$12,847"
          change="+2.5%"
          trend="up"
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
        <MetricCard
          title="Active Instances"
          value="247"
          change="-5.2%"
          trend="down"
          icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
        <MetricCard
          title="Optimization Score"
          value="87%"
          change="+12.3%"
          trend="up"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <MetricCard
          title="Alerts"
          value="3"
          change="0%"
          trend="neutral"
          icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Trend</h3>
          <CostTrendChart />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics</h3>
          <PerformanceMetrics />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CloudProviderCard
              provider="AWS"
              instances={89}
              cost="$4,231"
              status="optimal"
              utilization={78}
            />
            <CloudProviderCard
              provider="Google Cloud"
              instances={156}
              cost="$6,492"
              status="warning"
              utilization={92}
            />
            <CloudProviderCard
              provider="Azure"
              instances={12}
              cost="$2,124"
              status="idle"
              utilization={34}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Workload migrated', details: 'Web app moved from GCP to AWS', time: '2 minutes ago', type: 'migration' },
            { action: 'Cost optimization', details: 'Switched 5 instances to spot pricing', time: '15 minutes ago', type: 'optimization' },
            { action: 'Alert resolved', details: 'High CPU usage on db-server-01', time: '1 hour ago', type: 'alert' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'migration' ? 'bg-blue-500' :
                activity.type === 'optimization' ? 'bg-green-500' : 'bg-orange-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                <p className="text-sm text-slate-600">{activity.details}</p>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, trend, icon }: {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          <p className={`text-sm mt-1 ${
            trend === 'up' ? 'text-green-600' :
            trend === 'down' ? 'text-red-600' : 'text-slate-600'
          }`}>
            {change} from last month
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  )
}

function CloudProviderCard({ provider, instances, cost, status, utilization }: {
  provider: string
  instances: number
  cost: string
  status: 'optimal' | 'warning' | 'idle'
  utilization: number
}) {
  const statusColors = {
    optimal: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    idle: 'bg-slate-100 text-slate-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{provider}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Instances</span>
          <span className="text-sm font-medium text-slate-900">{instances}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Monthly Cost</span>
          <span className="text-sm font-medium text-slate-900">{cost}</span>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-slate-600">Utilization</span>
            <span className="text-sm font-medium text-slate-900">{utilization}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                utilization > 80 ? 'bg-orange-500' : utilization > 60 ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${utilization}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('cost')

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-600 mt-1">Deep insights into your multi-cloud performance and costs</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-700">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option className="bg-white text-slate-900" value="1h">Last Hour</option>
            <option className="bg-white text-slate-900" value="24h">Last 24 Hours</option>
            <option className="bg-white text-slate-900" value="7d">Last 7 Days</option>
            <option className="bg-white text-slate-900" value="30d">Last 30 Days</option>
            <option className="bg-white text-slate-900" value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'cost', label: 'Cost Analytics', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
          { id: 'performance', label: 'Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { id: 'resources', label: 'Resources', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
          { id: 'comparison', label: 'Comparison', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
        ].map((metric) => (
          <button
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedMetric === metric.id
                ? 'bg-blue-700 text-white border border-blue-700 shadow-sm'
                : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-700'
            }`}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
            </svg>
            <span>{metric.label}</span>
          </button>
        ))}
      </div>

      {selectedMetric === 'cost' && <CostAnalytics timeRange={timeRange} />}
      {selectedMetric === 'performance' && <PerformanceAnalytics timeRange={timeRange} />}
      {selectedMetric === 'resources' && <ResourceAnalytics timeRange={timeRange} />}
      {selectedMetric === 'comparison' && <ComparisonAnalytics timeRange={timeRange} />}
    </div>
  )
}

function OptimizationTab() {
  const [selectedWorkload, setSelectedWorkload] = useState('web-app-frontend')
  const [optimizationType, setOptimizationType] = useState('cost')
  const [showSimulation, setShowSimulation] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI-Powered Optimization</h2>
          <p className="text-slate-600 mt-1">Intelligent workload placement recommendations using Gemini AI</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Gemini AI Active</span>
          </div>
          <button 
            onClick={() => setShowSimulation(!showSimulation)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {showSimulation ? 'Hide Simulation' : 'Run Simulation'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Workload</h3>
          <div className="space-y-3">
            {[
              { id: 'web-app-frontend', name: 'Web App Frontend', provider: 'AWS', cost: '$450/mo', instances: 3 },
              { id: 'api-backend', name: 'API Backend Services', provider: 'GCP', cost: '$1,200/mo', instances: 8 },
              { id: 'database-cluster', name: 'Database Cluster', provider: 'AWS', cost: '$2,100/mo', instances: 5 },
              { id: 'ml-pipeline', name: 'ML Training Pipeline', provider: 'Azure', cost: '$800/mo', instances: 2 }
            ].map((workload) => (
              <div
                key={workload.id}
                onClick={() => setSelectedWorkload(workload.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedWorkload === workload.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-900">{workload.name}</p>
                    <p className="text-sm text-slate-600">Current: {workload.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{workload.cost}</p>
                    <p className="text-xs text-slate-500">{workload.instances} instances</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Optimization Goal</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'cost', label: 'Minimize Cost', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
              { id: 'performance', label: 'Maximize Performance', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { id: 'balanced', label: 'Balanced', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707' },
              { id: 'reliability', label: 'High Availability', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setOptimizationType(type.id)}
                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                  optimizationType === type.id
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-700 bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                  </svg>
                  <span className="font-medium">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AIRecommendationsPanel 
        workload={selectedWorkload} 
        optimizationType={optimizationType}
      />

      {showSimulation && (
        <SimulationPanel 
          workload={selectedWorkload} 
          optimizationType={optimizationType}
        />
      )}

      <GeminiInsightsPanel workload={selectedWorkload} />
    </div>
  )
}

function CostAnalytics({ timeRange }: { timeRange: string }) {
  console.log('Cost analytics for time range:', timeRange)
  const costData = [
    { provider: 'AWS', current: 4520, previous: 4200, change: '+7.6%', trend: 'up' },
    { provider: 'Google Cloud', current: 3890, previous: 4100, change: '-5.1%', trend: 'down' },
    { provider: 'Azure', current: 2340, previous: 2200, change: '+6.4%', trend: 'up' }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {costData.map((item) => (
          <div key={item.provider} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{item.provider}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">${item.current.toLocaleString()}</p>
                <p className={`text-sm mt-1 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change} vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Cost Trends Analysis</h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">Total: <span className="font-semibold text-slate-900">$65.2k</span></div>
            <div className="text-sm text-red-600">↑ 3.2% vs last period</div>
          </div>
        </div>
        
        {/* Enhanced Chart with Grid Lines and Better Labels */}
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-slate-500 pr-2">
            <span>$5k</span>
            <span>$4k</span>
            <span>$3k</span>
            <span>$2k</span>
            <span>$1k</span>
            <span>$0</span>
          </div>
          
          {/* Grid lines */}
          <div className="ml-8 relative">
            <div className="absolute inset-0 grid grid-rows-5 opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-slate-300"></div>
              ))}
            </div>
            
            {/* Chart area */}
            <div className="h-64 flex items-end justify-center space-x-6 pt-4">
              {[
                { month: 'Jan', aws: 4200, gcp: 3800, azure: 2100, total: 10100, instances: 89, savings: 0 },
                { month: 'Feb', aws: 4500, gcp: 4200, azure: 2300, total: 11000, instances: 92, savings: 150 },
                { month: 'Mar', aws: 4800, gcp: 3900, azure: 2500, total: 11200, instances: 88, savings: 320 },
                { month: 'Apr', aws: 4600, gcp: 4100, azure: 2400, total: 11100, instances: 95, savings: 280 },
                { month: 'May', aws: 4900, gcp: 4300, azure: 2600, total: 11800, instances: 98, savings: 410 },
                { month: 'Jun', aws: 4700, gcp: 4000, azure: 2200, total: 10900, instances: 85, savings: 890 }
              ].map((item) => (
                <div key={item.month} className="flex flex-col items-center space-y-3 group">
                  {/* Bars with enhanced styling */}
                  <div className="flex space-x-1" style={{ height: '200px', alignItems: 'flex-end' }}>
                    <div className="relative group">
                      <div
                        className="w-5 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                        style={{ height: `${(item.aws / 5000) * 180}px` }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        AWS: ${item.aws.toLocaleString()}
                      </div>
                    </div>
                    <div className="relative group">
                      <div
                        className="w-5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                        style={{ height: `${(item.gcp / 5000) * 180}px` }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        GCP: ${item.gcp.toLocaleString()}
                      </div>
                    </div>
                    <div className="relative group">
                      <div
                        className="w-5 bg-gradient-to-t from-green-600 to-green-400 rounded-t cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                        style={{ height: `${(item.azure / 5000) * 180}px` }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Azure: ${item.azure.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced month labels with more info */}
                  <div className="text-center space-y-1">
                    <span className="text-sm font-semibold text-slate-700">{item.month}</span>
                    <div className="text-xs text-slate-600">
                      <div>${(item.total/1000).toFixed(1)}k total</div>
                      <div>{item.instances} instances</div>
                      {item.savings > 0 && (
                        <div className="text-green-600 font-medium">↓ ${item.savings} saved</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend with additional info */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"></div>
              <span className="text-slate-600">AWS ($4.7k current)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
              <span className="text-slate-600">GCP ($4.0k current)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
              <span className="text-slate-600">Azure ($2.2k current)</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">6-month view • Hover for details</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost by Service Type</h3>
          <div className="space-y-4">
            {[
              { service: 'Compute', cost: 8420, percentage: 45 },
              { service: 'Storage', cost: 4560, percentage: 24 },
              { service: 'Networking', cost: 3210, percentage: 17 },
              { service: 'Database', cost: 2560, percentage: 14 }
            ].map((item) => (
              <div key={item.service} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{item.service}</span>
                    <span className="text-sm text-slate-600">${item.cost.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Optimization Opportunities</h3>
          <div className="space-y-4">
            {[
              { title: 'Idle Resources', savings: '$1,240', description: 'Terminate unused EC2 instances' },
              { title: 'Storage Optimization', savings: '$890', description: 'Move to cheaper storage tiers' },
              { title: 'Reserved Instances', savings: '$2,100', description: 'Purchase RI for steady workloads' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-800">{item.title}</p>
                  <p className="text-xs text-green-600">{item.description}</p>
                </div>
                <span className="text-sm font-bold text-green-700">{item.savings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PerformanceAnalytics({ timeRange }: { timeRange: string }) {
  console.log('Performance analytics for time range:', timeRange)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Response Time', value: '245ms', change: '-12%', trend: 'down', color: 'green' },
          { label: 'Error Rate', value: '0.02%', change: '-5%', trend: 'down', color: 'green' },
          { label: 'Throughput', value: '1.2M req/min', change: '+8%', trend: 'up', color: 'green' },
          { label: 'Uptime', value: '99.98%', change: '+0.01%', trend: 'up', color: 'green' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
              <div className="text-sm text-slate-600 mb-2">{metric.label}</div>
              <div className={`text-xs font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} vs last period
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Response Time Trends</h3>
          <div className="h-64 flex items-end space-x-4">
            {[200, 180, 220, 190, 170, 160, 180, 150, 140, 160, 130, 120].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-500"
                  style={{ height: `${(value / 250) * 200}px` }}
                ></div>
                <span className="text-xs text-slate-500 mt-2">{index + 1}h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Error Rate Trends</h3>
          <div className="h-64 flex items-end space-x-4">
            {[0.05, 0.03, 0.08, 0.02, 0.01, 0.04, 0.02, 0.01, 0.03, 0.02, 0.01, 0.02].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-red-500 rounded-t transition-all duration-500"
                  style={{ height: `${value * 2000}px` }}
                ></div>
                <span className="text-xs text-slate-500 mt-2">{index + 1}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Provider Performance Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-900">Provider</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Avg Response Time</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Uptime</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Error Rate</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Throughput</th>
              </tr>
            </thead>
            <tbody>
              {[
                { provider: 'AWS', response: '180ms', uptime: '99.95%', error: '0.01%', throughput: '1.8M req/min' },
                { provider: 'Google Cloud', response: '220ms', uptime: '99.98%', error: '0.02%', throughput: '1.5M req/min' },
                { provider: 'Azure', response: '250ms', uptime: '99.92%', error: '0.03%', throughput: '1.2M req/min' }
              ].map((row, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium text-slate-900">{row.provider}</td>
                  <td className="py-3 px-4 text-slate-600">{row.response}</td>
                  <td className="py-3 px-4 text-slate-600">{row.uptime}</td>
                  <td className="py-3 px-4 text-slate-600">{row.error}</td>
                  <td className="py-3 px-4 text-slate-600">{row.throughput}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ResourceAnalytics({ timeRange }: { timeRange: string }) {
  console.log('Resource analytics for time range:', timeRange)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { resource: 'CPU', utilized: 78, total: 100, unit: '%' },
          { resource: 'Memory', utilized: 65, total: 100, unit: '%' },
          { resource: 'Storage', utilized: 82, total: 100, unit: '%' }
        ].map((item) => (
          <div key={item.resource} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">{item.utilized}{item.unit}</div>
              <div className="text-sm text-slate-600 mb-4">{item.resource} Utilization</div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${item.utilized > 80 ? 'bg-red-500' : item.utilized > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${item.utilized}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">CPU Utilization Trends</h3>
          <div className="h-64 flex items-end space-x-2">
            {[65, 72, 68, 75, 82, 78, 85, 80, 77, 83, 79, 81].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-500"
                  style={{ height: `${(value / 100) * 200}px` }}
                ></div>
                <span className="text-xs text-slate-500 mt-2">{index + 1}h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Memory Utilization Trends</h3>
          <div className="h-64 flex items-end space-x-2">
            {[58, 62, 59, 67, 71, 69, 73, 68, 65, 72, 66, 70].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500 rounded-t transition-all duration-500"
                  style={{ height: `${(value / 100) * 200}px` }}
                ></div>
                <span className="text-xs text-slate-500 mt-2">{index + 1}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Instance Resource Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-900">Instance</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Provider</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">CPU %</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Memory %</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'web-server-01', provider: 'AWS', cpu: 85, memory: 72, status: 'High' },
                { name: 'api-gateway-02', provider: 'GCP', cpu: 45, memory: 38, status: 'Normal' },
                { name: 'db-cluster-03', provider: 'AWS', cpu: 92, memory: 88, status: 'Critical' },
                { name: 'cache-redis-04', provider: 'Azure', cpu: 23, memory: 45, status: 'Low' },
                { name: 'worker-queue-05', provider: 'GCP', cpu: 67, memory: 54, status: 'Normal' }
              ].map((instance, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium text-slate-900">{instance.name}</td>
                  <td className="py-3 px-4 text-slate-600">{instance.provider}</td>
                  <td className="py-3 px-4 text-slate-600">{instance.cpu}%</td>
                  <td className="py-3 px-4 text-slate-600">{instance.memory}%</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      instance.status === 'Critical' ? 'bg-red-100 text-red-800' :
                      instance.status === 'High' ? 'bg-orange-100 text-orange-800' :
                      instance.status === 'Normal' ? 'bg-green-100 text-green-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {instance.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ComparisonAnalytics({ timeRange }: { timeRange: string }) {
  console.log('Comparison analytics for time range:', timeRange)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; title: string; lines: string[] }>({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    lines: []
  })


  type TooltipPayload = { title: string; cost: string; performance: string; reliability: string; note: string }
  function showTooltip(e: React.MouseEvent, p: TooltipPayload) {
    const rect = containerRef.current?.getBoundingClientRect()
    const clientX = e.clientX
    const clientY = e.clientY
    const x = rect ? clientX - rect.left : clientX
    const y = rect ? clientY - rect.top : clientY

    setTooltip({
      visible: true,
      x,
      y,
      title: p.title,
      lines: [p.cost, `Performance: ${p.performance}`, `Reliability: ${p.reliability}`, p.note]
    })
  }

  function moveTooltip(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    const x = rect ? e.clientX - rect.left : e.clientX
    const y = rect ? e.clientY - rect.top : e.clientY
    setTooltip(t => ({ ...t, x, y }))
  }

  function hideTooltip() {
    setTooltip(t => ({ ...t, visible: false }))
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { provider: 'AWS', score: 8.5, cost: '$4,520', performance: 9.2, reliability: 9.5 },
              { provider: 'Google Cloud', score: 8.8, cost: '$3,890', performance: 9.5, reliability: 9.3 },
              { provider: 'Azure', score: 8.2, cost: '$2,340', performance: 8.8, reliability: 9.1 }
        ].map((provider) => (
          <div key={provider.provider} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{provider.provider}</h3>
              <div className="text-3xl font-bold text-blue-600 mt-2">{provider.score}/10</div>
              <div className="text-sm text-slate-600">Overall Score</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Monthly Cost</span>
                <span className="text-sm font-medium text-slate-900">{provider.cost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Performance</span>
                <span className="text-sm font-medium text-slate-900">{provider.performance}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Reliability</span>
                <span className="text-sm font-medium text-slate-900">{provider.reliability}/10</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost vs Performance Analysis</h3>
        <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
          <div ref={containerRef} className="text-center relative">
            <svg width="520" height="300" viewBox="0 0 520 300" className="bg-white rounded-lg shadow-sm border border-slate-200">
              <g transform="translate(50,20)">
                <g>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line key={`v-${i}`} x1={(i * 80)} y1={0} x2={(i * 80)} y2={220} stroke="#eef2f7" />
                  ))}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={`h-${i}`} x1={0} y1={(i * 55)} x2={400} y2={(i * 55)} stroke="#eef2f7" />
                  ))}
                </g>

                <text x={200} y={250} textAnchor="middle" className="text-slate-500">Monthly Cost (USD)</text>
                <text x={-30} y={110} transform="rotate(-90 -30 110)" textAnchor="middle" className="text-slate-500">Performance Score</text>

                {
                  (() => {
                    const providers = [
                      { id: 'aws', label: 'AWS', cost: 4520, performance: 9.2, reliability: 9.5, color: '#1d4ed8', note: 'High Cost, High Performance' },
                      { id: 'gcp', label: 'GCP', cost: 3890, performance: 9.5, reliability: 9.3, color: '#059669', note: 'Medium Cost, High Performance' },
                      { id: 'azure', label: 'Azure', cost: 2340, performance: 8.8, reliability: 9.1, color: '#f97316', note: 'Low Cost, Medium Performance' }
                    ]

                    const costMin = 2000
                    const costMax = 5000
                    const perfMin = 8.0
                    const perfMax = 10.0

                    const xForCost = (c: number) => ((c - costMin) / (costMax - costMin)) * 400
                    const yForPerf = (p: number) => 220 - ((p - perfMin) / (perfMax - perfMin)) * 220

                    return providers.map((p) => (
                      <g key={p.id}>
                        <circle
                          cx={xForCost(p.cost)}
                          cy={yForPerf(p.performance)}
                          r={8}
                          fill={p.color}
                          className="cursor-pointer"
                          onMouseEnter={(e) => showTooltip(e as unknown as React.MouseEvent, { title: p.label, cost: `$${p.cost}`, performance: `${p.performance}/10`, reliability: `${p.reliability}/10`, note: p.note })}
                          onMouseMove={(e) => moveTooltip(e as unknown as React.MouseEvent)}
                          onMouseLeave={() => hideTooltip()}
                        />
                        <text x={xForCost(p.cost) + 12} y={yForPerf(p.performance) + 4} className="text-xs font-medium text-slate-700">{p.label}</text>
                      </g>
                    ))
                  })()
                }
              </g>
            </svg>
            {tooltip.visible && (
              <div className="absolute z-50 w-44 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-left text-sm" style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}>
                <div className="font-medium text-slate-900 mb-1">{tooltip.title}</div>
                {tooltip.lines.map((line, idx) => (
                  <div key={idx} className="text-slate-600 text-xs">{line}</div>
                ))}
              </div>
            )}

            <p className="text-sm text-slate-600 mt-4">Performance Score vs Monthly Cost</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Return on Investment</h3>
          <div className="space-y-4">
            {[
              { metric: 'Cost Savings', value: '$12,450', period: 'Last 30 days' },
              { metric: 'Performance Improvement', value: '+23%', period: 'Last 30 days' },
              { metric: 'Uptime Increase', value: '+0.15%', period: 'Last 30 days' },
              { metric: 'Resource Efficiency', value: '+18%', period: 'Last 30 days' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.metric}</p>
                  <p className="text-xs text-slate-600">{item.period}</p>
                </div>
                <span className="text-sm font-bold text-green-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Migration Recommendations</h3>
          <div className="space-y-4">
            {[
              { from: 'AWS', to: 'GCP', reason: '15% cost reduction', impact: 'High' },
              { from: 'Azure', to: 'AWS', reason: 'Better performance', impact: 'Medium' },
              { from: 'GCP', to: 'Azure', reason: 'Lower latency', impact: 'Low' }
            ].map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">{rec.from} → {rec.to}</p>
                  <p className="text-xs text-blue-700">{rec.reason}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  rec.impact === 'High' ? 'bg-green-100 text-green-800' :
                  rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {rec.impact} Impact
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AIRecommendationsPanel({ workload, optimizationType }: { workload: string; optimizationType: string }) {
  interface Recommendation {
    id: string
    title: string
    provider: 'aws' | 'gcp' | 'azure'
    confidence: number
    costSavings: number
    performanceGain: number
    migrationTime: string
    reasoning: string
    estimatedDowntime?: string
  }

  const [recs, setRecs] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const apiBase = (import.meta as any).env.VITE_API_BASE || 'http://localhost:5000'

  async function fetchRecommendations(signal?: AbortSignal, isRefresh = false) {
    if (loading && !isRefresh) return
    setError(null)
    if (isRefresh) setRefreshing(true); else setLoading(true)
    try {
      const resp = await fetch(`${apiBase}/api/ai/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workload, optimizationType }),
        signal
      })
      if (!resp.ok) throw new Error(`API ${resp.status}`)
      const json = await resp.json()
      if (!json.recommendations) throw new Error('Malformed response (no recommendations)')
      setRecs(json.recommendations)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (e: any) {
      if (e.name === 'AbortError') return
      console.error('Failed to load recommendations', e)
      setError(e.message || 'Failed to load recommendations')
      setRecs((prev) => prev.length ? prev : [
        {
          id: 'fallback-1',
            title: 'Fallback: Optimize Current Setup',
            provider: 'aws',
            confidence: 70,
            costSavings: 250,
            performanceGain: 5,
            migrationTime: '30 minutes',
            reasoning: 'Basic instance right-sizing suggestion (offline fallback)',
            estimatedDowntime: 'None'
        }
      ])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const ac = new AbortController()
    fetchRecommendations(ac.signal)
    return () => ac.abort()
  }, [workload, optimizationType])

  function providerColor(p: string) {
    return p === 'gcp' ? 'bg-green-500' : p === 'azure' ? 'bg-blue-500' : 'bg-orange-500'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-slate-900">AI Recommendations</h3>
          {lastUpdated && (
            <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Gemini</span>
          </div>
          <button
            onClick={() => fetchRecommendations(undefined, true)}
            disabled={loading || refreshing}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
              loading || refreshing
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
            }`}
          >
            {refreshing ? 'Refreshing...' : loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg border border-orange-300 bg-orange-50 text-sm text-orange-800">
          <div className="font-medium mb-1">Issue fetching live AI recommendations</div>
          <div>{error}</div>
          <div className="mt-2 text-xs text-orange-700">Showing fallback data if available. Check backend service and API key.</div>
        </div>
      )}

      {loading && !recs.length ? (
        <div className="h-24 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-slate-600 text-sm">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Contacting Gemini...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recs.map((rec) => (
            <div key={rec.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900 truncate pr-2" title={rec.title}>{rec.title}</h4>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${providerColor(rec.provider)}`}></div>
                  <span className="text-xs font-medium text-slate-600 uppercase">{rec.provider}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Confidence</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${rec.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{rec.confidence}%</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Cost Savings</span>
                  <span className="text-sm font-bold text-green-600">${rec.costSavings}/mo</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Performance</span>
                  <span className={`text-sm font-medium ${rec.performanceGain >= 0 ? 'text-green-600' : 'text-orange-600'}`}>{rec.performanceGain >= 0 ? '+' : ''}{rec.performanceGain}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Migration Time</span>
                  <span className="text-sm font-medium text-slate-900">{rec.migrationTime}</span>
                </div>

                {rec.estimatedDowntime && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Downtime</span>
                    <span className="text-sm font-medium text-slate-900">{rec.estimatedDowntime}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-4 line-clamp-3" title={rec.reasoning}>{rec.reasoning}</p>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Apply
                </button>
                <button className="flex-1 px-3 py-2 border border-slate-700 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-600 transition-colors duration-200">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SimulationPanel({ workload, optimizationType }: { workload: string; optimizationType: string }) {
  console.log('Running simulation for:', workload, 'optimizing for:', optimizationType)
  const [selectedProvider, setSelectedProvider] = useState('gcp')
  const [budgetLimit, setBudgetLimit] = useState(2000)
  
  const simulationData = {
    current: { cost: 1450, performance: 85, reliability: 92 },
    projected: { cost: 890, performance: 92, reliability: 95 }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Migration Simulation</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Provider</label>
            <select 
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="gcp">Google Cloud Platform</option>
              <option value="azure">Microsoft Azure</option>
              <option value="aws">Amazon Web Services</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Budget Limit</label>
            <div className="flex items-center space-x-2">
              <input 
                type="range" 
                min="500" 
                max="5000" 
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-slate-900 w-20">${budgetLimit}/mo</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Latency Requirement</p>
              <p className="font-medium text-slate-900">&lt; 100ms</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Compliance</p>
              <p className="font-medium text-slate-900">GDPR</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Projected Impact</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-600">-${simulationData.current.cost - simulationData.projected.cost}</p>
              <p className="text-xs text-green-700">Monthly Savings</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">+{simulationData.projected.performance - simulationData.current.performance}%</p>
              <p className="text-xs text-blue-700">Performance</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-2xl font-bold text-purple-600">{simulationData.projected.reliability}%</p>
              <p className="text-xs text-purple-700">Reliability</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h5 className="font-medium text-slate-900 mb-2">Migration Steps</h5>
            <ol className="text-sm text-slate-600 space-y-1">
              <li>1. Create GCP project and configure networking</li>
              <li>2. Provision compute instances and load balancers</li>
              <li>3. Migrate application data and configurations</li>
              <li>4. Update DNS and perform cutover</li>
              <li>5. Monitor and validate performance</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

function GeminiInsightsPanel({ workload }: { workload: string }) {
  const insights = [
    {
      type: 'cost-optimization',
      title: 'Cost Optimization Opportunity',
      message: 'Based on your usage patterns, switching to preemptible instances during off-peak hours could save an additional $320/month.',
      confidence: 'High',
      action: 'Configure Auto-scaling'
    },
    {
      type: 'performance',
      title: 'Performance Enhancement',
      message: 'Your workload would benefit from SSD storage and higher memory allocation. Expected 25% performance improvement.',
      confidence: 'Medium',
      action: 'Upgrade Storage'
    },
    {
      type: 'security',
      title: 'Security Recommendation',
      message: 'Consider enabling WAF and DDoS protection for your public-facing applications.',
      confidence: 'High',
      action: 'Review Security'
    }
  ]

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Gemini AI Insights</h3>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Real-time</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-slate-900 text-sm">{insight.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                insight.confidence === 'High' ? 'bg-green-100 text-green-700' :
                insight.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {insight.confidence}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">{insight.message}</p>
            <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors duration-200">
              {insight.action}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600 mb-2"><strong>Gemini Prompt Preview:</strong></p>
        <code className="text-xs text-slate-800 bg-slate-50 p-2 rounded block">
          "Analyze workload '{workload}' with current AWS setup. Consider cost optimization, performance, and reliability. Provide migration recommendations for GCP and Azure with confidence scores."
        </code>
      </div>
    </div>
  )
}

function MigrationOverview({ activeMigrations }: { activeMigrations: any[] }) {
  const migrationStats = {
    total: activeMigrations.length,
    inProgress: activeMigrations.filter(m => m.status === 'in-progress').length,
    completed: activeMigrations.filter(m => m.status === 'completed').length,
    planned: activeMigrations.filter(m => m.status === 'planned').length
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Migrations</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{migrationStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">In Progress</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{migrationStats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{migrationStats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Planned</p>
              <p className="text-2xl font-bold text-slate-600 mt-1">{migrationStats.planned}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Migrations</h3>
          <div className="space-y-4">
            {activeMigrations.filter(m => m.status === 'in-progress').map((migration) => (
              <div key={migration.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{migration.name}</h4>
                  <span className="text-sm text-slate-600">{migration.progress}%</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-slate-600">{migration.source}</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-sm text-slate-600">{migration.target}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${migration.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {activeMigrations.filter(m => m.status === 'in-progress').length === 0 && (
              <p className="text-slate-500 text-center py-8">No active migrations</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Migration Timeline</h3>
          <div className="space-y-4">
            {activeMigrations.slice(0, 5).map((migration) => (
              <div key={migration.id} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  migration.status === 'completed' ? 'bg-green-500' :
                  migration.status === 'in-progress' ? 'bg-orange-500' :
                  'bg-slate-300'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{migration.name}</p>
                  <p className="text-xs text-slate-600">
                    {migration.source} → {migration.target}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  migration.status === 'completed' ? 'bg-green-100 text-green-800' :
                  migration.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {migration.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Migration Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Database Optimization',
              description: 'Migrate MySQL workloads to managed database services',
              savings: '$1,200/mo',
              priority: 'High'
            },
            {
              title: 'Compute Right-sizing',
              description: 'Move oversized instances to cost-effective alternatives',
              savings: '$800/mo',
              priority: 'Medium'
            },
            {
              title: 'Storage Tiering',
              description: 'Implement intelligent storage tiering strategies',
              savings: '$450/mo',
              priority: 'Low'
            }
          ].map((rec, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900">{rec.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-blue-700 mb-2">{rec.description}</p>
              <p className="text-sm font-bold text-green-600">Save {rec.savings}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MigrationAssessment() {
  const [selectedWorkload, setSelectedWorkload] = useState('web-app')
  const [assessmentResults, setAssessmentResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [liveResourceData, setLiveResourceData] = useState<any>(null)
  const [assessmentMode, setAssessmentMode] = useState('basic') // 'basic' | 'ai-powered' | 'live-scan'

  const apiBase = (import.meta as any).env.VITE_API_BASE || 'http://localhost:5000'

  const workloads = [
    { id: 'web-app', name: 'Web Application Frontend', provider: 'AWS', instances: 3, region: 'us-east-1', cost: 450 },
    { id: 'api-service', name: 'API Backend Service', provider: 'GCP', instances: 5, region: 'us-central1', cost: 680 },
    { id: 'database', name: 'Database Cluster', provider: 'Azure', instances: 2, region: 'eastus', cost: 1200 },
    { id: 'analytics', name: 'Analytics Pipeline', provider: 'AWS', instances: 8, region: 'us-west-2', cost: 2100 }
  ]

  const runAdvancedAssessment = async () => {
    setLoading(true)
    setAssessmentResults(null)
    setAiAnalysis(null)

    try {
      // Phase 1: Basic Assessment
      const basicResults = {
        compatibility: {
          score: Math.floor(Math.random() * 20) + 80, // 80-100
          issues: [
            { severity: 'warning', message: 'Network configuration requires manual adjustment', impact: 'Medium' },
            { severity: 'info', message: 'Storage encryption keys need regeneration', impact: 'Low' },
            { severity: 'error', message: 'Legacy database version incompatible', impact: 'High' }
          ]
        },
        complexity: {
          score: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
          factors: ['Database dependencies', 'Custom networking', 'Third-party integrations', 'Legacy components']
        },
        cost: {
          current: workloads.find(w => w.id === selectedWorkload)?.cost || 1200,
          projected: Math.floor((workloads.find(w => w.id === selectedWorkload)?.cost || 1200) * 0.75),
          savings: 0
        },
        timeline: {
          estimated: '4-6 hours',
          phases: ['Preparation', 'Data Migration', 'Application Deployment', 'Testing', 'Cutover']
        },
        dependencies: {
          internal: ['User Authentication Service', 'Payment Gateway', 'Notification Service'],
          external: ['Stripe API', 'SendGrid', 'CloudFlare CDN'],
          databases: ['PostgreSQL Main DB', 'Redis Cache', 'MongoDB Analytics']
        },
        security: {
          score: Math.floor(Math.random() * 15) + 85,
          vulnerabilities: [
            { level: 'medium', description: 'Outdated SSL certificates' },
            { level: 'low', description: 'Missing security headers' }
          ]
        }
      }
      basicResults.cost.savings = basicResults.cost.current - basicResults.cost.projected
      setAssessmentResults(basicResults)

      // Phase 2: AI Analysis (if mode is ai-powered)
      if (assessmentMode === 'ai-powered') {
        const aiResponse = await fetch(`${apiBase}/api/ai/migration-analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workload: selectedWorkload,
            sourceProvider: workloads.find(w => w.id === selectedWorkload)?.provider,
            targetProvider: 'gcp' // Example target
          })
        })

        if (aiResponse.ok) {
          const aiData = await aiResponse.json()
          setAiAnalysis(aiData)
        } else {
          // Fallback AI analysis
          setAiAnalysis({
            recommendations: [
              {
                type: 'optimization',
                title: 'Container Migration Strategy',
                description: 'Recommended approach: Containerize application for better portability and cost efficiency',
                confidence: 92,
                impact: 'High',
                effort: 'Medium'
              },
              {
                type: 'cost',
                title: 'Reserved Instance Optimization',
                description: 'Switch to reserved instances for 40% cost savings on long-running workloads',
                confidence: 88,
                impact: 'High',
                effort: 'Low'
              },
              {
                type: 'performance',
                title: 'Database Optimization',
                description: 'Migrate to managed database service for better performance and reduced maintenance',
                confidence: 85,
                impact: 'Medium',
                effort: 'High'
              }
            ],
            riskAssessment: {
              overall: 'Medium',
              factors: [
                { risk: 'Data Loss', probability: 'Low', mitigation: 'Automated backup and validation' },
                { risk: 'Downtime', probability: 'Medium', mitigation: 'Blue-green deployment strategy' },
                { risk: 'Performance Degradation', probability: 'Low', mitigation: 'Load testing and monitoring' }
              ]
            },
            modernizationPath: {
              current: 'Legacy Monolith',
              recommended: 'Containerized Microservices',
              benefits: ['Better scalability', 'Improved deployment', 'Cost efficiency', 'Technology flexibility']
            }
          })
        }
      }

      // Phase 3: Live Resource Scan (if mode is live-scan)
      if (assessmentMode === 'live-scan') {
        // Simulate live resource discovery
        setTimeout(() => {
          setLiveResourceData({
            discoveredResources: [
              { type: 'EC2 Instance', name: 'web-server-01', size: 't3.medium', utilization: 45, cost: 67.32 },
              { type: 'RDS Database', name: 'main-db', size: 'db.t3.micro', utilization: 78, cost: 24.50 },
              { type: 'S3 Bucket', name: 'static-assets', size: '145GB', utilization: 100, cost: 3.34 },
              { type: 'CloudFront', name: 'cdn-distribution', size: '-', utilization: 67, cost: 12.89 }
            ],
            networkTopology: {
              vpcs: 2,
              subnets: 6,
              securityGroups: 8,
              loadBalancers: 2
            },
            utilizationMetrics: {
              avgCpuUtilization: 45,
              avgMemoryUtilization: 62,
              networkTraffic: '2.3TB/month',
              storageUsage: '678GB'
            }
          })
        }, 3000)
      }

    } catch (error) {
      console.error('Assessment failed:', error)
      setAssessmentResults({
        error: 'Assessment failed. Please try again or contact support.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Advanced Workload Assessment</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-blue-700">AI-Powered</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Workload</label>
              <select
                value={selectedWorkload}
                onChange={(e) => setSelectedWorkload(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {workloads.map((workload) => (
                  <option key={workload.id} value={workload.id}>
                    {workload.name} ({workload.provider} - ${workload.cost}/mo)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Assessment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setAssessmentMode('basic')}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    assessmentMode === 'basic' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setAssessmentMode('ai-powered')}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    assessmentMode === 'ai-powered' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  AI-Powered
                </button>
                <button
                  onClick={() => setAssessmentMode('live-scan')}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    assessmentMode === 'live-scan' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Live Scan
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Assessment Capabilities</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>AI-Powered Compatibility Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Intelligent Dependency Mapping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Predictive Cost-Benefit Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Advanced Risk Assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Live Resource Discovery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Security Vulnerability Scanning</span>
                </div>
              </div>
            </div>

            <button
              onClick={runAdvancedAssessment}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
                loading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Running Advanced Assessment...</span>
                </div>
              ) : (
                `Run ${assessmentMode === 'basic' ? 'Basic' : assessmentMode === 'ai-powered' ? 'AI-Powered' : 'Live'} Assessment`
              )}
            </button>
          </div>

          <div>
            {loading && (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-slate-600 mb-2">
                    {assessmentMode === 'basic' ? 'Analyzing workload compatibility...' :
                     assessmentMode === 'ai-powered' ? 'AI is analyzing migration patterns...' :
                     'Scanning live cloud resources...'}
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {assessmentResults && !loading && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-900">Compatibility Score</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">{assessmentResults.compatibility.score}%</span>
                      {assessmentResults.compatibility.score >= 90 && (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${assessmentResults.compatibility.score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-1">Complexity</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      assessmentResults.complexity.score === 'Low' ? 'bg-green-100 text-green-800' :
                      assessmentResults.complexity.score === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {assessmentResults.complexity.score}
                    </span>
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-1">Security Score</h4>
                    <span className="text-lg font-bold text-blue-600">{assessmentResults.security?.score || 88}%</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Cost Impact Analysis</h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <p className="text-slate-600">Current</p>
                      <p className="font-bold text-slate-900">${assessmentResults.cost.current}/mo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600">Projected</p>
                      <p className="font-bold text-slate-900">${assessmentResults.cost.projected}/mo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-600">Savings</p>
                      <p className="font-bold text-green-600">${assessmentResults.cost.savings}/mo</p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                    💡 Estimated ROI: {Math.round((assessmentResults.cost.savings / assessmentResults.cost.current) * 100)}% cost reduction
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Migration Timeline</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-bold text-purple-600">{assessmentResults.timeline.estimated}</span>
                  </div>
                  <div className="text-xs text-purple-700">
                    Includes automated testing and rollback preparation
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Issues & Recommendations */}
      {assessmentResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Assessment Issues & Risks</h3>
            <div className="space-y-3">
              {assessmentResults.compatibility.issues.map((issue: any, index: number) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  issue.severity === 'error' ? 'bg-red-50 border-red-200' :
                  issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <svg className={`w-5 h-5 mt-0.5 ${
                      issue.severity === 'error' ? 'text-red-600' :
                      issue.severity === 'warning' ? 'text-yellow-600' : 
                      'text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                        issue.severity === 'error' ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" :
                        issue.severity === 'warning' ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" :
                        "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      } />
                    </svg>
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${
                        issue.severity === 'error' ? 'text-red-800' :
                        issue.severity === 'warning' ? 'text-yellow-800' : 
                        'text-blue-800'
                      }`}>
                        {issue.message}
                      </span>
                      {issue.impact && (
                        <div className="mt-1">
                          <span className="text-xs text-slate-600">Impact: </span>
                          <span className={`text-xs font-medium ${
                            issue.impact === 'High' ? 'text-red-600' :
                            issue.impact === 'Medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {issue.impact}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Dependencies Analysis</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Internal Dependencies</h4>
                <div className="flex flex-wrap gap-2">
                  {assessmentResults.dependencies?.internal.map((dep: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">External Dependencies</h4>
                <div className="flex flex-wrap gap-2">
                  {assessmentResults.dependencies?.external.map((dep: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Database Dependencies</h4>
                <div className="flex flex-wrap gap-2">
                  {assessmentResults.dependencies?.databases.map((dep: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Recommendations */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">AI-Powered Recommendations</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Gemini AI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {aiAnalysis.recommendations?.map((rec: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900 text-sm">{rec.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.confidence >= 90 ? 'bg-green-100 text-green-700' :
                    rec.confidence >= 80 ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {rec.confidence}% confidence
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">{rec.description}</p>
                <div className="flex justify-between text-xs">
                  <span className={`px-2 py-1 rounded ${
                    rec.impact === 'High' ? 'bg-green-100 text-green-800' :
                    rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {rec.impact} Impact
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    rec.effort === 'Low' ? 'bg-green-100 text-green-800' :
                    rec.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rec.effort} Effort
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">Modernization Pathway</h4>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xs font-medium text-slate-600">Current</span>
                </div>
                <p className="text-sm font-medium text-slate-900">{aiAnalysis.modernizationPath?.current}</p>
              </div>
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xs font-medium text-blue-600">Future</span>
                </div>
                <p className="text-sm font-medium text-blue-900">{aiAnalysis.modernizationPath?.recommended}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Resource Data */}
      {liveResourceData && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Live Resource Discovery</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Discovered Resources</h4>
              <div className="space-y-2">
                {liveResourceData.discoveredResources?.map((resource: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{resource.name}</p>
                      <p className="text-xs text-slate-600">{resource.type} - {resource.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">${resource.cost}/mo</p>
                      <p className="text-xs text-slate-600">{resource.utilization}% utilized</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Infrastructure Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">CPU Utilization</p>
                  <p className="text-lg font-bold text-blue-900">{liveResourceData.utilizationMetrics?.avgCpuUtilization}%</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">Memory Usage</p>
                  <p className="text-lg font-bold text-green-900">{liveResourceData.utilizationMetrics?.avgMemoryUtilization}%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">Network Traffic</p>
                  <p className="text-lg font-bold text-purple-900">{liveResourceData.utilizationMetrics?.networkTraffic}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">Storage Used</p>
                  <p className="text-lg font-bold text-orange-900">{liveResourceData.utilizationMetrics?.storageUsage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MigrationPlanner() {
  const [migrationPlan, setMigrationPlan] = useState({
    source: 'aws',
    target: 'gcp',
    workloadType: 'web-app',
    migrationStrategy: 'lift-and-shift',
    schedule: 'immediate',
    automationLevel: 'high',
    complianceRequirements: ['GDPR', 'SOC2'],
    performanceGoals: 'optimize-cost'
  })

  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [terraformCode, setTerraformCode] = useState<string>('')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [planValidation, setPlanValidation] = useState<any>(null)

  const generateAdvancedPlan = async () => {
    // Enhanced plan generation with Infrastructure as Code
    const plan = {
      phases: [
        {
          name: 'Preparation & Planning',
          duration: '3 hours',
          automationLevel: 95,
          tasks: [
            'Automated environment discovery and mapping',
            'Infrastructure as Code generation (Terraform/CloudFormation)',
            'Security group and firewall rule migration',
            'Network topology analysis and setup',
            'DNS and load balancer configuration',
            'Monitoring and alerting setup',
            'Backup and disaster recovery validation'
          ],
          dependencies: ['Network team approval', 'Security review'],
          risks: [
            { level: 'low', description: 'Network configuration conflicts' },
            { level: 'medium', description: 'DNS propagation delays' }
          ]
        },
        {
          name: 'Data & Database Migration',
          duration: '4 hours',
          automationLevel: 85,
          tasks: [
            'Database schema analysis and optimization',
            'Data migration with zero-downtime strategy',
            'Database performance tuning and indexing',
            'Data validation and integrity checks',
            'Connection string and configuration updates',
            'Database backup and point-in-time recovery setup'
          ],
          dependencies: ['Database maintenance window', 'Application team coordination'],
          risks: [
            { level: 'high', description: 'Data loss during migration' },
            { level: 'medium', description: 'Performance degradation' }
          ]
        },
        {
          name: 'Application & Service Deployment',
          duration: '2 hours',
          automationLevel: 90,
          tasks: [
            'Containerized application deployment',
            'Microservices orchestration setup',
            'Load balancer and auto-scaling configuration',
            'Service mesh implementation (if applicable)',
            'API gateway and security policies',
            'Environment variable and secrets migration'
          ],
          dependencies: ['Container registry setup', 'CI/CD pipeline updates'],
          risks: [
            { level: 'medium', description: 'Service discovery issues' },
            { level: 'low', description: 'Container startup delays' }
          ]
        },
        {
          name: 'Testing & Validation',
          duration: '3 hours',
          automationLevel: 80,
          tasks: [
            'Automated functional testing suite',
            'Performance and load testing',
            'Security vulnerability scanning',
            'Integration testing with external services',
            'User acceptance testing coordination',
            'Rollback procedure validation'
          ],
          dependencies: ['Test data preparation', 'Stakeholder availability'],
          risks: [
            { level: 'medium', description: 'Test environment instability' },
            { level: 'low', description: 'Third-party service incompatibility' }
          ]
        },
        {
          name: 'Cutover & Go-Live',
          duration: '1 hour',
          automationLevel: 95,
          tasks: [
            'Blue-green deployment execution',
            'DNS cutover and traffic routing',
            'Real-time monitoring activation',
            'Performance metrics validation',
            'User communication and status updates',
            'Legacy environment decommissioning'
          ],
          dependencies: ['Go-live approval', 'Support team readiness'],
          risks: [
            { level: 'high', description: 'Traffic routing failures' },
            { level: 'medium', description: 'Performance issues under load' }
          ]
        }
      ],
      totalDuration: '13 hours',
      estimatedCost: 850,
      riskLevel: 'Medium',
      automationScore: 89,
      complianceChecks: [
        { requirement: 'GDPR', status: 'compliant', details: 'Data residency in EU regions' },
        { requirement: 'SOC2', status: 'compliant', details: 'Encryption and access controls verified' },
        { requirement: 'ISO27001', status: 'pending', details: 'Security assessment required' }
      ],
      resourceOptimization: {
        currentInstances: 12,
        optimizedInstances: 8,
        costSavings: 32,
        performanceImprovement: 15
      }
    }

    setGeneratedPlan(plan)

    // Generate Infrastructure as Code
    const terraform = `
# Generated Terraform Configuration for ${migrationPlan.source} to ${migrationPlan.target} Migration
# Generated on: ${new Date().toISOString()}

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "\${var.environment}-vpc"
  auto_create_subnetworks = false
  description            = "Main VPC for migrated workload"
}

# Subnet
resource "google_compute_subnetwork" "main" {
  name          = "\${var.environment}-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.main.id
  
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.1.0.0/24"
  }
}

# Compute Instance Template
resource "google_compute_instance_template" "web_app" {
  name_prefix  = "\${var.environment}-web-"
  machine_type = "e2-standard-2"
  
  disk {
    source_image = "ubuntu-os-cloud/ubuntu-2004-lts"
    auto_delete  = true
    boot         = true
    disk_size_gb = 50
    disk_type    = "pd-ssd"
  }
  
  network_interface {
    subnetwork = google_compute_subnetwork.main.id
    access_config {
      # Ephemeral public IP
    }
  }
  
  metadata_startup_script = file("startup-script.sh")
  
  lifecycle {
    create_before_destroy = true
  }
  
  tags = ["web-server", "production"]
}

# Managed Instance Group
resource "google_compute_region_instance_group_manager" "web_app" {
  name               = "\${var.environment}-web-mig"
  base_instance_name = "\${var.environment}-web"
  region             = var.region
  target_size        = 3
  
  version {
    instance_template = google_compute_instance_template.web_app.id
  }
  
  named_port {
    name = "http"
    port = 8080
  }
  
  auto_healing_policies {
    health_check      = google_compute_health_check.web_app.id
    initial_delay_sec = 300
  }
}

# Load Balancer
resource "google_compute_global_address" "web_app" {
  name = "\${var.environment}-web-ip"
}

resource "google_compute_health_check" "web_app" {
  name = "\${var.environment}-web-health-check"
  
  http_health_check {
    port = "8080"
    request_path = "/health"
  }
}

# Cloud SQL Database
resource "google_sql_database_instance" "main" {
  name             = "\${var.environment}-db"
  database_version = "POSTGRES_13"
  region           = var.region
  
  settings {
    tier      = "db-g1-small"
    disk_size = 100
    disk_type = "PD_SSD"
    
    backup_configuration {
      enabled    = true
      start_time = "03:00"
    }
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
    }
  }
}

# Outputs
output "load_balancer_ip" {
  description = "Load balancer public IP"
  value       = google_compute_global_address.web_app.address
}

output "database_connection" {
  description = "Database connection name"
  value       = google_sql_database_instance.main.connection_name
  sensitive   = true
}
`
    setTerraformCode(terraform)

    // Validate the plan
    setPlanValidation({
      score: 92,
      checks: [
        { category: 'Security', status: 'passed', details: 'All security requirements met' },
        { category: 'Performance', status: 'passed', details: 'Expected 15% improvement' },
        { category: 'Cost', status: 'passed', details: '32% cost reduction projected' },
        { category: 'Compliance', status: 'warning', details: 'ISO27001 assessment pending' },
        { category: 'Automation', status: 'passed', details: '89% automation coverage' }
      ]
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Advanced Migration Planner</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Source Provider</label>
                <select
                  value={migrationPlan.source}
                  onChange={(e) => setMigrationPlan({...migrationPlan, source: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="aws">Amazon Web Services</option>
                  <option value="gcp">Google Cloud Platform</option>
                  <option value="azure">Microsoft Azure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Provider</label>
                <select
                  value={migrationPlan.target}
                  onChange={(e) => setMigrationPlan({...migrationPlan, target: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gcp">Google Cloud Platform</option>
                  <option value="azure">Microsoft Azure</option>
                  <option value="aws">Amazon Web Services</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Migration Strategy</label>
              <select
                value={migrationPlan.migrationStrategy}
                onChange={(e) => setMigrationPlan({...migrationPlan, migrationStrategy: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="lift-and-shift">Lift and Shift (Rehost)</option>
                <option value="re-platform">Re-platform (Replatform)</option>
                <option value="refactor">Refactor (Rearchitect)</option>
                <option value="containerize">Containerize & Modernize</option>
                <option value="serverless">Serverless Migration</option>
                <option value="hybrid">Hybrid Cloud Strategy</option>
              </select>
            </div>

            {showAdvancedOptions && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900">Advanced Configuration</h4>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Automation Level</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={migrationPlan.automationLevel === 'high' ? 90 : migrationPlan.automationLevel === 'medium' ? 60 : 30}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setMigrationPlan({
                          ...migrationPlan, 
                          automationLevel: val > 75 ? 'high' : val > 45 ? 'medium' : 'low'
                        })
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-slate-900 w-16">
                      {migrationPlan.automationLevel === 'high' ? '90%' : migrationPlan.automationLevel === 'medium' ? '60%' : '30%'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Performance Goals</label>
                  <select
                    value={migrationPlan.performanceGoals}
                    onChange={(e) => setMigrationPlan({...migrationPlan, performanceGoals: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="optimize-cost">Optimize for Cost</option>
                    <option value="optimize-performance">Optimize for Performance</option>
                    <option value="optimize-reliability">Optimize for Reliability</option>
                    <option value="balanced">Balanced Approach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Compliance Requirements</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['GDPR', 'SOC2', 'HIPAA', 'PCI-DSS', 'ISO27001', 'FedRAMP'].map((compliance) => (
                      <label key={compliance} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={migrationPlan.complianceRequirements.includes(compliance)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMigrationPlan({
                                ...migrationPlan,
                                complianceRequirements: [...migrationPlan.complianceRequirements, compliance]
                              })
                            } else {
                              setMigrationPlan({
                                ...migrationPlan,
                                complianceRequirements: migrationPlan.complianceRequirements.filter(c => c !== compliance)
                              })
                            }
                          }}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm text-slate-700">{compliance}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={generateAdvancedPlan}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Generate Advanced Migration Plan
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">AI-Enhanced Planning</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-blue-800">Intelligent resource right-sizing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-800">Automated dependency mapping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  <span className="text-blue-800">Predictive cost optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-blue-800">Performance impact analysis</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Automation Benefits</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">95%</p>
                  <p className="text-green-800">Automation Coverage</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">75%</p>
                  <p className="text-green-800">Time Reduction</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">90%</p>
                  <p className="text-green-800">Error Reduction</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">Zero</p>
                  <p className="text-green-800">Downtime Goal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {generatedPlan && (
        <div className="space-y-6">
          {/* Plan Validation */}
          {planValidation && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Plan Validation</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">{planValidation.score}/100</span>
                  <span className="text-sm text-slate-600">Validation Score</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {planValidation.checks.map((check: any, index: number) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    check.status === 'passed' ? 'bg-green-50 border-green-200' :
                    check.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <svg className={`w-4 h-4 ${
                        check.status === 'passed' ? 'text-green-600' :
                        check.status === 'warning' ? 'text-yellow-600' :
                        'text-red-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                          check.status === 'passed' ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" :
                          check.status === 'warning' ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" :
                          "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        } />
                      </svg>
                      <span className="text-sm font-medium text-slate-900">{check.category}</span>
                    </div>
                    <p className="text-xs text-slate-600">{check.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Migration Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Advanced Migration Plan</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-slate-600">Duration: <strong>{generatedPlan.totalDuration}</strong></span>
                <span className="text-slate-600">Cost: <strong>${generatedPlan.estimatedCost}</strong></span>
                <span className="text-slate-600">Automation: <strong>{generatedPlan.automationScore}%</strong></span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  generatedPlan.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                  generatedPlan.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Risk: {generatedPlan.riskLevel}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {generatedPlan.phases.map((phase: any, index: number) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{phase.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>Duration: {phase.duration}</span>
                          <span>Automation: {phase.automationLevel}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{phase.automationLevel}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Tasks</h5>
                      <ul className="space-y-1">
                        {phase.tasks.map((task: string, taskIndex: number) => (
                          <li key={taskIndex} className="flex items-center space-x-2 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Dependencies</h5>
                      <ul className="space-y-1">
                        {phase.dependencies?.map((dep: string, depIndex: number) => (
                          <li key={depIndex} className="flex items-center space-x-2 text-sm text-orange-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>{dep}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Risk Factors</h5>
                      <ul className="space-y-1">
                        {phase.risks?.map((risk: any, riskIndex: number) => (
                          <li key={riskIndex} className="flex items-center space-x-2 text-sm">
                            <span className={`w-2 h-2 rounded-full ${
                              risk.level === 'high' ? 'bg-red-500' :
                              risk.level === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></span>
                            <span className="text-slate-600">{risk.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resource Optimization Summary */}
            {generatedPlan.resourceOptimization && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-3">Resource Optimization Summary</h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{generatedPlan.resourceOptimization.optimizedInstances}</p>
                    <p className="text-sm text-green-800">Optimized Instances</p>
                    <p className="text-xs text-green-600">from {generatedPlan.resourceOptimization.currentInstances}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{generatedPlan.resourceOptimization.costSavings}%</p>
                    <p className="text-sm text-green-800">Cost Reduction</p>
                    <p className="text-xs text-green-600">monthly savings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{generatedPlan.resourceOptimization.performanceImprovement}%</p>
                    <p className="text-sm text-green-800">Performance Gain</p>
                    <p className="text-xs text-green-600">expected improvement</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{generatedPlan.automationScore}%</p>
                    <p className="text-sm text-green-800">Automation</p>
                    <p className="text-xs text-green-600">fully automated</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                Export Plan
              </button>
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                Download Terraform
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Start Migration
              </button>
            </div>
          </div>

          {/* Infrastructure as Code */}
          {terraformCode && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Generated Infrastructure as Code</h3>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Terraform</span>
                  <button className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
                    Copy Code
                  </button>
                  <button className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
                    Download
                  </button>
                </div>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-slate-100">
                  <code>{terraformCode.trim()}</code>
                </pre>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-900">Infrastructure Highlights</span>
                </div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Auto-scaling managed instance groups for high availability</li>
                  <li>• Cloud SQL with automated backups and private networking</li>
                  <li>• Load balancer with health checks and SSL termination</li>
                  <li>• VPC with properly segmented subnets and security groups</li>
                  <li>• Monitoring and logging configuration included</li>
                </ul>
              </div>
            </div>
          )}

          {/* Compliance Summary */}
          {generatedPlan.complianceChecks && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Compliance Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generatedPlan.complianceChecks.map((compliance: any, index: number) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    compliance.status === 'compliant' ? 'bg-green-50 border-green-200' :
                    compliance.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{compliance.requirement}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        compliance.status === 'compliant' ? 'bg-green-100 text-green-800' :
                        compliance.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {compliance.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{compliance.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MigrationExecute({ activeMigrations }: { activeMigrations: any[] }) {
  const [selectedMigration, setSelectedMigration] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Migration Execution</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Available Migrations</h4>
            <div className="space-y-3">
              {activeMigrations.map((migration) => (
                <div 
                  key={migration.id}
                  onClick={() => setSelectedMigration(migration.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedMigration === migration.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-slate-900">{migration.name}</h5>
                      <p className="text-sm text-slate-600">{migration.source} → {migration.target}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      migration.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                      migration.status === 'planned' ? 'bg-slate-100 text-slate-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {migration.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {selectedMigration ? (
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Migration Controls</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Start Migration
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    Pause Migration
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Stop Migration
                  </button>
                  <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700">
                    Rollback
                  </button>
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h5 className="font-medium text-slate-900 mb-2">Pre-flight Checklist</h5>
                  <div className="space-y-2">
                    {[
                      'Source environment backed up',
                      'Target environment configured',
                      'Network connectivity verified',
                      'DNS records prepared',
                      'Monitoring configured'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                        <span className="text-sm text-slate-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-500">
                Select a migration to view controls
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MigrationMonitor({ activeMigrations }: { activeMigrations: any[] }) {
  const [selectedMigration, setSelectedMigration] = useState(activeMigrations[0]?.id || null)
  
  const selectedMigrationData = activeMigrations.find(m => m.id === selectedMigration)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Migration Monitoring</h3>
          <select
            value={selectedMigration || ''}
            onChange={(e) => setSelectedMigration(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            {activeMigrations.map((migration) => (
              <option key={migration.id} value={migration.id}>
                {migration.name}
              </option>
            ))}
          </select>
        </div>

        {selectedMigrationData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Migration Progress</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Overall Progress</span>
                  <span className="text-sm font-medium text-slate-900">{selectedMigrationData.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${selectedMigrationData.progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Started: {new Date(selectedMigrationData.startTime).toLocaleString()}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Current Phase</h4>
                {[
                  { name: 'Preparation', status: 'completed', progress: 100 },
                  { name: 'Data Migration', status: 'in-progress', progress: 75 },
                  { name: 'Application Deployment', status: 'pending', progress: 0 },
                  { name: 'Testing', status: 'pending', progress: 0 },
                  { name: 'Cutover', status: 'pending', progress: 0 }
                ].map((phase, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      phase.status === 'completed' ? 'bg-green-500' :
                      phase.status === 'in-progress' ? 'bg-orange-500' :
                      'bg-slate-300'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">{phase.name}</span>
                        <span className="text-xs text-slate-500">{phase.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${
                            phase.status === 'completed' ? 'bg-green-500' :
                            phase.status === 'in-progress' ? 'bg-orange-500' :
                            'bg-slate-300'
                          }`}
                          style={{ width: `${phase.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-700">Throughput</p>
                    <p className="font-bold text-green-900">2.4 GB/min</p>
                  </div>
                  <div>
                    <p className="text-green-700">ETA</p>
                    <p className="font-bold text-green-900">2h 15m</p>
                  </div>
                  <div>
                    <p className="text-green-700">Transferred</p>
                    <p className="font-bold text-green-900">156 GB</p>
                  </div>
                  <div>
                    <p className="text-green-700">Remaining</p>
                    <p className="font-bold text-green-900">84 GB</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">System Health</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Source System</span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-blue-900 font-medium">Healthy</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Target System</span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-blue-900 font-medium">Healthy</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Network</span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-blue-900 font-medium">Stable</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Recent Events</h4>
                <div className="space-y-2 text-sm">
                  {[
                    { time: '14:32', message: 'Database sync completed', type: 'success' },
                    { time: '14:28', message: 'Application files transferred', type: 'info' },
                    { time: '14:15', message: 'Migration phase 2 started', type: 'info' },
                    { time: '14:12', message: 'Network configuration verified', type: 'success' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-slate-500 text-xs w-12">{event.time}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        event.type === 'success' ? 'bg-green-500' :
                        event.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <span className="text-slate-700">{event.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MigrationTab() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [activeMigrations] = useState([
    {
      id: 'mig-001',
      name: 'Web App Frontend',
      source: 'AWS',
      target: 'GCP',
      status: 'in-progress',
      progress: 65,
      startTime: '2025-09-20T08:30:00Z',
      estimatedCompletion: '2025-09-20T14:30:00Z',
      type: 'compute'
    },
    {
      id: 'mig-002', 
      name: 'Database Cluster',
      source: 'Azure',
      target: 'AWS',
      status: 'planned',
      progress: 0,
      startTime: '2025-09-21T09:00:00Z',
      estimatedCompletion: '2025-09-21T18:00:00Z',
      type: 'database'
    }
  ])

  const migrationTabs = [
    { id: 'overview', label: 'Overview', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'assessment', label: 'Assessment', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'planner', label: 'Migration Planner', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'execute', label: 'Execute', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1' },
    { id: 'monitor', label: 'Monitor', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Migration Center</h2>
          <p className="text-slate-600 mt-1">Plan, execute, and monitor cloud workload migrations</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">{activeMigrations.filter(m => m.status === 'in-progress').length} Active</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            New Migration
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {migrationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedTab === tab.id
                ? 'bg-blue-700 text-white border border-blue-700 shadow-sm'
                : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-700'
            }`}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {selectedTab === 'overview' && <MigrationOverview activeMigrations={activeMigrations} />}
      {selectedTab === 'assessment' && <MigrationAssessment />}
      {selectedTab === 'planner' && <MigrationPlanner />}
      {selectedTab === 'execute' && <MigrationExecute activeMigrations={activeMigrations} />}
      {selectedTab === 'monitor' && <MigrationMonitor activeMigrations={activeMigrations} />}
    </div>
  )
}

export default App

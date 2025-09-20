import { useState, useEffect, useRef } from 'react'
import './App.css'
import { CostTrendChart, AlertsPanel, PerformanceMetrics } from './components/DashboardComponents'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 1500)
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

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'optimization' && <OptimizationTab />}
        {activeTab === 'migration' && <MigrationTab />}
      </main>
    </div>
  )
}

// Overview Tab Component
function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
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

      {/* Charts and Performance Section */}
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

      {/* Cloud Provider Overview and Alerts */}
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

      {/* Recent Activity */}
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

// Metric Card Component
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

// Cloud Provider Card Component
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

// Analytics Tab Component
function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('cost')

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-600 mt-1">Deep insights into your multi-cloud performance and costs</p>
        </div>
        
        {/* Time Range Selector */}
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

      {/* Metric Type Selector */}
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

      {/* Analytics Content */}
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI-Powered Optimization</h2>
          <p className="text-slate-600 mt-1">Intelligent workload placement recommendations using Gemini AI</p>
        </div>
        
        {/* AI Status Indicator */}
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

      {/* Workload & Optimization Type Selectors */}
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

      {/* AI Recommendations Panel */}
      <AIRecommendationsPanel 
        workload={selectedWorkload} 
        optimizationType={optimizationType}
      />

      {/* Simulation Panel */}
      {showSimulation && (
        <SimulationPanel 
          workload={selectedWorkload} 
          optimizationType={optimizationType}
        />
      )}

      {/* Gemini AI Insights */}
      <GeminiInsightsPanel workload={selectedWorkload} />
    </div>
  )
}

// Cost Analytics Component
function CostAnalytics({ timeRange }: { timeRange: string }) {
  // Use timeRange for future dynamic data loading
  console.log('Cost analytics for time range:', timeRange)
  const costData = [
    { provider: 'AWS', current: 4520, previous: 4200, change: '+7.6%', trend: 'up' },
    { provider: 'Google Cloud', current: 3890, previous: 4100, change: '-5.1%', trend: 'down' },
    { provider: 'Azure', current: 2340, previous: 2200, change: '+6.4%', trend: 'up' }
  ]

  return (
    <div className="space-y-6">
      {/* Cost Summary Cards */}
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

      {/* Cost Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Trends</h3>
        <div className="h-80 flex items-end justify-center space-x-8">
          {[
            { month: 'Jan', aws: 4200, gcp: 3800, azure: 2100 },
            { month: 'Feb', aws: 4500, gcp: 4200, azure: 2300 },
            { month: 'Mar', aws: 4800, gcp: 3900, azure: 2500 },
            { month: 'Apr', aws: 4600, gcp: 4100, azure: 2400 },
            { month: 'May', aws: 4900, gcp: 4300, azure: 2600 },
            { month: 'Jun', aws: 4700, gcp: 4000, azure: 2200 }
          ].map((item) => (
            <div key={item.month} className="flex flex-col items-center space-y-2">
              <div className="flex space-x-1">
                <div
                  className="w-6 bg-orange-500 rounded-t"
                  style={{ height: `${(item.aws / 5000) * 200}px` }}
                  title={`AWS: $${item.aws}`}
                ></div>
                <div
                  className="w-6 bg-blue-500 rounded-t"
                  style={{ height: `${(item.gcp / 5000) * 200}px` }}
                  title={`GCP: $${item.gcp}`}
                ></div>
                <div
                  className="w-6 bg-green-500 rounded-t"
                  style={{ height: `${(item.azure / 5000) * 200}px` }}
                  title={`Azure: $${item.azure}`}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
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

// Performance Analytics Component
function PerformanceAnalytics({ timeRange }: { timeRange: string }) {
  // Use timeRange for future dynamic data loading
  console.log('Performance analytics for time range:', timeRange)
  return (
    <div className="space-y-6">
      {/* Performance Metrics Grid */}
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

      {/* Performance Trends */}
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

      {/* Provider Performance Comparison */}
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

// Resource Analytics Component
function ResourceAnalytics({ timeRange }: { timeRange: string }) {
  // Use timeRange for future dynamic data loading
  console.log('Resource analytics for time range:', timeRange)
  return (
    <div className="space-y-6">
      {/* Resource Utilization Overview */}
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

      {/* Resource Trends */}
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

      {/* Instance Details */}
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

// Comparison Analytics Component
function ComparisonAnalytics({ timeRange }: { timeRange: string }) {
  // Use timeRange for future dynamic data loading
  console.log('Comparison analytics for time range:', timeRange)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; title: string; lines: string[] }>({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    lines: []
  })

  // interactive tooltip state is used with SVG circles below

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
      {/* Provider Comparison Cards */}
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

      {/* Cost vs Performance Scatter Plot */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost vs Performance Analysis</h3>
        <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
          <div ref={containerRef} className="text-center relative">
            <svg width="520" height="300" viewBox="0 0 520 300" className="bg-white rounded-lg shadow-sm border border-slate-200">
              {/* margins */}
              <g transform="translate(50,20)">
                {/* grid lines and axes */}
                <g>
                  {/* vertical grid */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line key={`v-${i}`} x1={(i * 80)} y1={0} x2={(i * 80)} y2={220} stroke="#eef2f7" />
                  ))}
                  {/* horizontal grid */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={`h-${i}`} x1={0} y1={(i * 55)} x2={400} y2={(i * 55)} stroke="#eef2f7" />
                  ))}
                </g>

                {/* axes labels */}
                <text x={200} y={250} textAnchor="middle" className="text-slate-500">Monthly Cost (USD)</text>
                <text x={-30} y={110} transform="rotate(-90 -30 110)" textAnchor="middle" className="text-slate-500">Performance Score</text>

                {/* data points */}
                {
                  // define raw provider data
                  (() => {
                    const providers = [
                      { id: 'aws', label: 'AWS', cost: 4520, performance: 9.2, reliability: 9.5, color: '#1d4ed8', note: 'High Cost, High Performance' },
                      { id: 'gcp', label: 'GCP', cost: 3890, performance: 9.5, reliability: 9.3, color: '#059669', note: 'Medium Cost, High Performance' },
                      { id: 'azure', label: 'Azure', cost: 2340, performance: 8.8, reliability: 9.1, color: '#f97316', note: 'Low Cost, Medium Performance' }
                    ]

                    // scales
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

      {/* ROI Analysis */}
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

// AI Recommendations Panel Component
function AIRecommendationsPanel({ workload, optimizationType }: { workload: string; optimizationType: string }) {
  // Dynamic Gemini-backed recommendations (calls backend API)
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
      // Provide minimal graceful fallback so UI not empty
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

  // Initial + dependency-based fetch
  useEffect(() => {
    const ac = new AbortController()
    fetchRecommendations(ac.signal)
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

// Simulation Panel Component
function SimulationPanel({ workload, optimizationType }: { workload: string; optimizationType: string }) {
  // Use parameters for future dynamic simulation
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
        {/* Simulation Controls */}
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

        {/* Simulation Results */}
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

// Gemini Insights Panel Component
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

function MigrationTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Workload Migration</h2>
      <p className="text-slate-600">Automated migration tools and recommendations coming soon...</p>
    </div>
  )
}

export default App

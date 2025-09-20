import { useState, useEffect } from 'react'
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-900">CloudOptimizer</h1>
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
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

// Placeholder components for other tabs
function AnalyticsTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Analytics Dashboard</h2>
      <p className="text-slate-600">Advanced analytics and reporting features coming soon...</p>
    </div>
  )
}

function OptimizationTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">AI Optimization</h2>
      <p className="text-slate-600">Intelligent cost optimization and workload balancing coming soon...</p>
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

import { useState } from 'react'

export function CostTrendChart() {
  const [hoveredData, setHoveredData] = useState<any>(null)
  
  const data = [
    { month: 'Jan', aws: 4200, gcp: 3800, azure: 2100, total: 10100, change: '+2.3%' },
    { month: 'Feb', aws: 4500, gcp: 4200, azure: 2300, total: 11000, change: '+8.9%' },
    { month: 'Mar', aws: 4800, gcp: 3900, azure: 2500, total: 11200, change: '+1.8%' },
    { month: 'Apr', aws: 4600, gcp: 4100, azure: 2400, total: 11100, change: '-0.9%' },
    { month: 'May', aws: 4900, gcp: 4300, azure: 2600, total: 11800, change: '+6.3%' },
    { month: 'Jun', aws: 4700, gcp: 4000, azure: 2200, total: 10900, change: '-7.6%' }
  ]

  const maxValue = Math.max(...data.flatMap(d => [d.aws, d.gcp, d.azure]))
  const totalCost = data[data.length - 1].total
  const avgMonthlyCost = Math.round(data.reduce((sum, d) => sum + d.total, 0) / data.length)

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="text-lg font-bold text-slate-900">${totalCost.toLocaleString()}</div>
          <div className="text-xs text-slate-600">Current Month</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="text-lg font-bold text-slate-900">${avgMonthlyCost.toLocaleString()}</div>
          <div className="text-xs text-slate-600">6-Month Avg</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className={`text-lg font-bold ${
            data[data.length - 1].change.startsWith('+') ? 'text-red-600' : 'text-green-600'
          }`}>{data[data.length - 1].change}</div>
          <div className="text-xs text-slate-600">Month Change</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-slate-600">AWS</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-slate-600">GCP</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-slate-600">Azure</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="h-48 flex items-end justify-center space-x-6 bg-slate-50 rounded-lg p-4">
          {data.map((item) => (
            <div key={item.month} className="flex flex-col items-center space-y-2">
              {/* Bars */}
              <div className="flex space-x-1" style={{ height: '140px', alignItems: 'flex-end' }}>
                <div
                  className="w-4 bg-orange-500 rounded-t cursor-pointer transition-all duration-300 hover:opacity-80 relative group"
                  style={{ height: `${(item.aws / maxValue) * 120}px` }}
                  onMouseEnter={() => setHoveredData({...item, provider: 'AWS', value: item.aws})}
                  onMouseLeave={() => setHoveredData(null)}
                ></div>
                <div
                  className="w-4 bg-blue-500 rounded-t cursor-pointer transition-all duration-300 hover:opacity-80"
                  style={{ height: `${(item.gcp / maxValue) * 120}px` }}
                  onMouseEnter={() => setHoveredData({...item, provider: 'GCP', value: item.gcp})}
                  onMouseLeave={() => setHoveredData(null)}
                ></div>
                <div
                  className="w-4 bg-green-500 rounded-t cursor-pointer transition-all duration-300 hover:opacity-80"
                  style={{ height: `${(item.azure / maxValue) * 120}px` }}
                  onMouseEnter={() => setHoveredData({...item, provider: 'Azure', value: item.azure})}
                  onMouseLeave={() => setHoveredData(null)}
                ></div>
              </div>
              
              {/* Month labels */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-700">{item.month}</div>
                <div className="text-xs text-slate-500">${(item.total/1000).toFixed(1)}k</div>
                <div className={`text-xs font-medium ${
                  item.change.startsWith('+') ? 'text-red-600' : 'text-green-600'
                }`}>{item.change}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tooltip */}
        {hoveredData && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm z-10">
            <div className="font-medium">{hoveredData.provider} - {hoveredData.month}</div>
            <div>${hoveredData.value.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function AlertsPanel() {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High CPU Usage',
      message: 'GCP instance web-server-01 is running at 92% CPU utilization',
      time: '5 minutes ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'Cost Optimization Opportunity',
      message: 'Switching 3 AWS t3.medium instances to t3.small could save $127/month',
      time: '1 hour ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Migration Completed',
      message: 'Successfully migrated data pipeline from AWS to GCP',
      time: '2 hours ago',
      priority: 'low'
    },
    {
      id: 4,
      type: 'error',
      title: 'Service Disruption',
      message: 'Azure VM db-server-01 is experiencing connectivity issues',
      time: '3 hours ago',
      priority: 'high'
    }
  ]

  const getAlertStyles = (type: string) => {
    const baseStyles = "p-4 rounded-lg border transition-all duration-200 hover:shadow-md"

    if (type === 'warning') return `${baseStyles} bg-orange-50 border-orange-200`
    if (type === 'error') return `${baseStyles} bg-red-50 border-red-200`
    if (type === 'success') return `${baseStyles} bg-green-50 border-green-200`
    return `${baseStyles} bg-blue-50 border-blue-200`
  }

  const getIcon = (type: string) => {
    if (type === 'warning') return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z'
    if (type === 'error') return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    if (type === 'success') return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Active Alerts</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
          View All
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {alerts.map((alert) => (
          <div key={alert.id} className={getAlertStyles(alert.type)}>
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                alert.type === 'warning' ? 'bg-orange-100' :
                alert.type === 'error' ? 'bg-red-100' :
                alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  alert.type === 'warning' ? 'text-orange-600' :
                  alert.type === 'error' ? 'text-red-600' :
                  alert.type === 'success' ? 'text-green-600' : 'text-blue-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(alert.type)} />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-900 truncate">{alert.title}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                    alert.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                <p className="text-xs text-slate-500 mt-2">{alert.time}</p>
              </div>

              <button className="text-slate-400 hover:text-slate-600 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PerformanceMetrics() {
  const metrics = [
    { label: 'Average Response Time', value: '245ms', change: '-12%', trend: 'down' },
    { label: 'Error Rate', value: '0.02%', change: '-5%', trend: 'down' },
    { label: 'Throughput', value: '1.2M req/min', change: '+8%', trend: 'up' },
    { label: 'Uptime', value: '99.98%', change: '+0.01%', trend: 'up' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Metrics</h3>

      <div className="grid grid-cols-2 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
            <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
            <div className="text-sm text-slate-600 mb-2">{metric.label}</div>
            <div className={`text-xs font-medium ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change} vs last week
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
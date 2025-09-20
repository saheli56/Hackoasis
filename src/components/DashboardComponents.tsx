export function CostTrendChart() {
  const data = [
    { month: 'Jan', aws: 4200, gcp: 3800, azure: 2100 },
    { month: 'Feb', aws: 4500, gcp: 4200, azure: 2300 },
    { month: 'Mar', aws: 4800, gcp: 3900, azure: 2500 },
    { month: 'Apr', aws: 4600, gcp: 4100, azure: 2400 },
    { month: 'May', aws: 4900, gcp: 4300, azure: 2600 },
    { month: 'Jun', aws: 4700, gcp: 4000, azure: 2200 }
  ]

  const maxValue = Math.max(...data.flatMap(d => [d.aws, d.gcp, d.azure]))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Cost Trends</h3>
        <div className="flex items-center space-x-4 text-sm">
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
      </div>

      <div className="h-64 flex items-end space-x-4">
        {data.map((item) => (
          <div key={item.month} className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-full flex flex-col items-center space-y-1" style={{ height: '180px' }}>
              <div
                className="w-8 bg-orange-500 rounded-t transition-all duration-500 hover:opacity-80"
                style={{ height: `${(item.aws / maxValue) * 160}px` }}
                title={`AWS: $${item.aws}`}
              ></div>
              <div
                className="w-8 bg-blue-500 rounded-t transition-all duration-500 hover:opacity-80"
                style={{ height: `${(item.gcp / maxValue) * 160}px` }}
                title={`GCP: $${item.gcp}`}
              ></div>
              <div
                className="w-8 bg-green-500 rounded-t transition-all duration-500 hover:opacity-80"
                style={{ height: `${(item.azure / maxValue) * 160}px` }}
                title={`Azure: $${item.azure}`}
              ></div>
            </div>
            <span className="text-xs font-medium text-slate-600">{item.month}</span>
          </div>
        ))}
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
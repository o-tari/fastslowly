import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const AnalyticsCharts = () => {
  const { dailyLogs, stats } = useSelector((state) => state.logs)
  const { units } = useSelector((state) => state.settings)

  // Process data for charts
  const chartData = useMemo(() => {
    const logs = Object.values(dailyLogs).filter(log => log.completed)
    if (logs.length === 0) return []

    // Get last 30 days of data
    const endDate = new Date()
    const startDate = subDays(endDate, 29)
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const log = dailyLogs[dateStr]
      
      return {
        date: format(day, 'MMM dd'),
        fullDate: dateStr,
        fastingHours: log?.fastingHours || 0,
        weight: log?.weight || null,
        hydration: log?.hydration || 0,
        mood: log?.mood || null,
        completed: log?.completed || false
      }
    })
  }, [dailyLogs])

  // Weight change data
  const weightData = useMemo(() => {
    const logs = Object.values(dailyLogs)
      .filter(log => log.completed && log.weight)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
    
    if (logs.length < 2) return []

    const firstWeight = logs[0].weight
    return logs.map(log => ({
      date: format(new Date(log.date), 'MMM dd'),
      weight: log.weight,
      change: log.weight - firstWeight,
      changePercent: ((log.weight - firstWeight) / firstWeight) * 100
    }))
  }, [dailyLogs])

  // Mood distribution
  const moodData = useMemo(() => {
    const logs = Object.values(dailyLogs).filter(log => log.completed && log.mood)
    const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    
    logs.forEach(log => {
      moodCounts[log.mood]++
    })

    return [
      { name: 'Very Poor', value: moodCounts[1], color: '#ef4444' },
      { name: 'Poor', value: moodCounts[2], color: '#f97316' },
      { name: 'Okay', value: moodCounts[3], color: '#eab308' },
      { name: 'Good', value: moodCounts[4], color: '#3b82f6' },
      { name: 'Excellent', value: moodCounts[5], color: '#22c55e' }
    ].filter(item => item.value > 0)
  }, [dailyLogs])

  // Hydration data
  const hydrationData = useMemo(() => {
    const logs = Object.values(dailyLogs).filter(log => log.completed)
    const hydrationRanges = {
      '0-2': 0,
      '3-4': 0,
      '5-6': 0,
      '7-8': 0,
      '9+': 0
    }

    logs.forEach(log => {
      const hydration = log.hydration || 0
      if (hydration <= 2) hydrationRanges['0-2']++
      else if (hydration <= 4) hydrationRanges['3-4']++
      else if (hydration <= 6) hydrationRanges['5-6']++
      else if (hydration <= 8) hydrationRanges['7-8']++
      else hydrationRanges['9+']++
    })

    return Object.entries(hydrationRanges).map(([range, count]) => ({
      range,
      count
    }))
  }, [dailyLogs])

  const getTrendIcon = (value) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Fasting Hours Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Fasting Hours Trend (Last 30 Days)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 24]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="fastingHours"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weight Change Chart */}
      {weightData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weight Change Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value, name) => [
                    `${value} ${units.weight}`,
                    name === 'weight' ? 'Weight' : 'Change'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Weight Change Summary */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Change
              </span>
              <div className="flex items-center space-x-2">
                {getTrendIcon(weightData[weightData.length - 1]?.change)}
                <span className={`font-semibold ${
                  weightData[weightData.length - 1]?.change > 0 
                    ? 'text-red-600' 
                    : weightData[weightData.length - 1]?.change < 0 
                    ? 'text-green-600' 
                    : 'text-gray-600'
                }`}>
                  {weightData[weightData.length - 1]?.change > 0 ? '+' : ''}
                  {weightData[weightData.length - 1]?.change?.toFixed(1)} {units.weight}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Distribution */}
      {moodData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mood Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hydration Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hydration Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hydrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="range" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Completion Rate */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Completion Rate
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 1]}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value) => [value ? 'Completed' : 'Not Completed', 'Status']}
              />
              <Bar 
                dataKey="completed" 
                fill="#22c55e"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts

import React, { PureComponent } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

export default function PieIndicator(props) {
  // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
  const COLORS = ["#ec9a9a", "#e63946", "#81b29a", "#a8dadc", "#457b9d", "#1d3557"]
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.9
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central">
        {value}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className="pieIndicator">
      <PieChart width={500} height={350}>
        <Pie
          data={props.data}
          cx="50%"
          cy="70%"
          height="100%"
          width="100%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value">
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        {!props.hideLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  )
}

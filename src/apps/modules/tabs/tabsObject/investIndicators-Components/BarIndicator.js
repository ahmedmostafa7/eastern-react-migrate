import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BarIndicator(props) {
  const renderLegend = () => {
    const { data } = props;

    return (
      <ul className="legendlist">
        {data.map((entry, index) => (
          <li key={`item-${index}`}>{entry.name}</li>
        ))}
      </ul>
    );
  };
  let names = props?.data.map((d) => d.name);
  console.log(props);
  // static demoUrl = "https://codesandbox.io/s/simple-bar-chart-tpz8r"

  // const renderCustomizedLabel = (props) => {
  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
    return (
      <text
        style={{ borderRadius: "50%", border: "1px solid", fontSize: "25px" }}
        x={x + width / 2}
        y={y}
        fill="#666"
        textAnchor="middle"
        dy={-6}
      >{` ${value}`}</text>
    );
    // };
  };
  return (
    <ResponsiveContainer
      id={
        props.defaultLabels
          ? "recharts-wrapperID"
          : "recharts-wrapperIDNoLabels"
      }
      width={props.defaultLabels ? "190%" : "100%"}
      height="100%"
      className="barIndicator"
    >
      <BarChart
        data={props?.data}
        margin={{
          top: 5,
          left: props.defaultLabels ? 500 : 40,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {props.noLabels ? null : props.defaultLabels ? (
          <XAxis dataKey="name" />
        ) : (
          <XAxis offset={-1} dataKey="name" dx={-60} dy={110} angle={-45} />
        )}
        {/* <Tooltip /> */}
        {/* <LabelList dataKey="count" content={renderCustomBarLabel} /> */}
        <Bar
          dataKey="عدد المعاملات"
          fill={props.color || "#8884d8"}
          label={renderCustomBarLabel}
          // activeBar={<Rectangle fill="blue" stroke="blue" />}
        />
        {props.noLabels && <Legend content={renderLegend} />}
      </BarChart>
    </ResponsiveContainer>
  );
}

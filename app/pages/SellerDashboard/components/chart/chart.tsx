"use client";

import React from "react";
import "./chart.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register all necessary ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: { date: string; count: number }[];
}

const Chart = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return <p style={{ padding: "1rem" }}>No data to display this month.</p>;
  }

  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Books Added",
        data: data.map((entry) => entry.count),
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "#4e73df",
        pointBorderColor: "#4e73df",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Books Added Per Day (This Month)",
        padding: { top: 10, bottom: 10 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Books Added",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="chartcontainer">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;

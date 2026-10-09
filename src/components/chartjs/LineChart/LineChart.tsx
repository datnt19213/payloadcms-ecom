import React from "react";
import {Line} from "react-chartjs-2";
import {data, options} from "./config";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  return (
    <Line
      data={data}
      options={options}
      className="dark:text-white dark:bg-transparent w-full h-auto"
    />
  );
};

export default LineChart;

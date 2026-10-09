import React from "react";
import {data, options} from "./config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {Bar} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  return (
    <Bar
      data={data}
      options={options}
      className="dark:text-white dark:bg-transparent w-full h-auto"
    />
  );
};

export default BarChart;

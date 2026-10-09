import {ChartData} from "../../../types";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Line Chart Analyzing",
    },
  },
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
};

export const data: ChartData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Dataset 1",
      data: [65, 59, , 22, 12, 90, 30],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "#903df9",
    },
    {
      label: "Dataset 1",
      data: [10, 55, 69, 54, 33, 20],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "#ccef32",
    },
    {
      label: "Dataset 1",
      data: [30, 78, 60, 5, 50],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "#fd09ff)",
    },
    {
      label: "Dataset 1",
      data: [15, 54, 20, 81, 36],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "#afcf25",
    },
  ],
};

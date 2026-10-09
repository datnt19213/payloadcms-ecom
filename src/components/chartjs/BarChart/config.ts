import {ChartData} from "../../../types";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Bar Chart Analyzing",
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
      data: [65, 59, , 81, 56, 55, 40],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "#903df9",
    },
    {
      label: "Dataset 1",
      data: [59, 80, 81, 56, 55, 40],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "#ccef32",
    },
    {
      label: "Dataset 1",
      data: [30, 59, 80, 56, 40],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "#fd09ff)",
    },
    {
      label: "Dataset 1",
      data: [65, 59, 80, 81, 56],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "#afcf25",
    },
  ],
};

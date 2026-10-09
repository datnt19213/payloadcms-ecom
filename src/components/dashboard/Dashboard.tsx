import React from "react";
import { Gutter, Eyebrow } from "payload/components/elements";
import { BarChart, LineChart } from "../chartjs";

const Dashboard = () => {
  return (
    <>
      <Gutter className="dark:text-white dark:bg-transparent gap-12 flex flex-col">
        <h1 className="dark:text-white dark:bg-transparent w-full py-2 border-b border-gray-700 text-left font-bold text-4xl">
          Welcome to Dasboard
        </h1>
        <div className="dark:text-white dark:bg-transparent  grid auto-cols-auto grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 transition-all duration-200 grid-flow-row gap-5">
          <div className="dark:text-white dark:bg-transparent col-span-1 min-w-52 p-3 aspect-[9:16] w-full border border-gray-100 shadow-md rounded-lg flex-col flex gap-3 hover:shadow-2xl transition-all">
            <span className="dark:text-white dark:bg-transparent font-semibold text-lg">
              Value A
            </span>
            <div className="dark:text-white dark:bg-transparent flex text-sm items-end gap-1 font-light tracking-tight">
              <span className="dark:text-white dark:bg-transparent leading-none">
                Param:
              </span>
              <span className="dark:text-white dark:bg-transparent text-green-600 leading-none text-lg">
                16
              </span>
              <span className="dark:text-white dark:bg-transparent text-green-600 leading-none">
                /100
              </span>
            </div>
          </div>
          <div className="dark:text-white dark:bg-transparent col-span-1 min-w-52 p-3 aspect-[9:16] w-full border border-gray-100 shadow-md rounded-lg flex-col flex gap-3 hover:shadow-2xl transition-all">
            <span className="dark:text-white dark:bg-transparent font-semibold text-lg">
              Value B
            </span>
            <div className="dark:text-white dark:bg-transparent flex text-sm items-end gap-1 font-light tracking-tight">
              <span className="dark:text-white dark:bg-transparent leading-none">
                Param:
              </span>
              <span className="dark:text-white dark:bg-transparent text-green-600 leading-none text-lg">
                17
              </span>
              <span className="dark:text-white dark:bg-transparent text-green-600 leading-none">
                /500
              </span>
            </div>
          </div>
          <div className="dark:text-white dark:bg-transparent col-span-1 min-w-52 p-3 aspect-[9:16] w-full border border-gray-100 shadow-md rounded-lg flex-col flex gap-3 hover:shadow-2xl transition-all">
            <span className="dark:text-white dark:bg-transparent font-semibold text-lg">
              Value C
            </span>
            <div className="dark:text-white dark:bg-transparent flex text-sm items-end gap-1 font-light tracking-tight">
              <span className="dark:text-white dark:bg-transparent leading-none">
                Param:
              </span>
              <span className="dark:text-white dark:bg-transparent text-green-600 leading-none text-lg">
                190
              </span>
              <span className="dark:text-white dark:bg-transparent text-green-600 leading-none">
                /1000
              </span>
            </div>
          </div>
          <div className="dark:text-white dark:bg-transparent col-span-1 min-w-52 p-3 aspect-[9:16] w-full border border-gray-100 shadow-md rounded-lg flex-col flex gap-3 hover:shadow-2xl transition-all">
            <span className="dark:text-white dark:bg-transparent font-semibold text-lg">
              Value C
            </span>
            <div className="dark:text-white dark:bg-transparent flex text-sm items-end gap-1 font-light tracking-tight">
              <span className="dark:text-white dark:bg-transparent leading-none">
                Param:
              </span>
              <span className="dark:text-white dark:bg-transparent text-green-600 leading-none text-lg">
                100
              </span>
              <span className="dark:text-white dark:bg-transparent text-green-600 leading-none">
                /100
              </span>
            </div>
          </div>
        </div>
        <div className="dark:text-white dark:bg-transparent bg-white grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-8 w-full">
          <div className="dark:text-white dark:bg-transparent col-span-1 aspect-video flex items-center justify-center w-full p-3 overflow-hidden rounded-xl shadow-md bg-white border-gray-100 hover:shadow-2xl transition-all">
            <LineChart />
          </div>
          <div className="dark:text-white dark:bg-transparent col-span-1 aspect-video flex items-center justify-center w-full p-3 overflow-hidden rounded-xl shadow-md bg-white border-gray-100 hover:shadow-2xl transition-all">
            <BarChart />
          </div>
        </div>
      </Gutter>
    </>
  );
};

export default Dashboard;

import React, {useState} from "react";
import {Gutter} from "payload/components/elements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {Button} from "../ui/button";

const Dashboard = () => {
  const [data, setData] = useState([]);
  function navigateCreate(): void {
    throw new Error("Function not implemented.");
  }

  function navigateUpdate(id: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Gutter className="dark:text-white dark:bg-transparent flex flex-col gap-12">
        <div className="dark:text-white dark:bg-transparent flex justify-end ">
          <Button variant="default" onClick={() => navigateCreate()}>
            New Product
          </Button>
        </div>
        <div className="dark:text-white dark:bg-transparent mx-auto w-full rounded-lg shadow-lg flex justify-center max-w-[1800px] animate-slowfade">
          <Table>
            <TableHeader>
              <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-sm md:text-lg text-center">
                  <span>No.</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-sm md:text-lg text-center">
                  <span>ID</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-sm md:text-lg text-center">
                  <span>Name</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-sm md:text-lg text-center">
                  <span>Stock</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-sm md:text-lg text-center">
                  <span>Price</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-sm md:text-lg text-center">
                  <span>Images</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-sm md:text-lg text-center">
                  <span>Description</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((product, index) => (
                  <TableRow
                    key={`p-${index}`}
                    className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8 border-t border-gray-300 cursor-pointer"
                    onClick={() => navigateUpdate(product?.id)}
                  >
                    <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium truncate flex justify-center items-center md:text-lg">
                      <span>{data.indexOf(product)}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-1 flex justify-center items-center font-medium truncate md:text-lg">
                      <span>{product?.id}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium flex justify-center items-center truncate md:text-lg">
                      <span>{product?.title}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium flex justify-center items-center truncate md:text-lg">
                      <span>{product?.inStock}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex justify-center items-center font-medium truncate md:text-lg">
                      <span>{product?.price}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-3 flex justify-center items-center font-medium truncate md:text-lg">
                      <span>{product?.images[0]?.url}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex justify-center items-center font-medium truncate md:text-lg">
                      <span>{product?.description}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="dark:text-white dark:bg-transparent col-span-12 flex justify-center items-center md:text-lg font-medium text-gray-300 min-h-8 p-5">
                  <span className="dark:text-white dark:bg-transparent italic">
                    No data available
                  </span>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Gutter>
    </>
  );
};

export default Dashboard;

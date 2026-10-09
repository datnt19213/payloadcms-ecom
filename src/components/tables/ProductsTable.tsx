import React, {useEffect, useState} from "react";
import API_ENDPOINTS from "../../utils/api_url";
import productApi from "../../hook/productApi";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {Gutter} from "payload/components/elements";
import {Button} from "../ui/button";

const ProductTables: React.FC = () => {
  const [data, setData] = useState([]);
  const [database, setDataBase] = useState([]);
  const {loading, error, getListProduct} = productApi();

  useEffect(() => {
    fetchProducts();
    getProduct();
  }, []);

  async function fetchProducts() {
    const products = await getListProduct(API_ENDPOINTS.getProducts);
    setData(products.products);
  }

  const navigateUpdate = (id) => {
    const url = `/admin/edit?id=${id}`;
    console.log("Navigating to URL:", url); // Check what URL is being generated
    window.location.href = url;
  };

  const navigateCreate = () => {
    window.location.href = "/admin/collections/products/create";
  };

  const getProduct = async () => {
    try {
      const response = await axios.get("http://localhost:9000/admin/products", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyXzAxSjFTOVQ0WjUzUVdSSzNFNTQ0S1dDSE5TIiwiZG9tYWluIjoiYWRtaW4iLCJpYXQiOjE3MjA3MjQ0OTUsImV4cCI6MTcyMDgxMDg5NX0.1q7SmlBKGhoB7_Isf092un3VKc3F6n1X1Q6O6TF8Jvw",
        },
      });
      setDataBase(response.data.products); // Assuming the response contains a products array
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  console.log(database);

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
              {database.length > 0 ? (
                database.map((product, index) => (
                  <TableRow
                    key={`p-${index}`}
                    className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8 border-t border-gray-300 cursor-pointer"
                    onClick={() => navigateUpdate(product?.id)}
                  >
                    <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium truncate flex justify-center items-center md:text-lg">
                      <span>{index + 1}</span>
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
                      {/* <span>{product?.images[0]?.url}</span> */}
                      <div className="dark:text-white dark:bg-transparent max-h-28 aspect-square overflow-hidden flex justify-center items-center">
                        <img
                          src={product?.images[0]?.url}
                          alt={product?.images[0]?.alt}
                          className="dark:text-white dark:bg-transparent h-full w-auto "
                        />
                      </div>
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
export default ProductTables;

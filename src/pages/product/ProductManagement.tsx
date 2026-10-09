import React, {useEffect, useState} from "react";
import {Gutter} from "payload/components/elements";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import {Button} from "../../components/ui/button";
import {SkeletonDynamics, SkeletonTable} from "../../components/skeleton";
import {Checkbox} from "../../components/ui/checkbox";
import {useAuth} from "payload/components/utilities";
import {NoDataAvailableTable} from "../../components/empty/Empty";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {CarouselModal, Modal} from "../../components/modal";
import {APIDelete, APIGet} from "../../api";
import {ItemLinkList} from "../../components/elements";
import {HeadingPage, UnderlineSpan} from "../../components/elements/Elements";
import {
  FilterProductComp,
  Notification,
  Paginations,
} from "../../components/particals";
import {Filter, Image} from "lucide-react";
import {LinkBtn} from "../../components/buttons";
import {ManagementContainer} from "../../components/container";
import {Obj} from "../../types";
import {formatDate2, GenerateApiFilterProduct} from "../../utils";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  email: string;
  token: string;
}

const ProductManagement = () => {
  const {user} = useAuth<User>();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [skeleton, setSkeleton] = useState(true);
  const [deletedAll, setDeleteAll] = useState<boolean>(false);
  const [isModal, setIsModal] = useState(false);
  const [isTagModal, setIsTagModal] = useState(false);
  const [isCategoryModal, setIsCategoryModal] = useState(false);
  const [isStoreModal, setIsStoreModal] = useState(false);
  const [isCarouselModal, setIsCarouselModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [dataRow, setDataRow] = useState(0);

  // #region select single product item
  const SetSelectedFnc = (id: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };
  // #endregion

  // #region product get products to render
  const getProduct = async () => {
    setSkeleton(true);
    try {
      const response = await APIGet(
        `/admin/products?limit=10&offset=${(currentPage - 1) * 10}`,
        user?.token
      );
      const products = response.data.products.map((product) => ({
        ...product,
        totalInventory: product.variants.reduce(
          (total, variant) => total + variant.inventory_quantity,
          0
        ),
        variantCount: product.variants.length,
      }));
      setTotalPage(Math.ceil(response.data.count / 10));
      setDataRow(response.data.count);
      setData(products);
      setSkeleton(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setSkeleton(false);
    }
  };
  useEffect(() => {
    getProduct();
  }, [currentPage]);

  // #endregion

  // #region product selected all when check select all
  useEffect(() => {
    const selectAllRows = () => {
      if (deletedAll && data.length > 0) {
        let arr = [];
        data.forEach((product) => arr.push(product?.id));
        setSelected(arr);
      } else {
        setSelected([]);
      }
    };

    selectAllRows();
  }, [deletedAll]);
  // #endregion

  // #region Delete selected product
  const deleteSelectedProducts = async (val): Promise<boolean> => {
    if (val.key === "NoExecute") {
      setIsModal(val.open);
      return true;
    }
    if (val.key === "Execute") {
      setIsLoad(true);
      try {
        if (deletedAll) {
          const deleteRequests = data.map((product) =>
            APIDelete("/admin/products", product?.id, user.token)
          );
          await Promise.all(deleteRequests);
          toast.success("All products deleted successfully.");
          setIsModal(val);
        } else {
          const deleteRequests = selected.map((id) =>
            APIDelete("/admin/products", id, user.token)
          );
          await Promise.all(deleteRequests);
          toast.success("Selected products deleted successfully.");
          setIsModal(val.open);
        }

        const updateDatas = data.filter((data) => !selected.includes(data.id));
        setData(updateDatas);
        setIsLoad(false);
        setIsModal(false);
        setSelected([]);
        setDeleteAll(false);
      } catch (error) {
        console.error("Failed to delete selected products", error);
        toast.error("Failed to delete selected products.");
      }
    } else {
      throw new Error("Key modal transering is not accepted.");
    }
    return true;
  };

  // #endregion

  const GetOutputFilter = async (output?: any) => {
    const apiString = GenerateApiFilterProduct(output);
    setSkeleton(true);
    try {
      const response = await APIGet(
        `${apiString}&limit=10&offset=${(currentPage - 1) * 10}`,
        user?.token
      );
      const products = response.data.products.map((product) => ({
        ...product,
        totalInventory: product.variants.reduce(
          (total, variant) => total + variant.inventory_quantity,
          0
        ),
        variantCount: product.variants.length,
      }));
      setTotalPage(Math.ceil(response.data.count / 10));
      setDataRow(response.data.count);
      setData(products);
      setSkeleton(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setSkeleton(false);
    }
  };

  // #region handle modal popup data
  const handleTagModal = (val: Obj) => {
    if (val.key === "NoExecute") {
      setIsTagModal(val.open);
      return;
    }
    setIsTagModal(true);
  };
  const handleCategoriesModal = (val: Obj) => {
    if (val.key === "NoExecute") {
      setIsCategoryModal(val.open);
      return;
    }
    setIsCategoryModal(true);
  };
  const handleStoresModal = (val: Obj) => {
    if (val.key === "NoExecute") {
      setIsStoreModal(val.open);
      return;
    }
    setIsStoreModal(true);
  };
  const handleCarouselModal = (val: Obj) => {
    if (val.key === "NoExecute") {
      setIsCarouselModal(val.open);
      return;
    }
    setIsCarouselModal(true);
  };
  // #endregion

  // #region pagination page number setting
  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };
  // #endregion

  return (
    <ManagementContainer
      title="Product Management"
      maxWidth={true}
      besideElement={
        <span className="text-xl font-semibold tracking-tight">
          {dataRow}&nbsp;&nbsp;products
        </span>
      }
    >
      <Modal
        title="Are you sure to delete?"
        button2="Cancel"
        button="Delete"
        open={isModal}
        handle={deleteSelectedProducts}
        isLoad={isLoad}
      />
      {/* tags list in popup */}
      <Modal
        title="All Tags"
        button2="Cancel"
        open={isTagModal}
        handle={handleTagModal}
        size="lg"
      >
        <div className="flex flex-col w-full relative justify-start">
          <Table className="min-w-fit">
            <TableHeader>
              <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-6 font-semibold text-base text-center">
                  <span>Tags value</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-6 font-semibold text-base text-center">
                  <span>Create at</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags && tags?.length > 0 ? (
                tags?.map((tag, i) => (
                  <TableRow
                    key={i}
                    className="grid grid-cols-12 min-h-12 hover:bg-gray-50 transition-all"
                  >
                    <TableCell className="dark:text-white dark:bg-transparent col-span-6 font-medium flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-2 truncate px-3 py-1.5">
                        {tag?.value && tag?.value}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-6 font-medium flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-2 truncate px-3 py-1.5">
                        {tag?.created_at && formatDate2(tag?.created_at)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NoDataAvailableTable />
              )}
            </TableBody>
          </Table>
        </div>
      </Modal>
      {/* categories list in popup */}
      <Modal
        title="All Categories"
        button2="Cancel"
        open={isCategoryModal}
        handle={handleCategoriesModal}
        size="lg"
      >
        <div className="flex flex-col w-full relative justify-start">
          <Table className="min-w-fit">
            <TableHeader>
              <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-6 font-semibold text-base text-center">
                  <span>Categories name</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-6 font-semibold text-base text-center">
                  <span>Create at</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories && categories?.length > 0 ? (
                categories?.map((category, i) => (
                  <TableRow
                    key={i}
                    className="grid grid-cols-12 min-h-12 hover:bg-gray-50 transition-all"
                  >
                    <TableCell className="dark:text-white dark:bg-transparent col-span-6 font-medium flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-2 truncate px-3 py-1.5">
                        {category?.name && category?.name}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-6 font-medium flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-2 truncate px-3 py-1.5">
                        {category?.created_at &&
                          formatDate2(category?.created_at)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NoDataAvailableTable />
              )}
            </TableBody>
          </Table>
        </div>
      </Modal>
      {/* stores list in popup */}
      <Modal
        title="All Stores"
        button2="Cancel"
        open={isStoreModal}
        handle={handleStoresModal}
        size="lg"
      >
        <div className="flex flex-col w-full relative justify-start">
          <Table className="min-w-fit">
            <TableHeader>
              <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                  <span>Stores name</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                  <span>Stores name</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                  <span>Create at</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores && stores?.length > 0 ? (
                stores?.map((store, i) => (
                  <TableRow
                    key={i}
                    className="grid grid-cols-12 min-h-12 hover:bg-gray-50 transition-all"
                  >
                    <TableCell className="dark:text-white dark:bg-transparent col-span-4 font-medium flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-2 truncate px-3 py-1.5">
                        {store?.name && store?.name}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-4 font-medium flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-2 truncate px-3 py-1.5">
                        {store?.description && store?.description}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-4 font-medium flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-2 truncate px-3 py-1.5">
                        {store?.created_at && formatDate2(store?.created_at)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NoDataAvailableTable />
              )}
            </TableBody>
          </Table>
        </div>
      </Modal>
      {/* images list carousel popup */}
      <CarouselModal
        open={isCarouselModal}
        handle={handleCarouselModal}
        title={"Images"}
        images={carousel}
      />
      {/* features interact to product list */}
      <div className="mb-12 mx-auto w-full min-w-[900px]">
        <div className="dark:text-white dark:bg-transparent w-full flex justify-between">
          <div className="dark:text-white dark:bg-transparent flex justify-start items-center gap-5">
            <LinkBtn link={`/admin/products/create`} variant="default">
              New Product
            </LinkBtn>
          </div>
          <div className="dark:text-white dark:bg-transparent flex justify-end items-center gap-5">
            {(selected.length > 0 || deletedAll) && (
              <Button
                variant="default"
                className="dark:text-white dark:bg-transparent bg-red-600 animate-fade"
                onClick={() => setIsModal(true)}
              >
                Delete all selected
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setSelected([]), setDeleteAll(false);
              }}
            >
              Unselect all
            </Button>
            <span className="dark:text-white dark:bg-transparent font-semibold tracking-tight text-base">
              <span className="text-orange-500">{selected.length}</span>
              &nbsp;rows selected
            </span>
            <Button
              variant="ghost"
              className="ml-7 justify-between flex items-center text-base gap-3"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <Filter strokeWidth={1.5} size={20} />
            </Button>
          </div>
        </div>
        <FilterProductComp
          showFilter={showFilter}
          outputFnc={GetOutputFilter}
        />
      </div>
      {/* product list */}
      <div className="dark:text-white dark:bg-transparent w-full overflow-x-scroll p-8 scrollbar-thin bg-transparent">
        <div className="dark:text-white dark:bg-transparent mx-auto w-full rounded-lg shadow-lg flex justify-center max-w-[2156px] animate-slowfade min-w-[900px]">
          <Table>
            <TableHeader>
              <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center !px-0">
                  <Checkbox
                    id="delete-all-cb"
                    checked={deletedAll}
                    onCheckedChange={(e) =>
                      setDeleteAll((prevDeletedAll) => !prevDeletedAll)
                    }
                  />
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Name</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Stock</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center">
                  <span>Images</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Category</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Tags</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Stores</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                <>
                  {skeleton ? (
                    <SkeletonDynamics
                      layout="table-row"
                      columnCount={1}
                      count={5}
                      itemClassName="!h-4 w-full rounded-full"
                      rowClassName="p-3 w-full flex justify-center items-center"
                    />
                  ) : (
                    data.map((product, index) => (
                      <TableRow
                        key={`p-${index}`}
                        className={`grid grid-cols-12 min-h-12 cursor-default `}
                      >
                        <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base !px-0">
                          <Checkbox
                            checked={selected.includes(product?.id.toString())}
                            onCheckedChange={() =>
                              SetSelectedFnc(product?.id.toString())
                            }
                          />
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium flex justify-start items-center text-base px-5">
                          <LinkBtn
                            variant="none"
                            size="none"
                            link={`/admin/products/edit/${product?.id}`}
                          >
                            <span className="dark:text-white dark:bg-transparent truncate cursor-pointer relative before:absolute hover:before:w-full before:w-0 before:content[''] before:bg-gray-900 before:h-0.5 before:bottom-0 before:left-0 before:transition-all before:duration-500">
                              {product?.title}
                            </span>
                          </LinkBtn>
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium flex justify-center items-center text-base px-5">
                          <span
                            title={`${product?.totalInventory} in stock for ${product?.variantCount} variant(s)`}
                            className="dark:text-white dark:bg-transparent truncate"
                          >
                            {`${product?.totalInventory} in stock for ${product?.variantCount} variant(s)`}
                          </span>
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-1 flex justify-center items-center font-medium text-base px-5">
                          <div className="dark:text-white dark:bg-transparent max-h-16 aspect-square overflow-hidden flex justify-center items-center">
                            {product?.images.length > 0 ? (
                              <img
                                onClick={() => {
                                  setCarousel(product?.images);
                                  setIsCarouselModal(true);
                                }}
                                src={product?.images[0]?.url}
                                alt={product?.images[0]?.alt}
                                className="dark:text-white dark:bg-transparent h-full w-auto cursor-pointer"
                              />
                            ) : (
                              <Image
                                strokeWidth={1.2}
                                className="h-full w-auto"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex justify-center items-center font-medium text-base px-5">
                          {product?.categories &&
                          product?.categories?.length > 0 ? (
                            <UnderlineSpan
                              onClick={() => {
                                setCategories(product?.categories);
                                setIsCategoryModal(true);
                              }}
                            >
                              {`${product?.categories?.length} categories`}
                            </UnderlineSpan>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex justify-center items-center font-medium text-base px-5">
                          {product?.tags && product?.tags?.length > 0 ? (
                            <UnderlineSpan
                              onClick={() => {
                                setTags(product?.tags);
                                setIsTagModal(true);
                              }}
                            >
                              {`${product?.tags?.length} tags`}
                            </UnderlineSpan>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex justify-center items-center font-medium text-base px-5">
                          {product?.sales_channels &&
                          product?.sales_channels?.length > 0 ? (
                            <UnderlineSpan
                              onClick={() => {
                                setStores(product?.sales_channels);
                                setIsStoreModal(true);
                              }}
                            >
                              {`${product?.sales_channels?.length} stores`}
                            </UnderlineSpan>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              ) : skeleton ? (
                <SkeletonDynamics
                  layout="table-row"
                  columnCount={1}
                  count={5}
                  itemClassName="!h-4 w-full rounded-full"
                  rowClassName="p-3 w-full flex justify-center items-center"
                />
              ) : (
                <NoDataAvailableTable />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Paginations
        totalPages={totalPage}
        currentPage={currentPage}
        onPageChange={handlePagination}
      />
      <ToastContainer position="top-right" />
    </ManagementContainer>
  );
};

export default ProductManagement;

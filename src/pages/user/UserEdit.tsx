import React, {useEffect, useState} from "react";
import API_ENDPOINTS from "../../utils/api_url";
import useApi from "../../hook/userApi";
import {Gutter} from "payload/components/elements";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {Button} from "../../components/ui/button";

const UserEdit: React.FC = () => {
  const [userData, setUserData] = useState([]);
  const [show, setShow] = useState(false);
  const [action, setAction] = useState("add");
  const {loading, error, getListUser} = useApi();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getListUser(API_ENDPOINTS.getUsers);
      setUserData(data.users);
    };
    fetchUser();
  }, []);
  const navigateCreate = () => {
    window.location.href = "/admin/collections/users/create";
  };
  const navigateUpdate = (id: any) => {
    window.location.href = "/admin/collections/users/update";
  };

  return (
    <>
      <Gutter className="dark:text-white dark:bg-transparent flex flex-col gap-12 py-12">
        <div className="dark:text-white dark:bg-transparent flex justify-end ">
          <Button variant="default" onClick={() => navigateCreate()}>
            New User
          </Button>
        </div>
        <div className="dark:text-white dark:bg-transparent mx-auto w-full rounded-lg shadow-lg flex justify-center max-w-[1800px]">
          <Table>
            <TableHeader>
              <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-sm md:text-lg text-center">
                  <span>No.</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-sm md:text-lg text-center">
                  <span>ID</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-sm md:text-lg text-center">
                  <span>First Name</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-sm md:text-lg text-center">
                  <span>Last Name</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-sm md:text-lg text-center">
                  <span>Email</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-sm md:text-lg text-center">
                  <span>Role</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.length > 0 ? (
                userData.map((data, index) => (
                  <TableRow
                    key={`u-${index}`}
                    className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8 border-t border-gray-300 cursor-pointer"
                    onClick={() => navigateUpdate(data?.id)}
                  >
                    <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium truncate flex justify-center items-center md:text-lg">
                      <span>{userData?.indexOf(data)}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex justify-center items-center font-medium truncate md:text-lg">
                      <span>{data?.id}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium flex justify-center items-center truncate md:text-lg">
                      <span>{data?.first_name}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium flex justify-center items-center truncate md:text-lg">
                      <span>{data?.last_name}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-3 flex justify-center items-center font-medium truncate md:text-lg">
                      <span>{data?.email}</span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex justify-center items-center font-medium truncate md:text-lg">
                      <span>{data?.role}</span>
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
export default UserEdit;

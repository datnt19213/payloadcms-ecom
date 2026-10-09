import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {Gutter} from "payload/components/elements";
import Default from "payload/dist/admin/components/templates/Default";
import type {AdminViewComponent} from "payload/config";

import {useStepNav} from "payload/dist/admin/components/elements/StepNav";
import {useConfig} from "payload/components/utilities";
import {convertToSlug, getParams} from "../../utils";
import {HeadingPage} from "../../components/elements/Elements";
import {FlexRowContainer, GridCol2} from "../../components/container";
import {
  RelationshipMultiField,
  TextField,
  TextInactiveField,
} from "../../components/fields";
import {Editor} from "../../components/Editor";
import {Button} from "../../components/ui/button";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryEdit: AdminViewComponent = ({canAccessAdmin, user}) => {
  // #region Authorize Permissions
  const {
    routes: {admin: adminRoute},
  } = useConfig();

  const isUserAuthorized = user?.roles === "admin" || user?.roles === "editor";

  if (!user || !canAccessAdmin || !isUserAuthorized) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  // #endregion

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setSlug(convertToSlug(name));
  }, [name]);

  const setNameFnc = (val: string) => {
    setName(val);
  };
  const setSlugFnc = (val: string) => {
    setSlug(val);
  };

  const setDescriptionFnc = (val: string) => {
    setDescription(val);
  };
  const setCategoriesFnc = (val: any[]) => {
    setCategories(val);
  };

  const CreateFnc = () => {
    toast.success("Category created successfully");
    toast.success("Category created failed");
  };

  return (
    <>
      <Default>
        <Gutter>
          <ToastContainer position="top-right" />
          <HeadingPage>Categories Management</HeadingPage>
          <FlexRowContainer>
            <Button type="button" onClick={() => CreateFnc()}>
              Save
            </Button>
          </FlexRowContainer>
          <GridCol2>
            <TextField
              className="dark:text-white dark:bg-transparent col-span-1"
              title="Name"
              data=""
              onChange={setNameFnc}
            />
            <TextInactiveField
              className="dark:text-white dark:bg-transparent col-span-1"
              title="Slug"
              data={slug}
              onChange={setSlugFnc}
              disabled={true}
            />
            <div className="dark:text-white dark:bg-transparent col-span-1 lg:col-span-2 flex flex-col">
              <Editor onChange={setDescriptionFnc} title="Description" />
              <RelationshipMultiField onChange={setCategoriesFnc} />
            </div>
          </GridCol2>
        </Gutter>
      </Default>
    </>
  );
};

export default CategoryEdit;

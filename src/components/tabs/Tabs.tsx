import React, {ClassAttributes, FC, HTMLAttributes, ReactNode} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {Label} from "../ui/label";

interface TabComponent {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  tabHeader: ReactNode;
  tabContent: ReactNode;
  tabHeaderClassName?: string;
  outsideTopHeaderElement?: ReactNode;
  defaultValue?: any;
  title?: string;
  titleClassName?: string;
  isTabList?: boolean;
}

/**
 * Required component TabsTrigger to headerTab, TabsContent to contentTab
 *
 * @param  - 1. `children`: Any child components or elements that are passed to the `TabComp`
 * component.
 * @returns The TabComp component is being returned. It consists of a div with a className, a Label
 * component with a title, and Tabs component with TabsList, TabsTrigger, and TabsContent components
 * inside it.
 */
const TabComp: FC<TabComponent> = ({
  children,
  className,
  containerClassName,
  tabHeader,
  tabContent,
  tabHeaderClassName,
  defaultValue,
  titleClassName,
  outsideTopHeaderElement,
  title = "",
  isTabList = true,
}) => {
  return (
    <div className={className}>
      <Label className={`${titleClassName}`}>{title}</Label>
      {outsideTopHeaderElement}
      <Tabs defaultValue={defaultValue} className={`${containerClassName}`}>
        {tabHeader && (
          <TabsList className={`grid w-full ${tabHeaderClassName}`}>
            {tabHeader}
          </TabsList>
        )}
        {tabContent}
      </Tabs>
      {children}
    </div>
  );
};

export default TabComp;

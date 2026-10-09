import {
  ThemeProvider,
  useTheme,
} from "payload/dist/admin/components/utilities/Theme";
import React, {FC, ReactNode, useEffect} from "react";

const PayloadTheme: FC<{children: ReactNode}> = ({children}) => {
  const {setTheme, theme} = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [theme]);

  return <ThemeProvider>{children}</ThemeProvider>;
};

export default PayloadTheme;

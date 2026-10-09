import React from "react";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
} from "@novu/notification-center";

export const Header = () => {
  return (
    <>
      <NovuProvider
        subscriberId={"6698b985d252266aca5ff1b0"}
        applicationIdentifier={"ErIE3JS96Z7_"}
        backendUrl={"https://novu-api.dev-tn.com"}
      >
        <PopoverNotificationCenter
          colorScheme={"light"}
          position="top-end"
          offset={10}
        >
          {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
        </PopoverNotificationCenter>
      </NovuProvider>
    </>
  );
};

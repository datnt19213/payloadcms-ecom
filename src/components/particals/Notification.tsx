import React, {FC} from "react";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
} from "@novu/notification-center";
import {Gutter} from "payload/components/elements";
import {Button} from "../ui/button";

export const Notification = () => {
  return (
    <Gutter className="flex justify-end mb-3">
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
          {({unseenCount}) => (
            <Button variant="ghost" size="icon">
              <NotificationBell unseenCount={unseenCount} />
            </Button>
          )}
        </PopoverNotificationCenter>
      </NovuProvider>
    </Gutter>
  );
};

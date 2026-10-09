import React, {FC} from "react";
import {Button} from "../ui/button";
import {Loader2} from "lucide-react";

/* The `interface ActionButton` is defining the structure of the props that the `ActionButton`
component expects to receive. Here's a breakdown of each property in the interface: */
interface ActionButton {
  actionText?: string;
  labelText?: string;
  className?: string;
  loading: boolean;
  size?: "default" | "icon" | "sm" | "lg";
  handleClick?: () => void;
}

/**
 * The `ActionButton` component is a React functional component that renders a button with loading
 * state and customizable text and styling.
 * @param  - 1. `loading`: A boolean indicating whether the button is in a loading state.
 * @returns The `ActionButton` component is being returned. It is a functional component that
 * conditionally renders a button with either a loading spinner and text or a specified label text
 * based on the `loading` prop. The button triggers the `handleClick` function when clicked.
 */
export const ActionButton: FC<ActionButton> = ({
  loading = false,
  actionText = "Saving...",
  className = "mt-7 flex justify-center items-center",
  handleClick,
  size = "default",
  labelText = "Save",
  ...props
}) => {
  function eventClick(): void {
    handleClick();
  }

  return (
    <Button
      type="button"
      disabled={loading}
      size={`${size}`}
      className={`${className} ${loading && "pointer-events-none select-none"}`}
      onClick={() => eventClick()}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 strokeWidth={1.5} size={16} className="animate-spin" />
          <span>{actionText}...</span>
        </div>
      ) : (
        labelText
      )}
    </Button>
  );
};

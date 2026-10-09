import {Mark, mergeAttributes} from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Mark.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
      sizes: [
        "2px",
        "4px",
        "6px",
        "8px",
        "10px",
        "12px",
        "14px",
        "16px",
        "18px",
        "20px",
        "24px",
        "26px",
        "28px",
        "30px",
        "32px",
        "34px",
        "36px",
        "38px",
        "40px",
        "42px",
        "44px",
        "46px",
        "48px",
        "50px",
        "52px",
        "54px",
        "56px",
        "58px",
        "60px",
        "62px",
        "64px",
        "68px",
        "70px",
        "80px",
        "96px",
      ],
    };
  },

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.size) {
            return {};
          }

          return {
            style: `font-size: ${attributes.size}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        style: "font-size",
      },
    ];
  },

  renderHTML({HTMLAttributes}) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({commands}) => {
          return commands.setMark(this.name, {size});
        },
      unsetFontSize:
        () =>
        ({commands}) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

import React, {useCallback, useEffect, useRef, useState} from "react";
import classNames from "classnames";
import {Editor} from "@tiptap/react";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiCodeSSlashLine,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiCodeBoxLine,
  RiLink,
  RiLinkUnlink,
  RiDoubleQuotesL,
  RiSeparator,
  RiTextWrap,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiUnderline,
  RiSubscript,
  RiSuperscript,
} from "react-icons/ri";
import {
  IconColumnInsertLeft,
  IconColumnInsertRight,
  IconColumnRemove,
  IconLayoutBoardSplit,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconRowRemove,
  IconSquare,
  IconSquarePlus2,
  IconTableColumn,
  IconTableFilled,
  IconTableRow,
} from "@tabler/icons-react";
import {setLink} from "./helper";
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  ChevronDown,
  CircleOff,
  Code,
  Dot,
  Ellipsis,
  Grid2X2,
  Grid2x2X,
  Grid3X3,
  Heading,
  Highlighter,
  HighlighterIcon,
  ImageIcon,
  List,
  SquareArrowDownLeft,
  SquareArrowDownRight,
  SquareArrowLeft,
  SquareArrowRight,
  Superscript,
  TableCellsMerge,
  TableCellsSplit,
  TableProperties,
  Tally5,
  Youtube,
} from "lucide-react";
import {Input} from "../ui/input";
import {TitleHover} from "../hover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {FlexColContainer, FlexRowContainer} from "../container";
import {FontSizes} from "../../common/data";

type ToolbarProps = {
  editor: Editor;
};

function Toolbar({editor}: ToolbarProps) {
  const isCursorOverLink = editor.getAttributes("link").href;

  const [isHighlight, setIsHighLight] = useState(false);
  const [isTextDecoration, setTextDecoration] = useState(false);
  const [isHeading, setHeading] = useState(false);
  const [isCode, setCode] = useState(false);
  const [isList, setList] = useState(false);
  const [isScript, setScript] = useState(false);
  const [isMore, setMore] = useState(false);
  const [isTable, setTable] = useState(false);
  const [isTextAlign, setTextAlign] = useState(false);
  const [isTextColor, setTextColor] = useState(false);
  const [isYoutube, setYoutube] = React.useState(false);
  const [isFontSize, setFSize] = React.useState(false);
  const [height, setHeight] = React.useState(480);
  const [width, setWidth] = React.useState(640);
  const [fontSize, setFontSize] = React.useState("12");

  // #region useRefs outside click event
  const ref = useRef(null);
  const textDecoRef = useRef(null);
  const headingRef = useRef(null);
  const codeRef = useRef(null);
  const listRef = useRef(null);
  const scriptRef = useRef(null);
  const moreRef = useRef(null);
  const tableRef = useRef(null);
  const textAlignRef = useRef(null);
  const textColorRef = useRef(null);
  const fontSizeRef = useRef(null);

  const handleClickFontSizeOutside = (event) => {
    if (fontSizeRef.current && !fontSizeRef.current.contains(event.target)) {
      setFSize(false);
    }
  };
  const handleClickTextColorOutside = (event) => {
    if (textColorRef.current && !textColorRef.current.contains(event.target)) {
      setTextColor(false);
    }
  };
  const handleClickTextAlignOutside = (event) => {
    if (textAlignRef.current && !textAlignRef.current.contains(event.target)) {
      setTextAlign(false);
    }
  };
  const handleClickScriptOutside = (event) => {
    if (scriptRef.current && !scriptRef.current.contains(event.target)) {
      setScript(false);
    }
  };
  const handleClickMoreOutside = (event) => {
    if (moreRef.current && !moreRef.current.contains(event.target)) {
      setMore(false);
    }
  };
  const handleClickTableOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setTable(false);
    }
  };
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsHighLight(false);
    }
  };
  const handleClickTextDecoOutside = (event) => {
    if (textDecoRef.current && !textDecoRef.current.contains(event.target)) {
      setTextDecoration(false);
    }
  };
  const handleClickHeadingOutside = (event) => {
    if (headingRef.current && !headingRef.current.contains(event.target)) {
      setHeading(false);
    }
  };
  const handleClickCodeOutside = (event) => {
    if (codeRef.current && !codeRef.current.contains(event.target)) {
      setCode(false);
    }
  };
  const handleClickListOutside = (event) => {
    if (listRef.current && !listRef.current.contains(event.target)) {
      setList(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickTextDecoOutside);
    document.addEventListener("mousedown", handleClickHeadingOutside);
    document.addEventListener("mousedown", handleClickCodeOutside);
    document.addEventListener("mousedown", handleClickListOutside);
    document.addEventListener("mousedown", handleClickScriptOutside);
    document.addEventListener("mousedown", handleClickMoreOutside);
    document.addEventListener("mousedown", handleClickTableOutside);
    document.addEventListener("mousedown", handleClickTextColorOutside);
    document.addEventListener("mousedown", handleClickTextAlignOutside);
    document.addEventListener("mousedown", handleClickFontSizeOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.addEventListener("mousedown", handleClickTextDecoOutside);
      document.addEventListener("mousedown", handleClickHeadingOutside);
      document.addEventListener("mousedown", handleClickCodeOutside);
      document.addEventListener("mousedown", handleClickListOutside);
      document.addEventListener("mousedown", handleClickScriptOutside);
      document.addEventListener("mousedown", handleClickMoreOutside);
      document.addEventListener("mousedown", handleClickTableOutside);
      document.addEventListener("mousedown", handleClickTextColorOutside);
      document.addEventListener("mousedown", handleClickTextAlignOutside);
      document.addEventListener("mousedown", handleClickFontSizeOutside);
    };
  }, []);
  // #endregion

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Convert image to base64 (or handle file upload to your server here)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        if (typeof base64Image === "string") {
          editor?.chain().focus().setImage({src: base64Image}).run();
        }
      };
      reader.readAsDataURL(file);
    },
    [editor]
  );

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(String(width), 10)) || 640,
        height: Math.max(180, parseInt(String(height), 10)) || 480,
      });
    }
    setYoutube(false);
  };

  const setColorTextFromInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value) {
      editor.chain().focus().setColor(event.target.value).run();
    }
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    if (value.length > 3) {
      setFontSize(value.slice(0, -1));
      return;
    }
    setFontSize(value);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;

    if (event.key === "Enter") {
      if (!/^\d+$/.test(value)) {
        setFontSize("12");
        return;
      }
      const fontSize = Number(value);
      if (fontSize > 0) {
        setFontSize(value);
      }
      const fontSizeValue = `${value}px`;
      editor.chain().focus().setFontSize(fontSizeValue).run();
    }
  };

  return (
    <div className="dark:text-white dark:bg-transparent flex flex-wrap gap-2 p-3 items-center rounded-md bg-gray-100">
      <Button
        variant="outline"
        size="icon"
        className={` relative group p-2 hover:bg-slate-300`}
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        <RiFormatClear size={14} />
        <TitleHover
          className="!left-full mt-3"
          title="Clear Format"
        ></TitleHover>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`relative group p-2 hover:bg-slate-300`}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <RiArrowGoBackLine size={14} />
        <TitleHover className="!left-full mt-3" title="Undo"></TitleHover>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`relative group p-2 hover:bg-slate-300`}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <RiArrowGoForwardLine size={14} />
        <TitleHover className="!left-full mt-3" title="Redo"></TitleHover>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="dark:text-white dark:bg-transparent aspect-square cursor-pointer hover:bg-slate-300 transition-all"
      >
        <Label htmlFor="picture-editor" className="cursor-pointer">
          <ImageIcon size={14} strokeWidth={1.5} className="cursor-pointer" />
        </Label>
        <input
          className="dark:text-white dark:bg-transparent hidden"
          id="picture-editor"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`!aspect-auto !w-fit pr-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
      >
        <Input
          type="number"
          onChange={handleFontSizeChange}
          onKeyDown={handleKeyDown}
          value={fontSize}
          data-testid="setFontSize"
          className="focus:outline-none outline-none w-20 h-10 bg-transparent border-l-0 border-t-0 border-b-0 border-r focus:ring-0"
        />

        <ChevronDown size={12} onClick={() => setFSize((prev) => !prev)} />

        {isFontSize && (
          <FlexRowContainer
            ref={fontSizeRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            {FontSizes.map((fontSize) => (
              <Button
                variant="outline"
                size="icon"
                className={`relative group p-2 hover:bg-gray-300 flex justify-center items-center`}
                data-testid="setGreen"
                onClick={() =>
                  editor.chain().focus().setFontSize(`${fontSize}px`).run()
                }
              >
                {fontSize}
              </Button>
            ))}
          </FlexRowContainer>
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`!aspect-auto !w-fit px-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
        onClick={() => setTextDecoration((prev) => !prev)}
      >
        <RiBold size={14} />

        <ChevronDown size={12} />

        {isTextDecoration && (
          <FlexRowContainer
            ref={textDecoRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("bold") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <RiBold size={14} />
              <TitleHover className="!left-full mt-3" title="Bold">
                <span>Win/Linux: Control + B</span>
                <span>MacOS: Cmd + B</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("italic") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <RiItalic size={14} />
              <TitleHover className="!left-full mt-3" title="Italic">
                <span>Win/Linux: Control + I</span>
                <span>MacOS: Cmd + I</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("underline") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <RiUnderline size={14} />
              <TitleHover className="!left-full mt-3" title="Underline">
                <span>Win/Linux: Control + U</span>
                <span>MacOS: Cmd + U</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("strike") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <RiStrikethrough size={14} />
              <TitleHover className="!left-full mt-3" title="Strikethrough">
                <span>Win/Linux: Control + Shift + S</span>
                <span>MacOS: Cmd + Shift + S</span>
              </TitleHover>
            </Button>
          </FlexRowContainer>
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`!aspect-auto !w-fit px-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
        onClick={() => setTextAlign((prev) => !prev)}
      >
        <AlignCenter size={14} />

        <ChevronDown size={12} />

        {isTextAlign && (
          <FlexRowContainer
            ref={textAlignRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive({textAlign: "left"})
                  ? "bg-gray-900 text-white"
                  : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft size={14} />
              <TitleHover className="!left-full mt-3" title="Left">
                <span>Win/Linux: Control + Shift + L</span>
                <span>MacOS: Cmd + Shift + L</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive({textAlign: "center"})
                  ? "bg-gray-900 text-white"
                  : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenter size={14} />
              <TitleHover className="!left-full mt-3" title="Center">
                <span>Win/Linux: Control + Shift + E</span>
                <span>MacOS: Cmd + Shift + E</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("underline") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight size={14} />
              <TitleHover className="!left-full mt-3" title="Right">
                <span>Win/Linux: Control + Shift + R</span>
                <span>MacOS: Cmd + Shift + R</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("underline") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignJustify size={14} />
              <TitleHover className="!left-full mt-3" title="Justify">
                <span>Win/Linux: Control + Shift + J</span>
                <span>MacOS: Cmd + Shift + J</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("underline") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().unsetTextAlign().run()}
            >
              <Tally5 size={14} className="transform rotate-90" />
              <TitleHover
                className="!left-full mt-3"
                title="Unset"
              ></TitleHover>
            </Button>
          </FlexRowContainer>
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`!aspect-auto !w-fit pr-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
        onClick={() => setTextColor((prev) => !prev)}
      >
        <Input
          type="color"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setColorTextFromInput(event)
          }
          value={editor.getAttributes("textStyle").color || "#111827"}
          data-testid="setColor"
          className="focus:outline-none outline-none w-20 h-10 bg-transparent border-l-0 border-t-0 border-b-0 border-r bord ring-0"
        />

        <ChevronDown size={12} />

        {isTextColor && (
          <FlexRowContainer
            ref={textColorRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("textStyle", {color: "#00DFA2"})
                  ? "ring-gray-900 text-white"
                  : ""
              } relative group ring-2 p-2 bg-[#00DFA2] hover:bg-[#00DFA2] flex justify-center items-center`}
              data-testid="setGreen"
              onClick={() => editor.chain().focus().setColor("#00DFA2").run()}
            >
              <span className="w-5 h-5" />
              <TitleHover
                className="!left-full mt-3"
                title="Green"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("textStyle", {color: "#0079FF"})
                  ? "ring-gray-900 text-white"
                  : ""
              } relative group ring-2 p-2 bg-[#0079FF] hover:bg-[#0079FF] flex justify-center items-center`}
              data-testid="setBlue"
              onClick={() => editor.chain().focus().setColor("#0079FF").run()}
            >
              <span className="w-5 h-5" />
              <TitleHover className="!left-full mt-3" title="Blue"></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("textStyle", {color: "#FF0060"})
                  ? "ring-gray-900 text-white"
                  : ""
              } relative group ring-2 p-2 bg-[#FF0060] hover:bg-[#FF0060] flex justify-center items-center`}
              data-testid="setRed"
              onClick={() => editor.chain().focus().setColor("#FF0060").run()}
            >
              <span className="w-5 h-5" />
              <TitleHover className="!left-full mt-3" title="Red"></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("textStyle", {color: "#F6FA70"})
                  ? "ring-gray-900 text-white"
                  : ""
              } relative group ring-2 p-2 bg-[#F6FA70] hover:bg-[#F6FA70] flex justify-center items-center`}
              data-testid="setYellow"
              onClick={() => editor.chain().focus().setColor("#F6FA70").run()}
            >
              <span className="w-5 h-5" />
              <TitleHover
                className="!left-full mt-3"
                title="Yellow"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("textStyle", {color: "#9376E0"})
                  ? "ring-gray-900 text-white"
                  : ""
              } relative group ring-2 p-2 bg-[#9376E0] hover:bg-[#9376E0] flex justify-center items-center`}
              data-testid="setPurple"
              onClick={() => editor.chain().focus().setColor("#9376E0").run()}
            >
              <span className="w-5 h-5" />
              <TitleHover
                className="!left-full mt-3"
                title="Purple"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group ring-2 p-2 hover:bg-gray-300 flex justify-center items-center`}
              data-testid="setPurple"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              <CircleOff size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full mt-3"
                title="Unset"
              ></TitleHover>
            </Button>
          </FlexRowContainer>
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`!aspect-auto !w-fit px-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
        onClick={() => setHeading((prev) => !prev)}
      >
        <Heading size={14} strokeWidth={1.5} />

        <ChevronDown size={12} />

        {isHeading && (
          <FlexRowContainer
            ref={headingRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("heading", {level: 1})
                  ? "bg-gray-900 text-white"
                  : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() =>
                editor.chain().focus().toggleHeading({level: 1}).run()
              }
            >
              <RiH1 size={14} />
              <TitleHover className="!left-full mt-3" title="Heading 1">
                <span>Win/Linux: Control + Alt + 1</span>
                <span>MacOS: Cmd + Alt + 1</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("heading", {level: 2})
                  ? "bg-gray-900 text-white"
                  : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() =>
                editor.chain().focus().toggleHeading({level: 2}).run()
              }
            >
              <RiH2 size={14} />
              <TitleHover className="!left-full mt-3" title="Heading 2">
                <span>Win/Linux: Control + Alt + 2</span>
                <span>MacOS: Cmd + Alt + 2</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("heading", {level: 3})
                  ? "bg-gray-900 text-white"
                  : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() =>
                editor.chain().focus().toggleHeading({level: 3}).run()
              }
            >
              <RiH3 size={14} />
              <TitleHover className="!left-full mt-3" title="Heading 3">
                <span>Win/Linux: Control + Alt + 3</span>
                <span>MacOS: Cmd + Alt + 3</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("heading", {level: 4})
                  ? "bg-gray-900 text-white"
                  : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() =>
                editor.chain().focus().toggleHeading({level: 4}).run()
              }
            >
              <RiH4 size={14} />
              <TitleHover className="!left-full mt-3" title="Heading 4">
                <span>Win/Linux: Control + Alt + 4</span>
                <span>MacOS: Cmd + Alt + 4</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("heading", {level: 5})
                  ? "bg-gray-900 text-white"
                  : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() =>
                editor.chain().focus().toggleHeading({level: 5}).run()
              }
            >
              <RiH5 size={14} />
              <TitleHover className="!left-full mt-3" title="Heading 5">
                <span>Win/Linux: Control + Alt + 5</span>
                <span>MacOS: Cmd + Alt + 5</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("heading", {level: 6})
                  ? "bg-gray-900 text-white"
                  : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() =>
                editor.chain().focus().toggleHeading({level: 6}).run()
              }
            >
              <RiH6 size={14} />
              <TitleHover className="!left-full mt-3" title="Heading 6">
                <span>Win/Linux: Control + Alt + 6</span>
                <span>MacOS: Cmd + Alt + 6</span>
              </TitleHover>
            </Button>
          </FlexRowContainer>
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`!aspect-auto !w-fit px-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
        onClick={() => setList((prev) => !prev)}
      >
        <List size={14} strokeWidth={1.5} />

        <ChevronDown size={12} />

        {isList && (
          <FlexRowContainer
            ref={listRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("bulletList") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <RiListOrdered size={14} />
              <TitleHover className="!left-full mt-3" title="Bullet List">
                <span>Win/Linux: Control + Shift + B</span>
                <span>MacOS: Cmd + Shift + B</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("orderedList") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <RiListUnordered size={14} />
              <TitleHover className="!left-full mt-3" title="Ordered List">
                <span>Win/Linux: Control + Shift + 7</span>
                <span>MacOS: Cmd + Shift + 7</span>
              </TitleHover>
            </Button>
          </FlexRowContainer>
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`!aspect-auto !w-fit px-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
        onClick={() => setCode((prev) => !prev)}
      >
        <Code size={14} strokeWidth={1.5} />

        <ChevronDown size={12} />

        {isCode && (
          <FlexRowContainer
            ref={codeRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("code") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <TitleHover className="!left-full mt-3" title="Code">
                <span>Win/Linux: Control + E</span>
                <span>MacOS: Cmd + E</span>
              </TitleHover>
              <RiCodeSSlashLine size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("codeBlock") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <RiCodeBoxLine size={14} />
              <TitleHover className="!left-full mt-3" title="Code Block">
                <span>Win/Linux: Control + Alt + C</span>
                <span>MacOS: Cmd + Alt + C</span>
              </TitleHover>
            </Button>
          </FlexRowContainer>
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`!aspect-auto !w-fit px-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
        onClick={() => setScript((prev) => !prev)}
      >
        <Superscript size={14} strokeWidth={1.5} />

        <ChevronDown size={12} />

        {isScript && (
          <FlexRowContainer
            ref={scriptRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("subscript") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleSubscript().run()}
            >
              <RiSubscript size={14} />
              <TitleHover className="!left-full mt-3" title="Subscript">
                <span>Win/Linux: Control + ,</span>
                <span>MacOS: Cmd + ,</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("superscript") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
            >
              <RiSuperscript size={14} />
              <TitleHover className="!left-full mt-3" title="Superscript">
                <span>Win/Linux: Control + .</span>
                <span>MacOS: Cmd + .</span>
              </TitleHover>
            </Button>
          </FlexRowContainer>
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`!aspect-auto !w-fit px-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
        onClick={() => setTable((prev) => !prev)}
      >
        <Grid2X2 size={14} strokeWidth={1.5} />

        <ChevronDown size={12} />

        {isTable && (
          <FlexRowContainer
            ref={tableRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({rows: 3, cols: 3, withHeaderRow: true})
                  .run()
              }
            >
              <Grid3X3 size={14} />
              <TitleHover
                className="!left-full "
                title="Insert Table"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              <IconColumnInsertLeft size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Add Column Before"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <IconColumnInsertRight size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Add Column After"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <IconColumnRemove size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Delete Column"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              <IconRowInsertTop size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Add Row Before"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <IconRowInsertBottom size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Add Row After"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <IconRowRemove size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Delete Row"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <Grid2x2X size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Delete Table"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().mergeCells().run()}
            >
              <TableCellsMerge size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Merge Cell"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().splitCell().run()}
            >
              <TableCellsSplit size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Split Cell"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            >
              <IconTableColumn size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Toggle Header Column"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
              <IconTableRow size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Toggle Header Row"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            >
              <IconSquare size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Toggle Header Cell"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().mergeOrSplit().run()}
            >
              <IconLayoutBoardSplit size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Merge Or Split"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() =>
                editor.chain().focus().setCellAttribute("colspan", 2).run()
              }
            >
              <TableProperties size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Cell Occupy 2"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().fixTables().run()}
            >
              <IconTableFilled size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Fixed Table"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().goToNextCell().run()}
            >
              <SquareArrowRight size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Go To Next Cell"
              ></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().goToPreviousCell().run()}
            >
              <SquareArrowLeft size={14} strokeWidth={1.5} />
              <TitleHover
                className="!left-full "
                title="Go To Previous Cell"
              ></TitleHover>
            </Button>
          </FlexRowContainer>
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${
          editor.isActive("paragraph") ? "bg-gray-900 text-white" : ""
        } relative group p-2 hover:bg-slate-300`}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <RiParagraph />
        <TitleHover className="!left-full mt-3" title="Paragraph">
          <span>Win/Linux: Control + Alt + 0</span>
          <span>MacOS: Cmd + Alt + 0</span>
        </TitleHover>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${
          editor.isActive("hardBreak") ? "bg-gray-900 text-white" : ""
        } relative group p-2 hover:bg-slate-300`}
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        <RiTextWrap />
        <TitleHover className="!left-full mt-3" title="Hard Break">
          <span>Win/Linux: Shift + Endter; Control + Enter</span>
          <span>MacOS: Shift + Enter; Cmd + Enter</span>
        </TitleHover>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="dark:text-white dark:bg-transparent group relative cursor-pointer h-10 w-10 hover:bg-gray-300 rounded-md flex items-center justify-center"
        onClick={() => setIsHighLight(!isHighlight)}
      >
        <Highlighter size={14} strokeWidth={1.5} />
        <div
          ref={ref}
          className={`${
            isHighlight ? "flex" : "hidden"
          } ring-1 ring-gray-300 bg-white shadow-md p-3 flex-row gap-2 z-30 flex-wrap rounded-md top-full w-[14rem] justify-start items-start absolute left-full`}
        >
          <span
            className={`relative cursor-pointer group h-6 w-6 aspect-square rounded-md ring-0 hover:ring-1 hover:ring-gray-500 transition-all bg-[#ffadad]`}
            onClick={() =>
              editor.chain().focus().toggleHighlight({color: "#ffadad"}).run()
            }
          ></span>
          <span
            className={`relative cursor-pointer group h-6 w-6 aspect-square rounded-md ring-0 hover:ring-1 hover:ring-gray-500 transition-all bg-[#ffd6a5]`}
            onClick={() =>
              editor.chain().focus().toggleHighlight({color: "#ffd6a5"}).run()
            }
          ></span>
          <span
            className={`relative cursor-pointer group h-6 w-6 aspect-square rounded-md ring-0 hover:ring-1 hover:ring-gray-500 transition-all bg-[#fdffb6]`}
            onClick={() =>
              editor.chain().focus().toggleHighlight({color: "#fdffb6"}).run()
            }
          ></span>
          <span
            className={`relative cursor-pointer group h-6 w-6 aspect-square rounded-md ring-0 hover:ring-1 hover:ring-gray-500 transition-all bg-[#caffbf]`}
            onClick={() =>
              editor.chain().focus().toggleHighlight({color: "#caffbf"}).run()
            }
          ></span>
          <span
            className={`relative cursor-pointer group h-6 w-6 aspect-square rounded-md ring-0 hover:ring-1 hover:ring-gray-500 transition-all bg-[#9bf6ff]`}
            onClick={() =>
              editor.chain().focus().toggleHighlight({color: "#9bf6ff"}).run()
            }
          ></span>
          <span
            className={`relative cursor-pointer group h-6 w-6 aspect-square rounded-md ring-0 hover:ring-1 hover:ring-gray-500 transition-all bg-[#ffc6ff]`}
            onClick={() =>
              editor.chain().focus().toggleHighlight({color: "#ffc6ff"}).run()
            }
          ></span>
        </div>
        <TitleHover className="!left-full mt-3" title="Hightlight">
          <span>Win/Linux: Control + Shift + H</span>
          <span>MacOS: Cmd + Shift + H</span>
        </TitleHover>
      </Button>

      <div className="relative w-fit">
        <Button
          variant="outline"
          size="icon"
          className={`!aspect-auto !w-fit px-2 cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
          onClick={() => setYoutube((prev) => !prev)}
        >
          <Youtube size={14} strokeWidth={1.5} />
          <ChevronDown size={12} />
        </Button>
        {isYoutube && (
          <FlexColContainer
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] items-center z-30 gap-2"
            yPos="top"
            auto={true}
          >
            <div className="flex items-center justify-between gap-3">
              <Input
                className="focus:outline-none focus:ring-0"
                type="number"
                min="320"
                max="1024"
                placeholder="Width"
                value={width}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  Number(event.target.value) < 1024 &&
                  Number(event.target.value) >= 320
                    ? setWidth(Number(event.target.value))
                    : 320;
                }}
              />
              <Input
                className="focus:outline-none focus:ring-0"
                type="number"
                min="180"
                max="720"
                placeholder="Height"
                value={height}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  Number(event.target.value) < 720 &&
                  Number(event.target.value) >= 180
                    ? setHeight(Number(event.target.value))
                    : 320;
                }}
              />
            </div>
            <Button
              variant="outline"
              size="default"
              className={`relative group p-2 hover:bg-slate-300 flex items-center justify-center gap-2`}
              onClick={() => addYoutubeVideo()}
            >
              Add Youtube Video
            </Button>
          </FlexColContainer>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        className={` cursor-pointer relative hover:bg-slate-300 flex items-center justify-center gap-2 transition-all rounded-md`}
        onClick={() => setMore((prev) => !prev)}
      >
        <Ellipsis size={14} strokeWidth={1.5} />

        {isMore && (
          <FlexRowContainer
            ref={moreRef}
            className="absolute top-full left-0 bg-white p-3 shadow-md rounded-md border border-gray-100 w-[14rem] z-30 flex-wrap gap-2"
            xPos="left"
            yPos="top"
            auto={true}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLink(editor)}
              className={`${
                editor.isActive("link") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
            >
              <RiLink />
              <TitleHover className="!left-full mt-3" title="Link"></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("link") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              disabled={!isCursorOverLink}
              onClick={() => setLink(editor)}
            >
              <RiLinkUnlink />
              <TitleHover className="!left-full mt-3" title="Link"></TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("blockquote") ? "bg-gray-900 text-white" : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <RiDoubleQuotesL />
              <TitleHover className="!left-full mt-3" title="Blockquote">
                <span>Win/Linux: Control + Shift + B</span>
                <span>MacOS: Cmd + Shift + B</span>
              </TitleHover>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${
                editor.isActive("horizontalRule")
                  ? "bg-gray-900 text-white"
                  : ""
              } relative group p-2 hover:bg-slate-300`}
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <RiSeparator />
              <TitleHover
                className="!left-full "
                title="Separator Line"
              ></TitleHover>
            </Button>
          </FlexRowContainer>
        )}
      </Button>
    </div>
  );
}

export {Toolbar};

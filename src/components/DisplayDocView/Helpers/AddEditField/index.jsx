import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useEffect } from "react";
import { InputTitle } from "../InputTitIe/index.jsx";
import { Paragraph } from "../../Fields/Paragraph/index.jsx";
import { UnorderedList } from "../../Fields/UnorderedList/index.jsx";
import { TaskList } from "../../Fields/TaskList/index.jsx";
import { NumberList } from "../../Fields/NumberList/index.jsx";
import { Link } from "../../Fields/Link/index.jsx";
import { Image } from "../../Fields/Image/index.jsx";
import { FileSelector } from "../../Fields/FileSelector/index.jsx";
import { Table } from "../../Fields/Table/index.jsx";
import { Separator } from "../../Fields/Separator/index.jsx";
import { TimeStamp } from "../../Fields/TimeStamp/index.jsx";
import { CodeBlock } from "../../Fields/CodeBlock/index.jsx";
import { Progress } from "../../Fields/Progress/index.jsx";
import { Duration } from "../../Fields/Duration/index.jsx";
import { DurationTimeline } from "../../Fields/DurationTimeline/index.jsx";

export const AddEditField = ({
  setShowAdd,
  dataIndex,
  setCurrentFieldType,
  currentFieldType,
  type,
  node,
  setNode,
  currentField,
  setCurrentField,
  handleResetShowAdd,
}) => {
  const { currentFlowPlan, setCurrentFlowPlan, defaultNodeConfig } =
    useStateContext();
  const handleGetConfig = (type) => {
    switch (type) {
      case "heading":
        return { ...defaultNodeConfig.titleConfig, align: "left" };
      case "paragraph":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
        };
      case "unorderedList":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
          listStyle: "filledCircle",
          indentation: 0,
        };
      case "taskList":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
          indentation: 0,
          showDateInfo: false,
          progressBar: false,
          repeat: false,
        };
      case "numberList":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
          listStyle: "number",
          indentation: 0,
        };
      case "link":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 14,
          color: "#94edff",
          preview: true,
        };
      case "image":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
        };
      case "file":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
        };
      case "table":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 14,
          borderColor: "var(--border-primary)",
          borderStyle: "solid",
          borderWidth: 2,
        };
      case "separator":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "var(--text-primary)",
        };
      case "timestamp":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "center",
          fontSize: 16,
        };
      case "codeBlock":
        return {
          fontSize: 14,
        };
      case "progress":
        return {
          showPercentage: true,
          multiColor: true,
          color: "#199d19",
          pin: false,
        };
      case "duration":
        return {
          color: "#334155",
          showFromTo: true,
        };
      case "durationEnd":
        return {
          color: "#334155",
        };
      case "durationTimeline":
        return {
          color: "#334155",
          showFromTo: true,
          showGraph: true,
          overlap: false,
          type: "day",
          current: null,
        };

      default:
        break;
    }
  };
  useEffect(() => {
    if (currentField) return;
    setCurrentField({
      type: type,
      data: {
        text: "",
        list: [],
        taskList: {
          repeat: {
            data: [],
            format: {
              type: "daily",
              des: "Daily",
            },
            custom: [
              {
                type: "monday",
                des: "Monday",
                shortDes: "Mon",
                checked: true,
              },
              {
                type: "tuesday",
                des: "Tuesday",
                shortDes: "Tue",
                checked: true,
              },
              {
                type: "wednesday",
                des: "Wednesday",
                shortDes: "Wed",
                checked: true,
              },
              {
                type: "thursday",
                des: "Thursday",
                shortDes: "Thu",
                checked: true,
              },
              {
                type: "friday",
                des: "Friday",
                shortDes: "Fri",
                checked: true,
              },
              {
                type: "saturday",
                des: "Saturday",
                shortDes: "Sat",
                checked: true,
              },
              {
                type: "sunday",
                des: "Sunday",
                shortDes: "Sun",
                checked: true,
              },
            ],
          },
        },
        link: "",
        image: {
          name: "",
          url: "",
          mimeType: "",
        },
        file: {
          name: "",
          url: "",
          mimeType: "",
        },
        table: [
          {
            type: "head",
            data: [
              {
                text: "Heading 1",
              },
              {
                text: "Heading 2",
              },
            ],
          },
          {
            type: "body",
            data: [
              {
                text: "",
              },
              {
                text: "",
              },
            ],
          },
        ],
        timestamp: {
          string: "",
          iso: new Date().toISOString(),
          format: {
            type: "Date Only",
            input: { day: "2-digit", month: "2-digit", year: "numeric" },
          },
        },
        code: {
          language: "javascript",
          theme: "dracula",
          lineNumbers: true,
          wrapLines: true,
          string: "",
          hideTop: false,
        },
        progress: {
          progress: 0,
          type: "doc",
          list: [],
        },
        duration: {
          start: new Date().toISOString(),
          end: null,
          format: {
            type: "Date and Time (12-Hour)",
            input: {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            },
          },
        },
        durationEnd: { durationId: null },
        durationTimeline: {
          type: "doc",
          format: {
            type: "Date and Time (12-Hour)",
            input: {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            },
          },
          displayFormat: {
            type: "week",
            des: "Week",
          },
        },
      },
      config: handleGetConfig(type),
    });
  }, [type]);
  switch (currentField?.type) {
    case "heading":
      return (
        <InputTitle
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          node={node}
          setNode={setNode}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "paragraph":
      return (
        <Paragraph
          setShowAdd={setShowAdd}
          node={node}
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "unorderedList":
      return (
        <UnorderedList
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "taskList":
      return (
        <TaskList
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "numberList":
      return (
        <NumberList
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "link":
      return (
        <Link
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "image":
      return (
        <Image
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "file":
      return (
        <FileSelector
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "table":
      return (
        <Table
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "separator":
      return (
        <Separator
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "timestamp":
      return (
        <TimeStamp
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "codeBlock":
      return (
        <CodeBlock
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "progress":
      return (
        <Progress
          node={node}
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "duration":
      return (
        <Duration
          node={node}
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "durationEnd":
      return (
        <>
          {/* <DurationEnd
            node={node}
            //   handleGetDefaultConfig={handleGetConfig}
            //   currentField={currentField}
            //   setCurrentField={setCurrentField}
            //   currentFieldType={currentFieldType}
            //   setCurrentFieldType={setCurrentFieldType}
            //   dataIndex={dataIndex}
            handleResetShowAdd={handleResetShowAdd}
          /> */}
        </>
      );
    case "durationTimeline":
      return (
        <DurationTimeline
          node={node}
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    default:
      break;
  }
};

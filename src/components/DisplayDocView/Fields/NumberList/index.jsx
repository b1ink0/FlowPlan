import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useState } from "react";
import { v4 } from "uuid";
import { SortableList } from "../../../Helpers/DND/SortableList/index.jsx";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";
import { InputTitleButtons } from "../../Helpers/InputTitleButtons/index.jsx";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const NumberList = ({
  currentField,
  setCurrentField,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();
  const [list, setList] = useState(currentField?.data?.list ?? []);
  const [item, setItem] = useState("");
  const listStyles = [
    {
      type: "number",
      icon: (n) => n + 1,
    },
    {
      type: "roman",
      icon: (n) => handleNumberToRoman(n + 1),
    },
    {
      type: "alphabet",
      icon: (n) => handleNumberToAlphabet(n + 1),
    },
  ];

  const handleNumberToRoman = (num) => {
    const romanNumerals = [
      { value: 1000, numeral: "M" },
      { value: 900, numeral: "CM" },
      { value: 500, numeral: "D" },
      { value: 400, numeral: "CD" },
      { value: 100, numeral: "C" },
      { value: 90, numeral: "XC" },
      { value: 50, numeral: "L" },
      { value: 40, numeral: "XL" },
      { value: 10, numeral: "X" },
      { value: 9, numeral: "IX" },
      { value: 5, numeral: "V" },
      { value: 4, numeral: "IV" },
      { value: 1, numeral: "I" },
    ];

    let result = "";

    for (const pair of romanNumerals) {
      while (num >= pair.value) {
        result += pair.numeral;
        num -= pair.value;
      }
    }

    return result;
  };
  const handleNumberToAlphabet = (num) => {
    if (num < 1) {
      return "Number out of range (>= 1)";
    }

    let result = "";
    console.log(num);
    while (num > 0) {
      const remainder = (num - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      num = Math.floor((num - 1) / 26);
    }
    console.log(result);
    return result;
  };

  const handleItemChange = (e, i = null) => {
    let newList = [...list];
    if (i !== null) {
      newList[i] = {
        id: newList[i].id,
        value: e.target.value,
      };
      setList(newList);
    } else {
      setItem(e.target.value);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setList((prev) => [
      ...prev,
      {
        id: v4(),
        value: item,
      },
    ]);
    setItem("");
  };

  const { handleUpdateIndexDB } = useDatabase();
  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    let finalList =
      item === ""
        ? list
        : [
            ...list,
            {
              id: v4(),
              value: item,
            },
          ];
    if (finalList.length === 0) {
      return;
    }
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        list: finalList,
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    setCurrentFieldType(null);
    setCurrentField(null);
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
  };

  const handleDelete = async (index) => {
    let newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleMove = (items) => {
    setList(items);
  };

  return (
    <div
      style={{
        paddingLeft: `${currentField?.config?.indentation * 10 || 4}px`,
      }}
      className="w-full h-fit flex flex-col justify-start items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-md"
    >
      <SortableList
        items={list}
        onChange={handleMove}
        className="flex flex-col gap-1"
        renderItem={(item, active, setActive, index) => (
          <SortableList.Item id={item?.id}>
            <div
              key={`numberlist-item-${item?.id}`}
              className="group w-full flex justify-center items-center text-sm relative"
            >
              <span
                style={{
                  color: `${currentField?.config?.color}`,
                }}
                className="w-3 h-full mr-1  flex justify-center items-center"
              >
                {listStyles
                  ?.find(
                    (listStyle) =>
                      listStyle.type === currentField.config?.listStyle
                  )
                  ?.icon(index) + "."}
              </span>
              <input
                required
                type="text"
                placeholder="Enter List Item..."
                value={item?.value}
                onChange={(e) => handleItemChange(e, index)}
                className="w-full text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
                style={{
                  fontSize: `${currentField?.config?.fontSize}px`,
                  textDecoration: `${
                    currentField?.config?.strickthrough
                      ? "line-through"
                      : "none"
                  }`,
                  fontStyle: `${
                    currentField?.config?.italic ? "italic" : "normal"
                  }`,
                  fontWeight: `${
                    currentField?.config?.bold ? "bold" : "normal"
                  }`,
                  fontFamily: `${currentField?.config?.fontFamily}`,
                  color: `${currentField?.config?.color}`,
                  textAlign: `${currentField?.config?.align}`,
                }}
              />
              <SortableList.DragHandle className="opacity-0 group-hover:opacity-100 w-5 h-5 absolute right-9 bg-[var(--bg-tertiary)] p-1 rounded-md flex justify-center items-center" />
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="opacity-0 group-hover:opacity-100 w-7 h-5 flex justify-center items-center absolute right-1 text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
              >
                <DeleteIcon />
              </button>
            </div>
          </SortableList.Item>
        )}
      />

      <form
        onSubmit={handleAdd}
        className="w-full flex justify-center items-center text-sm"
      >
        <span
          style={{
            color: `${currentField?.config?.color}`,
          }}
          className="w-3 h-full mr-1  flex justify-center items-center"
        >
          {listStyles
            ?.find(
              (listStyle) => listStyle.type === currentField.config?.listStyle
            )
            ?.icon(list.length) + "."}
        </span>
        <input
          required
          autoFocus
          type="text"
          placeholder="Enter List Item..."
          value={item}
          onChange={handleItemChange}
          className="w-full text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
          style={{
            fontSize: `${currentField?.config?.fontSize}px`,
            textDecoration: `${
              currentField?.config?.strickthrough ? "line-through" : "none"
            }`,
            fontStyle: `${currentField?.config?.italic ? "italic" : "normal"}`,
            fontWeight: `${currentField?.config?.bold ? "bold" : "normal"}`,
            fontFamily: `${currentField?.config?.fontFamily}`,
            color: `${currentField?.config?.color}`,
            textAlign: `${currentField?.config?.align}`,
          }}
        />
      </form>
      <InputTitleButtons
        handleSave={handleSave}
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
      />
    </div>
  );
};

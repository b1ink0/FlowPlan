import {useStateContext} from "../../../../context/StateContext.jsx";
import React, {useState} from "react";
import DotIcon from "../../../../assets/Icons/DotIcon.jsx";
import BorderDot from "../../../../assets/Icons/BorderDot.jsx";
import SquareDot from "../../../../assets/Icons/SquareDot.jsx";
import DiamondDot from "../../../../assets/Icons/DiamondDot.jsx";
import StarDot from "../../../../assets/Icons/StarDot.jsx";
import ArrowDot from "../../../../assets/Icons/ArrowDot.jsx";
import {v4} from "uuid";
import {SortableList} from "../../../Helpers/DND/SortableList/index.jsx";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";
import {InputTitleButtons} from "../../Helpers/InputTitleButtons/index.jsx";

export const UnorderedList = ({
                                  currentField,
                                  setCurrentField,
                                  currentFieldType,
                                  setCurrentFieldType,
                                  handleGetDefaultConfig,
                                  dataIndex,
                                  handleResetShowAdd,
                              }) => {
    const {
        db,
        currentFlowPlan,
        setCurrentFlowPlan,
        defaultNodeConfig,
        currentFlowPlanNode,
        setCurrentFlowPlanNode,
    } = useStateContext();

    const [list, setList] = useState(currentField?.data?.list ?? []);
    const [item, setItem] = useState("");
    const listStyles = [
        {
            type: "filledCircle",
            icon: <DotIcon/>,
        },
        {
            type: "emptyCircle",
            icon: <BorderDot/>,
        },
        {
            type: "filledSquare",
            icon: <SquareDot/>,
        },
        {
            type: "filledDiamond",
            icon: <DiamondDot/>,
        },
        {
            type: "filledStar",
            icon: <StarDot/>,
        },
        {
            type: "filledArrow",
            icon: <ArrowDot/>,
        },
    ];

    const handleItemChange = (e, i = null) => {
        let newList = [...list];
        if (i !== null) {
            newList[i] = {
                id: list[i].id,
                value: e.target.value,
            };
            setList(newList);
        } else {
            setItem(e.target.value);
        }
        console.log(list);
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

    const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
        await db.flowPlans
            .where("refId")
            .equals(refId)
            .modify({
                root: root,
                ...(updateDate && {updatedAt: new Date()}),
            });
    };
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
            node.data.push({...finalField, id: v4()});
        }
        setCurrentFlowPlan((prev) => ({...prev, root: root}));
        await handleUpdateIndexDB(currentFlowPlan.refId, root);
        setCurrentFieldType(null);
        setCurrentField(null);
    };
    const handleMove = (items) => {
        setList(items);
    };
    const handleDelete = async (index) => {
        let newList = [...list];
        newList.splice(index, 1);
        setList(newList);
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
                            key={`list-item-${item?.id}`}
                            className="group w-full flex justify-center items-center text-sm relative"
                        >
              <span
                  style={{
                      color: `${currentField?.config?.color}`,
                  }}
                  className="w-3 h-3 mr-1 block"
              >
                {
                    listStyles?.find(
                        (listStyle) =>
                            listStyle.type === currentField.config?.listStyle
                    )?.icon
                }
              </span>
                            <input
                                required
                                type="text"
                                placeholder="Enter List Item..."
                                value={item.value}
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
                            <SortableList.DragHandle
                                className="opacity-0 group-hover:opacity-100 w-5 h-5 absolute right-9 bg-[var(--bg-tertiary)] p-1 rounded-md flex justify-center items-center"/>
                            <button
                                type="button"
                                onClick={() => handleDelete(index)}
                                className="opacity-0 group-hover:opacity-100 w-7 h-5 flex justify-center items-center absolute right-1 text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
                            >
                                <DeleteIcon/>
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
            className="w-3 h-3 mr-1 block"
        >
          {
              listStyles?.find(
                  (listStyle) => listStyle.type === currentField.config?.listStyle
              )?.icon
          }
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
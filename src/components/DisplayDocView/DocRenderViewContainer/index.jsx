import { useStateContext } from "../../../context/StateContext.jsx";
import { SortableList } from "../../Helpers/DND/SortableList/index.jsx";
import { DocRenderView } from "../DocRenderView/index.jsx";
import React from "react";

export const DocRenderViewContainer = ({
  node,
  move,
  setMove,
  setNode,
  showAdd,
  setShowAdd,
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleEditField,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();

  const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });
  };

  const handleMove = async (items) => {
    if (items?.length === 0) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    node.data = items;
    node.updatedAt = new Date();
    handleResetShowAdd();
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  return (
    <SortableList
      items={node?.data}
      onChange={handleMove}
      applayGap={true}
      renderItem={(item, active, setActive, index) => (
        <SortableList.Item id={item.id}>
          <DocRenderView
            key={"field-id-" + item.type + "-" + item.id}
            field={item}
            i={index}
            length={node.data.length}
            node={node}
            move={move}
            setMove={setMove}
            setNode={setNode}
            showAdd={showAdd}
            setShowAdd={setShowAdd}
            currentField={currentField}
            setCurrentField={setCurrentField}
            currentFieldType={currentFieldType}
            setCurrentFieldType={setCurrentFieldType}
            handleEditField={handleEditField}
            handleResetShowAdd={handleResetShowAdd}
            DragHandle={SortableList.DragHandle}
            active={active}
            setActive={setActive}
          />
        </SortableList.Item>
      )}
    />
  );
};

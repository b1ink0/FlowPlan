import React, { useEffect, useState } from "react";
import BackIcon from "../../assets/Icons/BackIcon";
import { useStateContext } from "../../context/StateContext";
import OpenAI from "openai";
import sample_1 from "./sample_1.json";
import sample_2 from "./sample_2.json";
import nodeThemes from "../../assets/themes/nodeThemes.json";
import { v4 } from "uuid";
import { createNode } from "../../hooks/useTree";
import AiIcon from "../../assets/Icons/AiIcon";
import { useFunctions } from "../../hooks/useFunctions";

function BottomPanel() {
  const {
    db,
    currentFlowPlan,
    showBottomPanel,
    setShowBottomPanel,
    currentNode,
    setCurrentNode,
    defaultNodeConfig,
  } = useStateContext();
  const [node, setNode] = useState(null);
  useEffect(() => {
    if (
      db === null ||
      currentFlowPlan === null ||
      currentNode.location === null
    )
      return;
    let parentNode = currentFlowPlan.root;
    currentNode.location.forEach((index) => {
      parentNode = parentNode.children[index];
    });

    const config =
      parentNode?.config && Object.keys(parentNode?.config)?.length
        ? parentNode?.config
        : defaultNodeConfig;

    setNode({
      title: parentNode.title,
      data: parentNode.data,
      config: config,
    });
  }, [currentNode.show, currentNode.location]);
  return (
    <div
      className={`${
        // when showSideNavbar is false translate sideNavbar to left
        !currentNode.show ? "translate-y-full" : ""
      } z-10 transition-all duration-200 w-[calc(100%_-_280px_-_280px)] grow-0 h-[400px] absolute bottom-0 bg-[var(--bg-primary-translucent)] text-gray-200 flex flex-col justify-center items-center gap-1 border-2 border-[var(--border-primary)]`}
    >
      <ToggleSideNavbarButton
        setShowSideNavbar={setCurrentNode}
        showSideNavbar={currentNode}
      />
      {node ? (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1">
          <h3 className="w-full text-center border-b border-b-[var(--border-primary)] text-lg font-medium py-1 px-2 text-[var(--text-primary)] text-ellipsis overflow-hidden">
            Auto Genration Options For {node?.title}
          </h3>
          <Autogeneration node={node} />
        </div>
      ) : (
        <h3 className="w-full text-center text-lg font-medium py-1 px-2 text-[var(--text-primary)] text-ellipsis overflow-hidden flex justify-center items-center">
          Select Node Using
          <span className="w-5 h-5 inline-block ml-1">
            <AiIcon />
          </span>
          !
        </h3>
      )}
    </div>
  );
}

const ToggleSideNavbarButton = ({ showSideNavbar, setShowSideNavbar }) => {
  return (
    <button
      className={`${
        // when showSideNavbar is false rotate close button to 180deg
        showSideNavbar.show ? "-translate-y-[34px]" : "-translate-y-[34px]"
      } outline-none transition-all duration-200 w-6 h-12 rounded-r-full absolute -rotate-90 top-0 z-10 bg-[var(--bg-tertiary)] flex justify-center items-center p-1 cursor-pointer border-r-2 border-t-2 border-b-2 border-[var(--border-primary)]`}
      onClick={() =>
        setShowSideNavbar((prev) => {
          return {
            ...prev,
            show: !prev.show,
          };
        })
      }
    >
      <BackIcon />
    </button>
  );
};

const Autogeneration = ({ node }) => {
  const [loading, setLoading] = useState(false);
  const {
    db,
    currentFlowPlan,
    openai,
    currentNode,
    setCurrentFlowPlan,
    setUpdate,
  } = useStateContext();
  const { handlePositionCalculation } = useFunctions();
  const [projectName, setProjectName] = useState(
    "Training and Placement Application"
  );
  const [problemStatement, setProblemStatement] = useState(
    " Develop a comprehensive Training and Placement Application for colleges to automate student profile management, streamline job applications, coordinate training programs, organize placement events, facilitate communication, and provide analytics for data-driven decision-making. This application aims to improve the efficiency and transparency of the college placement process for students and recruiters."
  );
  const [extraPrompt, setExtraPrompt] = useState("");
  const [error, setError] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleAddNewChildNode = async (plans, location) => {
    if (plans.length === 0) return;
    console.log(plans);
    for (const plan of plans) {
      let root = currentFlowPlan.root;
      let parentNode = currentFlowPlan.root;
      // loop through location array to get parent node to edit
      location.forEach((index) => {
        parentNode = parentNode.children[index];
      });
      const newRefId = v4();
      const newNode = createNode(
        newRefId,
        plan,
        [],
        structuredClone(
          nodeThemes[Math.floor(Math.random() * nodeThemes.length)]
        )
      );
      parentNode.children.push(newNode);
      handlePositionCalculation(root);
      setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
      await handleUpdateDb(root, currentFlowPlan.refId);
      setUpdate((prev) => prev + 1);
      // update currentFlowPlan in indexedDB
      await new Promise((resolve, reject) => {
        // Simulating an asynchronous request with a timeout
        setTimeout(() => {
          resolve();
        }, 2000); // Simulating a 1-second delay
      });
    }
  };

  const handleAddDescription = async (description, location) => {
    let root = currentFlowPlan.root;
    let parentNode = currentFlowPlan.root;
    // loop through location array to get parent node to edit
    location.forEach((index) => {
      parentNode = parentNode.children[index];
    });
    parentNode["description"] = description;
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateDb(root, currentFlowPlan.refId);
    setUpdate((prev) => prev + 1);
    // update currentFlowPlan in indexedDB
  };

  // helper function for updating database
  const handleUpdateDb = async (node, refId) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({ root: node, updatedAt: new Date() });
  };

  const handleGenerateDescription = async () => {
    setError(false);
    if (projectName === "" || problemStatement === "") return;
    setLoading(true);
    let prompt = `
      Initialize:
      1. you are going to behave like a api with returns only json data.
      2. you are going to  create a description for given input in context of  software development life cycle.
      input:
      generate description for: ${node.title} Phase
      1. project name: ${projectName}
      2. problem statement: ${problemStatement}
      3. Extra Instructions: ${extraPrompt}
      output:
      [description]
      constraints:
      1. description should be at least 100 characters long.
      2. response should strictly only in description returned in above defined output format.
    `;

    try {
      console.log(prompt);
      const chatCompletion = await openai?.chat?.completions?.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        model: "gpt-3.5-turbo",
      });

      console.log(chatCompletion);
      const output = chatCompletion.choices[0].message.content;
      console.log(output);
      const description = JSON.parse(output); // setNodeNameList(list.subpoints);
      console.log(description);
      await handleAddDescription(description.description, currentNode.location);
    } catch (err) {
      console.log(err);
      setError(true);
    }
    setLoading(false);
  };

  const handleGenerateTasks = async () => {};

  const handleGenerateChilds = async () => {
    setError(false);
    if (projectName === "" || problemStatement === "") return;
    setLoading(true);
    let prompt = `
      Initialize:
      1. you are going to behave like a api with returns only json data.
      2. you are going to  create a array of sub points for given input in context of  software development life cycle.
      input:
      generate sub points for: ${node.title} Phase 
      ${extraPrompt}
      output:
      [subpoint,...]
      constraints:
      1. array of elements should be 5 to 4 in length at least.
      2. response should strictly only in array of sub points returned in above defined output format.
    `;

    try {
      console.log(prompt);
      const chatCompletion = await openai?.chat?.completions?.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        model: "gpt-3.5-turbo",
      });

      console.log(chatCompletion);
      const output = chatCompletion.choices[0].message.content;
      console.log(output);
      const list = JSON.parse(output); // setNodeNameList(list.subpoints);
      await handleAddNewChildNode(list.subpoints, currentNode.location);
    } catch (err) {
      console.log(err);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      currentFlowPlan === null ||
      currentFlowPlan?.projectName === undefined ||
      currentFlowPlan?.problemStatement === undefined
    )
      return;
    setProjectName(currentFlowPlan.projectName);
    setProblemStatement(currentFlowPlan.problemStatement);
  }, [currentFlowPlan]);

  return (
    <div className="w-full h-full bg-[var(--bg-secondary)]">
      <div className="h-[300px] w-full flex flex-col gap-2 overflow-y-auto bg-[var(--bg-secondary)] rounded-md p-2">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-2 bg-[var(--bg-primary)] p-2 rounded-md">
            <button
              type="button"
              className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
              onClick={() => setShowMore((prev) => !prev)}
            >
              Customize Prompt
            </button>
            {showMore && (
              <>
                <span className="text-[var(--text-primary)] text-sm ">
                  Project Name:*
                </span>
                <input
                  className="h-fit text-[var(--text-primary)] text-sm w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                  required={true}
                  placeholder="Enter Project Name..."
                ></input>
                <span className="text-[var(--text-primary)] text-sm ">
                  Project Problem Statement:*
                </span>
                <textarea
                  className="h-fit text-[var(--text-primary)] text-sm w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  required={true}
                  placeholder="Enter Project Problem Statement..."
                ></textarea>
                <span className="text-[var(--text-primary)] text-sm ">
                  Extra Information:
                </span>
                <textarea
                  className="h-fit text-[var(--text-primary)] text-sm w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
                  value={extraPrompt}
                  onChange={(e) => setExtraPrompt(e.target.value)}
                  placeholder="Enter Extra Information..."
                ></textarea>
              </>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
                onClick={handleGenerateDescription}
              >
                {loading ? "Loading..." : "Generate Description"}
              </button>
              <button
                type="button"
                className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
                onClick={handleGenerateTasks}
              >
                {loading ? "Loading..." : "Generate Tasks"}
              </button>
            </div>
            <button
              type="button"
              className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
              onClick={handleGenerateChilds}
            >
              {error
                ? "Error Click To Re Generate Child Nodes"
                : loading
                ? "Loading..."
                : "Generate Child Nodes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomPanel;

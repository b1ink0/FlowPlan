// @ts-check
import React, { useEffect, useState } from "react";
import EditIcon from "../../assets/Icons/EditIcon";
import { useLiveQuery } from "dexie-react-hooks";
import { useStateContext } from "../../context/StateContext";
import BackIcon from "../../assets/Icons/BackIcon";
import { createNode } from "../../hooks/useTree";
import { v4 } from "uuid";
import { useFunctions } from "../../hooks/useFunctions";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import ShareIcon from "../../assets/Icons/ShareIcon";
import EditBtnIcon from "../../assets/Icons/EditBtnIcon";
import CloseBtnIcon from "../../assets/Icons/CloseBtnIcon";
import { useWebSocket } from "../../hooks/useWebSocket";
import nodeThemes from "../../assets/themes/nodeThemes.json";

function SideNavbar() {
  // destructure state from context
  const {
    db,
    setMove,
    flowPlans,
    setFlowPlans,
    currentFlowPlan,
    setCurrentFlowPlan,
    setAddEditNode,
    defaultNodeConfig,
  } = useStateContext();
  // destructure functions from custom hook
  const {
    handleExportFlowPlan,
    handleImportFlowPlan,
    handleShareFlowPlan,
    handleDeleteFlowPlan,
    handlePositionCalculation,
  } = useFunctions();
  // local state
  const [showSideNavbar, setShowSideNavbar] = useState(true);
  const [noteTitle, setNoteTitle] = useState("");
  const [exportSelect, setExportSelect] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [subMenu, setSubMenu] = useState({
    refId: "",
    show: false,
  });
  const [selected, setSelected] = useState([]);
  const [copied, setCopied] = useState(false);

  // function to create new note
  const handleAddNewNote = async (e) => {
    e.preventDefault();
    if (db === null) return;
    const newRefId = v4();
    const newRootTreeNode = createNode(
      newRefId,
      noteTitle,
      [],
      structuredClone(defaultNodeConfig)
    );
    const newNote = {
      refId: newRefId,
      title: noteTitle,
      root: newRootTreeNode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db?.flowPlans.add(newNote);
    handleSetCurrentFlowPlan(newRefId);
    setNoteTitle("");
  };

  // function to edit note
  const handleEditNote = async (e) => {
    e.preventDefault();
    if (db === null) return;
    await db?.flowPlans.where("refId").equals(currentFlowPlan.refId).modify({
      title: noteTitle,
      updatedAt: new Date(),
    });
    setEditNote(false);
    setNoteTitle("");
  };

  // function to set current note
  const handleSetCurrentFlowPlan = async (refId) => {
    try {
      // get current note from db using refId
      const result = await db.flowPlans.where("refId").equals(refId).first();
      // position calculation for tree
      handlePositionCalculation(result.root);
      // set current note in context
      setCurrentFlowPlan(result);
      // set move to false and null for safety
      setMove((prev) => ({
        enable: false,
        node: null,
      }));
      setAddEditNode({
        show: false,
        location: null,
        type: "add",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // functions to handle export select
  const handleChecked = (refId) => {
    if (selected.includes(refId)) {
      setSelected((prev) => prev.filter((item) => item !== refId));
    } else {
      setSelected((prev) => [...prev, refId]);
    }
  };
  const handleSelectAll = () => {
    setSelected(flowPlans.map((flowPlan) => flowPlan.refId));
  };
  const handleSelectCancel = () => {
    setSelected([]);
    setExportSelect(false);
  };

  // for updating flowPlans state when new note is added
  useLiveQuery(async () => {
    // if db is null return
    if (db === null) return;
    // get all flowPlans from db
    const allFlowPlan = await db?.flowPlans?.toArray();
    // if no flowPlans return
    if (allFlowPlan.length === 0) return;
    // updating flowPlans state
    setFlowPlans((prev) => {
      // if prev and allFlowPlan length is same return prev means no change
      // if (prev.length === allFlowPlan.length) return prev;
      // else create tempFlowPlans array
      let tempFlowPlans = [];
      // loop through allFlowPlan and push required data to tempFlowPlans
      allFlowPlan.forEach((flowPlan) => {
        let tempFlowPlan = {
          refId: flowPlan.refId,
          title: flowPlan.title,
          createdAt: flowPlan.createdAt,
          updatedAt: flowPlan.updatedAt,
        };
        tempFlowPlans.push(tempFlowPlan);
      });
      // sort tempFlowPlans by updatedAt field
      tempFlowPlans
        .sort(function (a, b) {
          var c = new Date(a.updatedAt);
          var d = new Date(b.updatedAt);
          return c - d;
        })
        .reverse();
      // finally return tempFlowPlans
      return tempFlowPlans;
    });
  }, [db]);

  // for setting current note when App loads and when new note is added
  useEffect(() => {
    if (flowPlans?.length === 0) return;
    if (currentFlowPlan !== null) return;
    handleSetCurrentFlowPlan(flowPlans[0]?.refId);
  }, [flowPlans]);

  return (
    // SideNavbar container
    <div
      className={`${
        // when showSideNavbar is false translate sideNavbar to left
        !showSideNavbar ? "-translate-x-full" : ""
      } z-10 transition-all duration-200 w-[280px] grow-0 h-full absolute left-0 top-0 bg-[var(--bg-primary-translucent)] text-gray-200 flex flex-col justify-center items-center gap-1 border-r-2 border-[var(--border-primary)]`}
    >
      {/* SideNavbar open close button */}
      <ToggleSideNavbarButton
        showSideNavbar={showSideNavbar}
        setShowSideNavbar={setShowSideNavbar}
      />

      {/* SideNavbar header */}
      <div className="w-full flex flex-col justify-center items-center p-3 px-2 gap-1 border-b-2 border-[var(--border-primary)]">
        <h3 className="text-[var(--text-primary)] text-lg font-medium tracking-wider">
          FlowPlan
        </h3>
        <Form
          handles={{ handleAddNewNote, handleEditNote }}
          editNote={editNote}
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
        />
      </div>
      {/* Export Buttons show when exporting */}
      {exportSelect && (
        <ExportButtons
          handles={{
            handleSelectAll,
            handleSelectCancel,
            handleExportFlowPlan,
          }}
          setSelected={setSelected}
          selected={selected}
          flowPlans={flowPlans}
        />
      )}

      {/* SideNavbar body */}
      <div className="grow w-full overflow-x-auto flex flex-col justify-start items-center gap-2 py-2 px-2">
        {/* Listing all notes */}
        {flowPlans?.map((flowPlan) => (
          <div
            key={flowPlan?.refId}
            onClick={() =>
              // if exportSelect is true then handleChecked else handleSetCurrentFlowPlan
              exportSelect
                ? handleChecked(flowPlan?.refId)
                : handleSetCurrentFlowPlan(flowPlan?.refId)
            }
            className={`${
              // set current note background color to light
              currentFlowPlan?.refId === flowPlan?.refId
                ? "bg-[var(--bg-tertiary)]"
                : "bg-[var(--bg-secondary)]"
            } w-full p-3 relative group hover:bg-[var(--bg-tertiary)] transition-colors duration-200 cursor-pointer rounded-md flex items-center shrink-0 gap-2`}
          >
            {/* SubMenu */}
            {subMenu.show && subMenu.refId === flowPlan?.refId && (
              <SubMenu
                handles={{
                  handleShareFlowPlan,
                  handleDeleteFlowPlan,
                }}
                setEditNote={setEditNote}
                setNoteTitle={setNoteTitle}
                flowPlan={flowPlan}
                setSubMenu={setSubMenu}
                copied={copied}
                setCopied={setCopied}
              />
            )}

            {/* Export checkbox indicator */}
            {exportSelect && (
              <Checkbox selected={selected} flowPlan={flowPlan} />
            )}

            {/* Plan title */}
            <h4
              title={flowPlan?.title}
              className="text-[var(--text-primary)] truncate"
            >
              {flowPlan?.title}
            </h4>

            {/* Open sub menu button */}
            <OpenSubMenuButton setSubMenu={setSubMenu} flowPlan={flowPlan} />

            {/* Plan created at and updated at */}
            <TimeAndDate timeDate={flowPlan?.updatedAt} />
          </div>
        ))}
      </div>

      {/* Import and Export buttons footer for sidenavbar*/}
      <ImportExport
        handleImportFlowPlan={handleImportFlowPlan}
        setExportSelect={setExportSelect}
      />
    </div>
  );
}

// Button Components
const ToggleSideNavbarButton = ({ showSideNavbar, setShowSideNavbar }) => {
  return (
    <button
      className={`${
        // when showSideNavbar is false rotate close button to 180deg
        showSideNavbar ? "translate-x-[24px]" : "translate-x-[24px]"
      } outline-none transition-all duration-200 w-6 h-12 rounded-r-full absolute right-0 z-10 bg-[var(--bg-tertiary)] flex justify-center items-center p-1 cursor-pointer border-r-2 border-t-2 border-b-2 border-[var(--border-primary)]`}
      onClick={() => setShowSideNavbar((prev) => !prev)}
    >
      <BackIcon />
    </button>
  );
};

const ExportButtons = ({ handles, setSelected, selected, flowPlans }) => {
  const { handleSelectAll, handleSelectCancel, handleExportFlowPlan } = handles;
  return (
    <div className="w-full flex gap-2 px-2 pt-1">
      <button
        onClick={() =>
          selected.length === flowPlans.length
            ? setSelected([])
            : handleSelectAll()
        }
        className="text-[var(--text-primary)] w-full flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
      >
        {selected.length === flowPlans.length ? "Deselect All" : "Select All"}
      </button>
      {selected.length > 0 && (
        <button
          onClick={() => {
            handleExportFlowPlan(selected);
            handleSelectCancel();
          }}
          className="text-[var(--text-primary)] w-3 h-8 flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
        >
          Export
        </button>
      )}
      <button
        className="text-[var(--text-primary)] w-full flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
        onClick={handleSelectCancel}
      >
        Cancel
      </button>
    </div>
  );
};

const OpenSubMenuButton = ({ setSubMenu, flowPlan }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setSubMenu({
          refId: flowPlan?.refId,
          show: true,
        });
      }}
      className="absolute flex justify-center items-center right-0 h-full w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
    >
      <span className="absolute w-7 h-7 rounded-full flex justify-center items-center gap-2">
        <EditIcon />
      </span>
    </button>
  );
};

// Helper Components
const Form = ({ handles, editNote, noteTitle, setNoteTitle }) => {
  const { handleEditNote, handleAddNewNote } = handles;
  return (
    <form
      className="w-full flex flex-col mt-1 gap-2"
      onSubmit={editNote ? handleEditNote : handleAddNewNote}
    >
      <input
        type="text"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
        placeholder="Enter note title..."
        required
        className="text-[var(--text-primary)] w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
      />
      {/* <Autogeneration noteTitle={noteTitle} /> */}
      <button
        type="submit"
        className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
      >
        {editNote ? "Save" : "Add"}
      </button>
    </form>
  );
};

const Autogeneration = ({ noteTitle }) => {
  const [showAutogenration, setShowAutogenration] = useState(false);
  const { showBottomPanel, setShowBottomPanel } = useStateContext();
  const [questons, setQuestons] = useState([
    {
      title: "Project Scope",
      questions: [
        {
          question: "What is the problem statement of Project?",
          answer:
            "The current manual process for students to apply for available jobs and for the training and placement department to manage applications is time-consuming and inefficient.",
          required: true,
        },
        {
          question:
            "What are the primary goals and objectives of implementing this Project?",
          answer:
            "To streamline the job application process for students and improve communication between students, companies, and the training and placement department.",
          required: true,
        },
        {
          question:
            "What specific requirements do you have in mind for the application?",
          answer:
            "The application should allow students to browse and apply for available job opportunities, and it should provide an interface for the training and placement admin to manage and approve applications.",
          required: true,
        },
        {
          question: "How do you envision this Project benefiting users?",
          answer:
            "The project will provide students with easy access to job opportunities, while the training and placement admin will be able to efficiently manage and monitor applications, thereby enhancing the overall placement process.",
          required: true,
        },
      ],
    },
    {
      title: "Project Timeline",
      questions: [
        {
          question:
            "What are the key milestones you expect to achieve during the development and implementation phases?",
          answer:
            "Completion of the application design phase, development phase, testing phase, and deployment and launch phase.",
          required: true,
        },
        {
          question:
            "What is the expected duration for the development and implementation of the Project?",
          answer:
            "Approximately 6-9 months, depending on the complexity of the application and the availability of resources.",
          required: true,
        },
        {
          question: "What is the start date of the Project?",
          answer: "01-04-23",
          required: true,
        },
        {
          question: "What is the expected date of completion of the Project?",
          answer: "01-11-23",
          required: true,
        },
        {
          question: "What is the expected date of Project launch?",
          answer: "01-12-23",
          required: true,
        },
      ],
    },
    {
      title: "Project Resources",
      questions: [
        {
          question:
            "What human resources are available for the development and maintenance of the Project?",
          answer:
            "A team of experienced developers, designers, quality assurance professionals, and project managers will be allocated for the development and maintenance of the application.",
          required: true,
        },
        {
          question:
            "What is the budget allocated for the development, maintenance, and updates of the Project?",
          answer:
            "Approximately 100000Rs will be allocated for the development, maintenance, and regular updates of the application.",
          required: true,
        },
        {
          question:
            "What specific tools and technologies do you prefer to use for building this application?",
          answer:
            "Preferred technologies include react native, java, jvascript programming language, mysql database management system, and git, github for version control.",
          required: true,
        },
      ],
    },
    {
      title: "Project Features",
      questions: [
        {
          question: "What are the key features of the Project?",
          answer:
            "The key features of the application include a user-friendly job search interface for students, application management tools for the admin, real-time notifications for students on application status, and a comprehensive dashboard for the admin to monitor and manage applications efficiently.",
          required: true,
        },
      ],
    },
  ]);

  const { handleSendMessage, handleReceiveMessage } = useWebSocket();
  const [message, setMessage] = useState({});
  const { openai } = useStateContext();
  const handleGenerate = async () => {
    let s = `this questons answer will be given by users as a prompt generate a flow of planning using this context in a tree based form example {"planning": [{name: node name, description: description about node, childs: []...} like this only don't return any other text here node name is the name of node which will be genreated by using the answer to questions and tree should be 4 level deep :
             use the below questions and answers to generate the flow for planning`;
    questons.forEach((question, i) => {
      s += `\n${question.title}\n`;
      question.questions.forEach((question, j) => {
        s += `\n${question.question}\n${question.answer}\n`;
      });
    });
    console.log(s);
    const chatCompletion = await openai?.chat?.completions?.create({
      messages: [
        {
          role: "user",
          content: s,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    console.log(chatCompletion);
    const plan = JSON.parse(chatCompletion.choices[0].message.content);
    console.log(plan);
    Object.keys(plan).forEach((key) => {
      handleCreateNewTree(plan[key]);
    });
    // handleSendMessage(
    // JSON.stringify({
    // message: s,
    // c_id: "t",
    // })
    // );
  };
  useEffect(() => {
    // handleReceiveMessage(setMessage);
  }, []);
  const { db, defaultNodeConfig } = useStateContext();

  const handleAddNewChildNode = (plans, node) => {
    if (plans.length === 0) return;
    console.log(plans);
    plans.forEach((plan) => {
      const newRefId = v4();
      const newNode = createNode(
        newRefId,
        plan.name,
        [],
        structuredClone(
          nodeThemes[Math.floor(Math.random() * nodeThemes.length)]
        ),
        plan.description
      );
      node.children.push(newNode);
      handleAddNewChildNode(plan.childs, newNode);
    });
  };

  const handleCreateNewTree = async (data) => {
    if (db === null) return;
    const newRefId = v4();
    const newRootTreeNode = createNode(
      newRefId,
      noteTitle,
      [],
      structuredClone(nodeThemes[Math.floor(Math.random() * nodeThemes.length)])
    );

    const sdlfc = [
      "Planning",
      "Design",
      "Development",
      "Testing",
      "Deployment",
      "Maintenance",
    ];

    sdlfc.forEach((plan) => {
      const newRefId = v4();
      const newNode = createNode(
        newRefId,
        plan,
        [],
        structuredClone(
          nodeThemes[Math.floor(Math.random() * nodeThemes.length)]
        )
      );
      newRootTreeNode.children.push(newNode);
    });

    const newNote = {
      refId: newRefId,
      title: noteTitle,
      root: newRootTreeNode,
      autogeneration: { stage_1: questons },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    handleAddNewChildNode(data, newRootTreeNode.children[0]);

    console.log(newNote);

    await db?.flowPlans.add(newNote);
  };

  useEffect(() => {
    console.log(message);
    if (Object.keys(message).length === 0) return;
    try {
      // const plan = JSON.parse(message?.message);
      // console.log(plan);
      // Object.keys(plan).forEach((key) => {
      // handleCreateNewTree(key, plan[key]);
      // });
    } catch (error) {
      console.error(error);
    }
  }, [message]);
  return (
    <>
      <button
        type="button"
        // onClick={() => setShowAutogenration((prev) => !prev)}
        onClick={() => setShowBottomPanel((prev) => !prev)}
        className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
      >
        {/* {showAutogenration ? "Hide" : "Show"} Autogeneration */}
        {showBottomPanel ? "Hide" : "Show"} Autogeneration
      </button>
      <div
        className="h-[500px] overflow-y-auto bg-[var(--bg-secondary)] rounded-md p-2"
        style={{ display: showAutogenration ? "block" : "none" }}
      >
        {showAutogenration &&
          questons.map((question, i) => (
            <div
              key={"question-container-" + i}
              className="flex flex-col gap-2"
            >
              <h3 className="text-[var(--text-primary)] text-md font-medium tracking-wider">
                {question.title}
              </h3>
              {question.questions.map((question, j) => (
                <div
                  key={"question-" + j}
                  className="flex flex-col gap-2 bg-[var(--bg-primary)] p-2 rounded-md"
                >
                  <span className="text-[var(--text-primary)] text-sm ">
                    {question.question} {question.required && "*"}
                  </span>
                  <textarea
                    className="h-fit text-[var(--text-primary)] text-sm w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
                    value={question.answer}
                    onChange={(e) => {
                      let tempQuestions = [...questons];
                      tempQuestions[i].questions[j].answer = e.target.value;
                      setQuestons(tempQuestions);
                    }}
                    required={question.required}
                    placeholder="Enter answer..."
                  ></textarea>
                </div>
              ))}
            </div>
          ))}
      </div>
      {showAutogenration && (
        <button
          type="button"
          className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
          onClick={handleGenerate}
        >
          Generate
        </button>
      )}
    </>
  );
};

const ImportExport = ({ handleImportFlowPlan, setExportSelect }) => {
  return (
    <div className="w-full p-3 px-2 h-fit flex gap-2">
      <div className="relative w-full flex justify-center items-center cursor-pointer flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300">
        <span className="text-[var(--text-primary)] cursor-pointer">
          Import
        </span>
        <input
          type="file"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleImportFlowPlan}
        />
      </div>
      <button
        className="text-[var(--text-primary)] w-full flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
        onClick={() => setExportSelect((prev) => !prev)}
      >
        Export
      </button>
    </div>
  );
};

const SubMenu = ({
  handles,
  setEditNote,
  setNoteTitle,
  flowPlan,
  setSubMenu,
  copied,
  setCopied,
}) => {
  const { handleShareFlowPlan, handleDeleteFlowPlan } = handles;
  const handleCloseSubMenu = (e) => {
    e.stopPropagation();
    setSubMenu({
      refId: flowPlan?.refId,
      show: false,
    });
  };
  return (
    <span
      onClick={(e) => e.stopPropagation()}
      className="flex justify-between rounded-md items-center w-full h-full bg-[var(--bg-secondary)] absolute right-0 shrink-0 gap-2 cursor-default z-10 spread"
    >
      <span className="flex justify-center items-center">
        {/* Share Plan Button */}
        <button
          title="Share"
          onClick={() => handleShareFlowPlan(flowPlan?.refId, setCopied)}
          className="w-10 h-10 flex justify-center items-center hover:bg-[var(--bg-tertiary)] transition-colors duration-300 rounded-sm"
        >
          <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
            <ShareIcon />
          </span>
        </button>
        {/* Edit Plan Button */}
        <button
          onClick={(e) => {
            setEditNote(true);
            setNoteTitle(flowPlan?.title);
            handleCloseSubMenu(e);
          }}
          className="w-10 h-10 flex justify-center items-center hover:bg-[var(--bg-tertiary)] transition-colors duration-300 rounded-sm"
        >
          <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
            <EditBtnIcon />
          </span>
        </button>
        {/* Delete Plan Button */}
        <button
          className="w-10 h-10 flex justify-center items-center hover:bg-[var(--bg-tertiary)] transition-colors duration-300 rounded-sm"
          onClick={() => handleDeleteFlowPlan(flowPlan?.refId)}
        >
          <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
            <DeleteIcon />
          </span>
        </button>
      </span>
      {copied && <span className="text-sm text-gray-400 spread">Copied!</span>}
      {/* Close SubMenu Button */}
      <button
        onClick={handleCloseSubMenu}
        className="w-8 h-8 flex justify-center items-center mr-4"
      >
        <span className="absolute w-8 h-8 rounded-full flex justify-center items-center gap-2">
          <CloseBtnIcon />
        </span>
      </button>
    </span>
  );
};

const TimeAndDate = ({ timeDate }) => {
  return (
    <span className="text-[var(--text-secondary)] absolute text-[10px] group-hover:opacity-0 transition-opacity right-2 bottom-[1px]">
      {timeDate?.toTimeString().split(" ")[0].split(":").slice(0, 2).join(":")}{" "}
      {timeDate?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  );
};

const Checkbox = ({ selected, flowPlan }) => {
  return (
    <div className="w-5 h-5 flex justify-center items-center">
      <span
        className={`${
          selected?.includes(flowPlan?.refId)
            ? "bg-[var(--text-secondary)]"
            : "bg-[var(--bg-primary)]"
        } w-3 h-3 rounded-full transition-all duration-200`}
      ></span>
    </div>
  );
};

export default SideNavbar;

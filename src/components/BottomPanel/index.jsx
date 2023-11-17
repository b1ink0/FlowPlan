import React, { useEffect, useState } from "react";
import BackIcon from "../../assets/Icons/BackIcon";
import { useStateContext } from "../../context/StateContext";
import OpenAI from "openai";
import sample_1 from "./sample_1.json";
import sample_2 from "./sample_2.json";
import nodeThemes from "../../assets/themes/nodeThemes.json";
import { v4 } from "uuid";
import { createNode } from "../../hooks/useTree";

function BottomPanel() {
  const tabs = [
    "Initialize",
    "Planning",
    "Design",
    "Development",
    "Testing",
    "Deployment",
    "Maintenance",
  ];
  const { db, currentFlowPlan, showBottomPanel, setShowBottomPanel } =
    useStateContext();
  const [currentTab, setCurrentTab] = useState("Initialize");
  const [planningQuestons, setPlanningQuestons] = useState([
    {
      question:
        "What are the specific requirements of the Training and placement Application project?",
      answer:
        "The application should have features to allow students to apply for jobs and for the training and placement department to manage applications efficiently.",
      required: true,
    },
    {
      question:
        "How would you define the target audience for the Training and placement Application?",
      answer:
        "The target audience would be both students who want to apply for jobs and the training and placement department who will be managing the applications.",
      required: true,
    },
    {
      question:
        "What are the key functionalities required in the Training and placement Application?",
      answer:
        "The application should have features for job application submission, application status tracking, and application management capabilities for the training and placement department.",
      required: true,
    },
    {
      question:
        "What is the expected timeline for the development of the Training and placement Application?",
      answer:
        "The development should be completed within a specified time frame to minimize the disruption of the current manual process.",
      required: true,
    },
    {
      question:
        "What are the technical requirements for the Training and placement Application?",
      answer:
        "The application should be web-based, user-friendly, and should support a large number of users simultaneously.",
      required: true,
    },
    {
      question:
        "What are the potential challenges or risks associated with the development of the Training and placement Application?",
      answer:
        "Some potential challenges may include integrating with existing systems, ensuring data security, and managing user authentication and authorization.",
      required: true,
    },
    {
      question:
        "What are the desired outcomes of the Training and placement Application project?",
      answer:
        "The desired outcomes are to streamline the job application process for students and improve the efficiency of application management for the training and placement department.",
      required: true,
    },
  ]);
  const [noteTitle, setNoteTitle] = useState(
    "Training and placement Application"
  );
  const [problemStatement, setProblemStatement] = useState(
    "The current manual process for students to apply for available jobs and for the training and placement department to manage applications is time-consuming and inefficient."
  );

  const handleGetSubTree = (node) => {
    if (node.children.length === 0) {
      return {
        name: node.title,
        description: node.description,
        childs: [],
      };
    }
    let newNode = {
      name: node.title,
      description: node.description,
      childs: [],
    };

    console.log(newNode);
    node.children.forEach((child) => {
      newNode.childs.push(handleGetSubTree(child));
    });
    return newNode;
  };

  const handleGenerate = async () => {
    const openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true,
    });
    // let s = `User this below context to return flow for design and not for planning format {design:[node name:.., description:..., childs:[...]...]} return in this tree format with 4 level deep and only return json  \n\n`;
    // let s = `Use below software development life cycle: design only return flow for design example: {"design":[{name:...:...,description:...,childs:[...]},...]}: (Note: response should only be in json format without any text) (Note: return flow for design only with 4 level deep) \n\n
    // give flow of design for problem statement:  streamline the job application process for students and improve communication between students, companies, and the training and placement department.
    // `
    let s = `
    create a flow for design  phase of  software development life cycle using the context of planning below and these components of design phase {Note: format should be {design:[name:"",description:"",childs:[...],...]} everything should be in this array and 4 level deep ) (Note: only return json without any text this is important)
System Architecture Design:

Component Diagram: A visual representation of the high-level components and their relationships.
System Boundary: Defining the scope of the system and its interfaces with external systems.
Platform Selection: Choosing the technology stack and platforms for development.
Database Design:

Entity-Relationship Diagrams (ERD): Illustrates the entities, attributes, and relationships within the database.
Schema Definition: Specifying the structure and constraints of database tables.
Indexing Strategy: Planning for efficient data retrieval through indexing.
User Interface (UI) Design:

Wireframes: Basic sketches of UI layouts and elements.
Mock-ups: Detailed, static representations of UI screens.
Prototypes: Interactive models of the user interface for usability testing.
Functional Design:

Use Case Diagrams: Visual representation of how users interact with the system.
Flowcharts: Diagrams showing the flow of control and data in the software.
Pseudocode: Human-readable code-like descriptions of algorithmic steps.
Algorithm Design:

Pseudocode: Algorithmic steps described in a structured, code-like manner.
Flowcharts: Diagrams illustrating the flow of logic in algorithms.
Performance Analysis: Evaluating algorithm efficiency and complexity.
Data Flow Design:

Data Flow Diagrams (DFD): Visual representation of how data moves through the system.
Data Transformation Rules: Describing how data is processed and transformed.
Data Mapping: Defining data sources, destinations, and transformations.
Security Design:

Access Control Lists (ACL): Defining who has access to what data and functions.
Encryption Algorithms: Selecting encryption methods for data protection.
Threat Modeling: Identifying potential security risks and countermeasures.
Error Handling and Recovery Design:

Exception Handling: Defining how the software should handle errors and exceptions.
Logging Mechanisms: Establishing procedures for recording errors and issues.
Backup and Recovery Plans: Strategies for data backup and system recovery.
Performance and Scalability Design:

Load Testing Plans: Strategies for evaluating the software's performance under stress.
Caching Strategies: Implementing techniques to enhance performance.
Horizontal and Vertical Scaling: Planning for system expansion.
Documentation Design:

Design Documents: Creating detailed documents that explain design decisions.
API Documentation: Describing how to use and interact with APIs.
User Manuals: Guides for users to understand and operate the software.
Integration Design:

API Specifications: Defining the structure and functionality of APIs.
Data Mapping: Matching data formats between different systems.
Message Queue Design: Establishing communication protocols for integration.


{"name":"Planning","description":"","childs":[{"name":"Project Scope","description":"Define the problem statement, goals, and objectives of the project.","childs":[{"name":"Problem Statement","description":"The current manual process for students to apply for available jobs and for the training and placement department to manage applications is time-consuming and inefficient.","childs":[]},{"name":"Goals and Objectives","description":"To streamline the job application process for students and improve communication between students, companies, and the training and placement department.","childs":[]},{"name":"Specific Requirements","description":"The application should allow students to browse and apply for available job opportunities, and it should provide an interface for the training and placement admin to manage and approve applications.","childs":[]},{"name":"Benefit to Users","description":"The project will provide students with easy access to job opportunities, while the training and placement admin will be able to efficiently manage and monitor applications, thereby enhancing the overall placement process.","childs":[]}]},{"name":"Project Timeline","description":"Define the key milestones and timeline for the project.","childs":[{"name":"Milestones","description":"Completion of the application design phase, development phase, testing phase, and deployment and launch phase.","childs":[]},{"name":"Duration","description":"Approximately 6-9 months, depending on the complexity of the application and the availability of resources.","childs":[]},{"name":"Start Date","description":"01-04-23","childs":[]},{"name":"Completion Date","description":"01-11-23","childs":[]},{"name":"Project Launch Date","description":"01-12-23","childs":[]}]},{"name":"Project Resources","description":"Identify the human resources, budget, and preferred technologies for the project.","childs":[{"name":"Human Resources","description":"A team of experienced developers, designers, quality assurance professionals, and project managers will be allocated for the development and maintenance of the application.","childs":[]},{"name":"Budget","description":"Approximately 100000Rs will be allocated for the development, maintenance, and regular updates of the application.","childs":[]},{"name":"Preferred Technologies","description":"Preferred technologies include react native, java, javascript programming language, mysql database management system, and git, github for version control.","childs":[]}]},{"name":"Project Features","description":"Define the key features of the project.","childs":[{"name":"Job Search Interface","description":"User-friendly job search interface for students.","childs":[]},{"name":"Application Management Tools","description":"Tools for the admin to manage and approve applications.","childs":[]},{"name":"Real-time Notifications","description":"Real-time notifications for students on application status.","childs":[]},{"name":"Comprehensive Dashboard","description":"A dashboard for the admin to monitor and manage applications efficiently.","childs":[]}]}]}
    `;
    const questons = currentFlowPlan.autogeneration.stage_1;
    // questons.forEach((question, i) => {
    //   // s += `\n${question.title}\n`;
    //   question.questions.forEach((question, j) => {
    //     s += `\n${question.question}\n${question.answer}\n`;
    //   });
    // });
    // console.log(questons);
    // console.log(s);
    // let newNode;
    // newNode = handleGetSubTree(currentFlowPlan.root.children[0]);
    // // console.log(JSON.stringify(newNode));
    // s += JSON.stringify({
    // planning: newNode.childs,
    // });
    // let s1 = JSON.stringify({
    //   planning: newNode.childs,
    // });

    // s1 += s
    // console.log(s);
    // setLoading(true);
    // const chatCompletion = await openai?.chat?.completions?.create({
    //   messages: [
    //     {
    //       role: "user",
    //       content: s,
    //     },
    //   ],
    //   temperature: 0.8,
    //   model: "gpt-3.5-turbo",
    // });
    // console.log(chatCompletion);
    // try {
    //   const content = chatCompletion.choices[0].message.content;
    //   const plan = JSON.parse(content);
    //   console.log(plan, content);
    //   setLoading(false);
    // } catch (err) {
    //   console.log(err);
    //   console.log(chatCompletion.choices[0].text);
    //   setLoading(false);
    // }
    setLoading(true);
    handleCreateNewTree(sample_1);
    setLoading(false);
  };
  const handleCreateNewTree = async (data) => {
    if (db === null) return;
    // const newRefId = v4();
    // const newRootTreeNode = createNode(
    //   newRefId,
    //   noteTitle,
    //   [],
    //   structuredClone(nodeThemes[Math.floor(Math.random() * nodeThemes.length)])
    // );

    // const sdlfc = [
    //   "Planning",
    //   "Design",
    //   "Development",
    //   "Testing",
    //   "Deployment",
    //   "Maintenance",
    // ];

    // sdlfc.forEach((plan) => {
    //   const newRefId = v4();
    //   const newNode = createNode(
    //     newRefId,
    //     plan,
    //     [],
    //     structuredClone(
    //       nodeThemes[Math.floor(Math.random() * nodeThemes.length)]
    //     )
    //   );
    //   newRootTreeNode.children.push(newNode);
    // });

    console.log(currentFlowPlan.root.children[1]);

    // const newNote = {
    //   refId: newRefId,
    //   title: noteTitle,
    //   root: newRootTreeNode,
    //   autogeneration: { stage_1: questons },
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };
    console.log(data.design);
    handleAddNewChildNode(data.design, currentFlowPlan.root.children[1]);

    console.log(currentFlowPlan.root.children[1]);
    handleUpdateDb(currentFlowPlan.root, currentFlowPlan.refId);
  };
  // helper function for updating database
  const handleUpdateDb = async (node, refId) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({ root: node, updatedAt: new Date() });
  };

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

  return (
    <div
      className={`${
        // when showSideNavbar is false translate sideNavbar to left
        showBottomPanel ? "translate-y-full" : ""
      } z-10 transition-all duration-200 w-[calc(100%_-_280px_-_280px)] grow-0 h-[400px] absolute bottom-0 bg-[var(--bg-primary-translucent)] text-gray-200 flex flex-col justify-center items-center gap-1 border-2 border-[var(--border-primary)]`}
    >
      <ToggleSideNavbarButton
        setShowSideNavbar={setShowBottomPanel}
        showSideNavbar={showBottomPanel}
      />
      <div className="w-full h-full flex flex-col justify-start items-center gap-1">
        <h3 className="text-lg font-bold pt-2 text-[var(--text-primary)]">
          Auto Genration Options
        </h3>
        {/* tabs */}
        <div className="w-full h-8 flex justify-center items-center gap-2">
          {tabs.map((tab, index) => (
            <button
              key={"tabs" + index}
              onClick={() => setCurrentTab(tab)}
              style={{
                backgroundColor: currentTab === tab ? "var(--bg-tertiary)" : "",
                borderColor:
                  currentTab === tab
                    ? "var(--border-primary)"
                    : "var(--border-primary)",
              }}
              className="w-fit text-[var(--text-primary)] px-2 transition-colors h-full flex justify-center items-center  border-b-2 border-[var(--border-primary)]"
            >
              {tab}
            </button>
          ))}
        </div>
        {/* content */}
        <div className="w-full overflow-y-auto h-full flex justify-center items-center gap-2">
          {currentFlowPlan?.autogeneration &&
          currentFlowPlan?.autogeneration[
            Object.keys(currentFlowPlan?.autogeneration)[
              tabs.indexOf(currentTab)
            ]
          ] ? (
            <div className="w-full h-8 flex justify-center items-center gap-2">
              <h1 className="text-[var(--text-primary)] px-2 transition-colors flex justify-center items-center  border-b-2 border-[var(--border-primary)]">
                {currentTab} Generated
              </h1>
            </div>
          ) : (
            <div className="w-full p-2 h-full flex flex-col justify-center items-center gap-2">
              <Autogeneration
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                planningQuestons={planningQuestons}
                setPlanningQuestons={setPlanningQuestons}
                noteTitle={noteTitle}
                setNoteTitle={setNoteTitle}
                problemStatement={problemStatement}
                setProblemStatement={setProblemStatement}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ToggleSideNavbarButton = ({ showSideNavbar, setShowSideNavbar }) => {
  return (
    <button
      className={`${
        // when showSideNavbar is false rotate close button to 180deg
        showSideNavbar ? "-translate-y-[34px]" : "-translate-y-[34px]"
      } outline-none transition-all duration-200 w-6 h-12 rounded-r-full absolute -rotate-90 top-0 z-10 bg-[var(--bg-tertiary)] flex justify-center items-center p-1 cursor-pointer border-r-2 border-t-2 border-b-2 border-[var(--border-primary)]`}
      onClick={() => setShowSideNavbar((prev) => !prev)}
    >
      <BackIcon />
    </button>
  );
};

const Autogeneration = ({
  currentTab,
  setCurrentTab,
  planningQuestons,
  setPlanningQuestons,
  noteTitle,
  setNoteTitle,
  problemStatement,
  setProblemStatement,
}) => {
  const [loading, setLoading] = useState(false);
  const { openai } = useStateContext();
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

  const handleGenerateQuestionForPlanning = async () => {
    if (noteTitle === "" || problemStatement === "") return;
    setLoading(true);
    let prompt = `
      Initialize:
      1. you are going to behave like a api with returns only json data
      2. you are going to  return project planning questionnaire for a software development cycle
      input:
      1. project name: ${noteTitle}
      2. problem statement: ${problemStatement}
      output:
      {["questions":["generated question","generated suggested answer"],...]}
      constraints:
      1. at least 6 to 7 questions should be generated
      2. response should stricly only in output format
      3. each element should have strictly generated question and its suggested answer
    `;

    const chatCompletion = await openai?.chat?.completions?.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    console.log(chatCompletion);
    const output = chatCompletion.choices[0].message.content;
    console.log(output);
    const questions = JSON.parse(output);
    console.log(questions);
    let tempQuestions = [];
    questions.questions.forEach((question) => {
      tempQuestions.push({
        question: question[0],
        answer: question[1],
        required: true,
      });
    });
    console.log(tempQuestions);
    setPlanningQuestons(tempQuestions);
    setLoading(false);
    setCurrentTab("Planning");
  };

  const handleGeneratePlanningSubtree = async () => {
    if (planningQuestons.length === 0) return;
    setLoading(true);
    let questions = `[\n`
    planningQuestons.forEach((q) => {
      let question = []
      question.push(q.question)
      question.push(q.answer)
      question = JSON.stringify(question)
      questions += "\n" + question
    });
    questions += "\n]"

    let prompt = `
      Initialize:
      1. you are going to behave like a api with returns only json data
      2. you are going to  create a tree structure for project planning in software development
      input:
      Below is the array to questions to be used  only as  a context to generate the output in required format :-
      ${questions}
      output:
      [
          [
            "Planning",
            "description",
            [
              "task1",
              "task2",
              ...
            ],
            [
              [
                "node1-child1",
                "description",
                [
                  "task1",
                  "task2",
                  ...
                ],
                [
                  [
                  "node1-child1",
                  "description",
                  [
                  "task1",
                  "task2",
                  ...
                  ],
                [childs]
              ],
                ]
              ],
              ...
            ]
          ],
      ...
        ]
      constraints:
      1. tree should be at least 4 to 5 level deep
      2. response should only in  output format
      3.  each node should have name, description about the node, taskslist
    `
    console.log(prompt);
    const chatCompletion = await openai?.chat?.completions?.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      model: "gpt-3.5-turbo",
    });

    console.log(chatCompletion);
    const output = chatCompletion.choices[0].message.content;
    console.log(output);
    const subtree = JSON.parse(output);
    console.log(subtree);
    // handleCreateNewTree(subtree);
    setLoading(false);
  }
  return (
    <>
      <div className="h-[250px] w-full overflow-y-auto bg-[var(--bg-secondary)] rounded-md p-2">
        <div className="flex flex-col gap-2">
          {currentTab === "Initialize" && (
            <div className="flex flex-col gap-2 bg-[var(--bg-primary)] p-2 rounded-md">
              <span className="text-[var(--text-primary)] text-sm ">
                Project Name:*
              </span>
              <input
                className="h-fit text-[var(--text-primary)] text-sm w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
                value={noteTitle}
                onChange={(e) => {
                  setNoteTitle(e.target.value);
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
              <button
                type="button"
                className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
                onClick={handleGenerateQuestionForPlanning}
              >
                {loading ? "Loading..." : "Generate Questions For Planning"}
              </button>
            </div>
          )}
          {currentTab === "Planning" && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[var(--text-primary)] text-md font-medium tracking-wider">
                Planning Questions
              </h3>
              {planningQuestons.map((question, i) => (
                <div
                  key={"question-" + i}
                  className="flex flex-col gap-2 bg-[var(--bg-primary)] p-2 rounded-md"
                >
                  <span className="text-[var(--text-primary)] text-sm ">
                    {question.question} {question.required && "*"}
                  </span>
                  <textarea
                    className="h-fit text-[var(--text-primary)] text-sm w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
                    value={question.answer}
                    onChange={(e) => {
                      let temp = [...planningQuestons];
                      temp[i].answer = e.target.value;
                      setPlanningQuestons(temp);
                    }}
                    required={question.required}
                    placeholder="Enter answer..."
                  ></textarea>
                </div>
              ))}
              <div className="flex flex-col gap-2 bg-[var(--bg-primary)] p-2 rounded-md">
                <button
                  type="button"
                  className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
                  onClick={handleGeneratePlanningSubtree}
                >
                  {loading ? "Loading..." : "Generate Planning Subtree"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BottomPanel;

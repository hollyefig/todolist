// import format from "date-fns";

const doc = document.documentElement,
  allProjectsWrapper = document.querySelector(".allProjects");

let blurBg = false,
  allProjArr = [],
  projTodayArr = [],
  projWeekArr = [],
  finishedProjArr = [],
  activeProj,
  editProj = false,
  activeProjNum;

// theme set
const theme = (() => {
  doc.className = "default";
})();

// project number counter
allProjsNum = document.getElementById("allProjsNum").childNodes[1];
allProjsNum.textContent = allProjArr.length;

// new project popup
const openNewProject = () => {
  blurBg = true;
  document.getElementById("blurBg").classList.add("blurBg");
  document.getElementById("newProjectPopup").classList.remove("displayNone");
  editProj === true
    ? (document.getElementById("createProjectButton").textContent = "Update")
    : (document.getElementById("createProjectButton").textContent =
        "Create Project");
};

const closeNewProject = () => {
  document.getElementById("blurBg").classList.remove("blurBg");
  document.getElementById("newProjectPopup").classList.add("displayNone");
  document.getElementById("newTaskPopup").classList.add("displayNone");
};
document.addEventListener("keydown", (e) => {
  if (blurBg === true) {
    e.key === "Escape" ? closeNewProject() : null;
  }
});

// construct project
const projConstruct = (name, priority, start, end) => {
  return {
    name: name,
    priority: priority,
    startDate: start,
    endDate: end,
  };
};
// create proj id
const projId = (e) => {
  let curr = e[e.length - 1];
  return (curr.id = e.length - 1);
};

// reformat date to mm/dd/yyy
const dateFormat = (e) => {
  const dateSplit = e.split("-");
  return `${dateSplit[1]}-${dateSplit[2]}-${dateSplit[0]}`;
};

// calculate days left
const daysLeftFunc = (e) => {
  const dateSplit = e.split("-");

  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date();
  const secondDate = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
};

// edit project
const editProject = (e) => {
  editProj = true;
  activeProjNum = Number(e.parentNode.parentNode.getAttribute("data-id"));
  console.log("editProj", editProj);

  const projName = document.getElementById("projName"),
    startDate = document.getElementById("startDateInput"),
    endDate = document.getElementById("endDateInput"),
    priority = document.getElementById("prioritySelect");

  let startDateSplit = allProjArr[activeProjNum].startDate.split("-");

  openNewProject();
  projName.value = allProjArr[activeProjNum].name;
  startDate.setAttribute(
    "value",
    `${startDateSplit[2]}-${startDateSplit[0]}-${startDateSplit[1]}`
  );
  endDate.value = allProjArr[activeProjNum].endDate;
  priority.value = allProjArr[activeProjNum].priority;
};

// delete project
const deleteProject = (e) => {
  const element = e.parentNode.parentNode;
  const num = Number(element.getAttribute("data-id"));
  allProjArr.splice(num, num + 1);
  element.remove();
  console.log(allProjArr);
};

// add new task popup
const addNewTask = (e) => {
  let taskPopup = document.getElementById("newTaskPopup");
  blurBg = true;
  document.getElementById("blurBg").classList.add("blurBg");
  taskPopup.classList.remove("displayNone");

  activeProj = e.parentNode.childNodes[0];
};

// create task
//
const createTask = (e) => {
  let taskName = document.getElementById("taskName").value,
    taskDesc = document.getElementById("taskDesc").value;

  // create elements
  const taskLi = document.createElement("li"),
    taskCheckDiv = document.createElement("div"),
    taskInputCheck = document.createElement("input"),
    taskNameDiv = document.createElement("div"),
    taskDescDiv = document.createElement("div");

  taskCheckDiv.setAttribute("class", "taskCheckDiv");
  taskInputCheck.setAttribute("type", "checkbox");
  taskNameDiv.setAttribute("class", "taskNameDiv");
  taskDescDiv.setAttribute("class", "taskDescDiv");

  taskNameDiv.textContent = taskName;
  taskDescDiv.textContent = taskDesc;

  // append elements
  taskCheckDiv.appendChild(taskInputCheck);
  taskLi.append(taskCheckDiv, taskNameDiv, taskDescDiv);
  activeProj.appendChild(taskLi);

  // reset
  closeNewProject();
  activeProj = null;
  document.getElementById("taskName").value = "";
  document.getElementById("taskDesc").value = "";
};

// create project
//
const createProject = (e) => {
  // if edit is active
  if (editProj === true) {
    allProjArr[activeProjNum].name = document.getElementById("projName").value;
    allProjArr[activeProjNum].priority =
      document.getElementById("prioritySelect").value;
    allProjArr[activeProjNum].startDate = dateFormat(
      document.getElementById("startDateInput").value
    );
    allProjArr[activeProjNum].endDate = dateFormat(
      document.getElementById("endDateInput").value
    );

    // grab the selected div
    let edited = document.querySelectorAll(".projNodeWrapper")[activeProjNum];

    // make edits
    edited.childNodes[0].setAttribute(
      "class",
      `projPriorityColor ${allProjArr[activeProjNum].priority}`
    );
    edited.childNodes[1].textContent = allProjArr[activeProjNum].name;
    edited.childNodes[3].textContent = allProjArr[activeProjNum].startDate;
    edited.childNodes[4].textContent = allProjArr[activeProjNum].endDate;
    edited.childNodes[5].textContent = daysLeftFunc(
      document.getElementById("endDateInput").value
    );

    // reset active proj
    activeProjNum = null;
  } else if (editProj === false) {
    let projName = document.getElementById("projName").value,
      projPriority = document.getElementById("prioritySelect").value,
      projStartDate = document.getElementById("startDateInput").value,
      projEndDate = document.getElementById("endDateInput").value;

    // days left
    const daysLeft = daysLeftFunc(projEndDate);

    // reformat dates
    projStartDate = dateFormat(projStartDate);
    projEndDate = dateFormat(projEndDate);

    // construct object
    let newProjObj = projConstruct(
      projName,
      projPriority,
      projStartDate,
      projEndDate
    );

    // create proj wrapper
    const projNodeWrapper = document.createElement("div");
    projNodeWrapper.setAttribute("class", "projNodeWrapper");

    // create divs for proj
    const projPriorityColor = document.createElement("div");
    projPriorityColor.setAttribute(
      "class",
      `projPriorityColor ${newProjObj.priority}`
    );

    // editor divs
    const projEditorWrapper = document.createElement("div");
    projEditorWrapper.setAttribute("class", "projEditorWrapper");

    const projEditButton = document.createElement("div");
    projEditButton.setAttribute(
      "class",
      "projEditButton material-symbols-outlined"
    );
    projEditButton.setAttribute("onclick", "editProject(this)");
    projEditButton.textContent = "edit";

    const projDeleteButton = document.createElement("div");
    projDeleteButton.setAttribute(
      "class",
      "projDeleteButton material-symbols-outlined"
    );
    projDeleteButton.setAttribute("onclick", "deleteProject(this)");
    projDeleteButton.textContent = "delete";

    // name, date
    const projNameDiv = document.createElement("div");
    projNameDiv.setAttribute("class", "projName");
    projNameDiv.textContent = newProjObj.name;

    const projStartDiv = document.createElement("div");
    projStartDiv.setAttribute("class", "projStartDiv");
    projStartDiv.textContent = newProjObj.startDate;

    const projEndDiv = document.createElement("div");
    projEndDiv.setAttribute("class", "projEndDiv");
    projEndDiv.textContent = newProjObj.endDate;

    const daysLeftDiv = document.createElement("div");
    daysLeftDiv.setAttribute("class", "daysLeftDiv");
    daysLeftDiv.textContent = daysLeft;

    // wrapper for tasks
    const newTaskWrapper = document.createElement("div");
    newTaskWrapper.setAttribute("class", "newTaskWrapper");
    const uList = document.createElement("ul");

    const newTaskDiv = document.createElement("div");
    newTaskDiv.setAttribute("class", "newTaskDiv");
    newTaskDiv.setAttribute("onclick", "addNewTask(this)");
    newTaskDiv.textContent = "new task +";

    // append
    newTaskWrapper.append(uList, newTaskDiv);
    projEditorWrapper.append(projEditButton, projDeleteButton);

    projNodeWrapper.append(
      projPriorityColor,
      projNameDiv,
      projEditorWrapper,
      projStartDiv,
      projEndDiv,
      daysLeftDiv,
      newTaskWrapper
    );
    allProjectsWrapper.appendChild(projNodeWrapper);

    allProjArr.push(newProjObj);

    // assign ID number to new proj
    projId(allProjArr);
    projNodeWrapper.setAttribute("data-id", newProjObj.id);
  }

  // update counter on right
  allProjsNum.textContent = allProjArr.length;
  editProj = false;
  // close popup
  closeNewProject();
  // reset inputs
  document.getElementById("projName").value = "";
  document.getElementById("startDateInput").value = "";
  document.getElementById("endDateInput").value = "";
};
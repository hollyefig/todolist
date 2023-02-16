// import format from "date-fns";

console.log(localStorage);

const doc = document.documentElement,
  allProjectsWrapper = document.querySelector(".allProjects");

let blurBg = false,
  allProjArr = [],
  activeProj,
  editProj = false,
  activeProjNum,
  nightMode = false,
  editTaskActive = false;

// theme set
const theme = (() => {
  doc.className = "default";
})();

const themeSwitch = (e) => {
  let button = e.children[2];
  nightMode === false
    ? ((button.style.left = "35px"),
      (nightMode = true),
      (doc.className = "night"))
    : ((button.style.left = "0px"),
      (nightMode = false),
      (doc.className = "default"));
};

// mobile function
const mobileFunc = (e) => {
  let allProjIcon = document.getElementById("allProjectsList").children[0],
    projTodayIcon = document.getElementById("todayList").children[0],
    projWeekIcon = document.getElementById("weekList").children[0],
    projCompletecon = document.getElementById("completedList").children[0];

  if (e.outerWidth <= 920) {
    allProjIcon.classList.add("material-symbols-outlined");
    allProjIcon.textContent = "home";
    projTodayIcon.classList.add("material-symbols-outlined");
    projTodayIcon.textContent = "today";
    projWeekIcon.classList.add("material-symbols-outlined");
    projWeekIcon.textContent = "date_range";
    projCompletecon.classList.add("material-symbols-outlined");
    projCompletecon.textContent = "task_alt";
  } else {
    allProjIcon.classList.remove("material-symbols-outlined");
    allProjIcon.textContent = "All Projects";
    projTodayIcon.classList.remove("material-symbols-outlined");
    projTodayIcon.textContent = "Today";
    projWeekIcon.classList.remove("material-symbols-outlined");
    projWeekIcon.textContent = "This Week";
    projCompletecon.classList.remove("material-symbols-outlined");
    projCompletecon.textContent = "Completed";
  }
};

// mobile read
window.addEventListener("resize", () => mobileFunc(this));
if (window.outerWidth <= 920) {
  mobileFunc(this);
}

// project number counter
let allProjsNum = document.getElementById("allProjsNum").childNodes[1],
  todayNum = document.getElementById("todayNum").childNodes[1],
  weekNum = document.getElementById("weekNum").childNodes[1],
  completedNum = document.getElementById("completedNum").childNodes[1];

allProjsNum.textContent = allProjArr.length;
todayNum.textContent = allProjArr.filter((e) => e.countdown === 1).length;
weekNum.textContent = allProjArr.filter((e) => e.countdown <= 7).length;
completedNum.textContent = allProjArr.filter((e) => e.complete === true).length;

// new project popup
const openNewProject = () => {
  blurBg = true;
  document.getElementById("blurBg").classList.add("blurBg");
  document.getElementById("newProjectPopup").classList.add("slideDown");
  editProj === true
    ? (document.getElementById("createProjectButton").textContent = "Update")
    : (document.getElementById("createProjectButton").textContent =
        "Create Project");
};

// reset inputs
const resetInputs = () => {
  document.getElementById("projName").value = "";
  document.getElementById("startDateInput").value = "";
  document.getElementById("endDateInput").value = "";
  document.getElementById("taskName").value = "";
  document.getElementById("taskDesc").value = "";
};

// close new proj
const closeNewProject = () => {
  document.getElementById("blurBg").classList.remove("blurBg");
  document.getElementById("newProjectPopup").classList.remove("slideDown");
  document.getElementById("newTaskPopup").classList.remove("slideDownTask");

  resetInputs();
  editProj = false;
};
document.addEventListener("keydown", (e) => {
  if (blurBg === true) {
    e.key === "Escape" ? closeNewProject() : null;
  }
});

// construct project object
const projConstruct = (name, priority, start, end, countdown) => {
  return {
    name: name,
    priority: priority,
    startDate: start,
    endDate: end,
    countdown: countdown,
    complete: false,
    tasks: [],
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

//mark complete
const markComplete = (e) => {
  let num = Number(e.parentNode.parentNode.getAttribute("data-id"));
  let label = e.parentNode.children[1];
  e.checked === true
    ? ((allProjArr[num].complete = true), (label.textContent = "Complete"))
    : ((allProjArr[num].complete = false), (label.textContent = "Incomplete"));

  completedNum.textContent = allProjArr.filter(
    (e) => e.complete === true
  ).length;
};

// edit project
const editProject = (e) => {
  editProj = true;
  activeProjNum = Number(e.parentNode.parentNode.getAttribute("data-id"));

  const projName = document.getElementById("projName"),
    startDate = document.getElementById("startDateInput"),
    endDate = document.getElementById("endDateInput"),
    priority = document.getElementById("prioritySelect");

  let startDateSplit = allProjArr[activeProjNum].startDate.split("-");
  let endDateSplit = allProjArr[activeProjNum].endDate.split("-");

  openNewProject();
  projName.value = allProjArr[activeProjNum].name;
  startDate.value = `${startDateSplit[2]}-${startDateSplit[0]}-${startDateSplit[1]}`;
  endDate.value = `${endDateSplit[2]}-${endDateSplit[0]}-${endDateSplit[1]}`;
  priority.value = allProjArr[activeProjNum].priority;
};

// delete project
const deleteProject = (e) => {
  const element = e.parentNode.parentNode.parentNode;
  console.log("element", element);
  const num = Number(element.getAttribute("data-id"));

  allProjArr.splice(num, 1);
  element.remove();

  // update id number on array and in element
  let allNodes = document.querySelectorAll(".projNodeWrapper");
  for (let i = 0; i < allProjArr.length; i++) {
    allProjArr[i].id = i;
    allNodes[i].setAttribute("data-id", i);
  }

  // update counter on right
  organize(allProjArr);
};

// project view adjustment
const viewAdjust = (e) => {
  let elements = document.querySelectorAll(".projNodeWrapper");
  for (i = 0; i < allProjArr.length; i++) {
    elements[i].classList.remove("displayNone");
  }

  if (e.id === "allProjectsList") {
    // update selected node
    let allNodes = e.parentNode.children;
    for (let i = 0; i < allNodes.length; i++) {
      allNodes[i].removeAttribute("class");
    }
    e.setAttribute("class", "active");

    for (i = 0; i < allProjArr.length; i++) {
      elements[i].classList.remove("displayNone");
    }
  }
  // filter week
  else if (e.id === "weekList") {
    // update selected node
    let allNodes = e.parentNode.children;
    for (let i = 0; i < allNodes.length; i++) {
      allNodes[i].removeAttribute("class");
    }
    e.setAttribute("class", "active");

    // filter
    allProjArr.filter((e) => {
      if (e.countdown >= 8) {
        elements[e.id].classList.add("displayNone");
      }
    });
  }
  // filter today
  else if (e.id === "todayList") {
    // update selected node
    let allNodes = e.parentNode.children;
    for (let i = 0; i < allNodes.length; i++) {
      allNodes[i].removeAttribute("class");
    }
    e.setAttribute("class", "active");

    // filter
    allProjArr.filter((e) => {
      if (e.countdown >= 2) {
        elements[e.id].classList.add("displayNone");
      }
    });
  }
  // filter completed
  else if (e.id === "completedList") {
    // update selected node
    let allNodes = e.parentNode.children;
    for (let i = 0; i < allNodes.length; i++) {
      allNodes[i].removeAttribute("class");
    }
    e.setAttribute("class", "active");

    // filter
    allProjArr.filter((e) => {
      if (e.complete !== true) {
        elements[e.id].classList.add("displayNone");
      }
    });
  }
};

// add new task popup
const addNewTask = (e) => {
  let taskPopup = document.getElementById("newTaskPopup");
  blurBg = true;
  document.getElementById("blurBg").classList.add("blurBg");
  taskPopup.classList.add("slideDownTask");

  if (editTaskActive === true) {
    activeProj = e;
    let currTaskName = activeProj.querySelector(".taskNameDiv").textContent,
      currTaskDesc = activeProj.querySelector(".taskDescDiv").textContent;

    taskPopup.querySelector("#taskName").value = currTaskName;
    taskPopup.querySelector("#taskDesc").value = currTaskDesc;
  } else {
    activeProj = e.parentNode.childNodes[0];
  }
};

// task constructor
const taskConstructor = (n, d) => {
  return {
    taskName: n,
    taskDesc: d,
  };
};

// edit task
const editTask = (e) => {
  editTaskActive = true;
  let idNum = parseInt(e.parentNode.parentNode.getAttribute("taskid"));
  addNewTask(e.parentNode.parentNode.parentNode.children[idNum]);
};

// delete task
const deleteTask = (e) => {
  let task = e.parentNode.parentNode,
    taskNum = parseInt(task.getAttribute("taskID")),
    projNum = parseInt(
      task.parentNode.parentNode.parentNode.getAttribute("data-id")
    ),
    projDiv = document.querySelectorAll(".projNodeWrapper")[projNum];

  // remove from array & div
  task.remove();
  allProjArr[projNum].tasks.splice(taskNum, 1);

  // reorganize IDs
  for (let i = 0; i < allProjArr[projNum].tasks.length; i++) {
    projDiv
      .querySelector(".newTaskWrapper")
      .children[0].children[i].setAttribute(
        "taskid",
        allProjArr[projNum].tasks.length - 1
      );
  }
};

// create task
////////////////////////////////////////////////////////////
const createTask = (e) => {
  if (editTaskActive === true) {
    //get form info
    let form = e.parentNode.parentNode,
      // current project ID that is active
      projNum = parseInt(
        activeProj.parentNode.parentNode.parentNode.getAttribute("data-id")
      ),
      // current active task obj to be edited
      taskObj =
        allProjArr[projNum].tasks[parseInt(activeProj.getAttribute("taskid"))];

    // update name
    taskObj.taskName = form.querySelector("#taskName").value;
    activeProj.querySelector(".taskNameDiv").textContent = taskObj.taskName;
    // update desc
    taskObj.taskDesc = form.querySelector("#taskDesc").value;
    activeProj.querySelector(".taskDescDiv").textContent = taskObj.taskDesc;
  } else {
    let taskName = e.parentNode.parentNode.children[0].children[1].value,
      taskDesc = e.parentNode.parentNode.children[1].children[1].value,
      projIdNum = parseInt(
        activeProj.parentNode.parentNode.getAttribute("data-id")
      );

    allProjArr[projIdNum].tasks.push(taskConstructor(taskName, taskDesc));

    // create elements
    const taskLi = document.createElement("li"),
      taskCheckDiv = document.createElement("div"),
      taskInputCheck = document.createElement("input"),
      taskNameDiv = document.createElement("div"),
      taskDescDiv = document.createElement("div"),
      taskEditDelDiv = document.createElement("div"),
      taskEdit = document.createElement("div"),
      taskDel = document.createElement("div");

    taskLi.setAttribute("taskID", allProjArr[projIdNum].tasks.length - 1);
    taskCheckDiv.setAttribute("class", "taskCheckDiv");
    taskInputCheck.setAttribute("type", "checkbox");
    taskNameDiv.setAttribute("class", "taskNameDiv");
    taskDescDiv.setAttribute("class", "taskDescDiv");
    taskEditDelDiv.setAttribute("class", "taskEditDelDiv");
    taskEdit.setAttribute("class", "taskEdit material-symbols-outlined");
    taskEdit.setAttribute("onclick", "editTask(this)");
    taskDel.setAttribute("class", "taskDel material-symbols-outlined");
    taskDel.setAttribute("onclick", "deleteTask(this)");

    taskNameDiv.textContent = taskName;
    taskDescDiv.textContent = taskDesc;
    taskEdit.textContent = "edit";
    taskDel.textContent = "delete";

    // append elements
    taskCheckDiv.appendChild(taskInputCheck);
    taskEditDelDiv.append(taskEdit, taskDel);
    taskLi.append(taskCheckDiv, taskNameDiv, taskDescDiv, taskEditDelDiv);
    activeProj.appendChild(taskLi);
  }

  // reset
  closeNewProject();
  activeProj = null;
  editTaskActive = false;
};

// organize into arrays by day, week, complete
const organize = (e) => {
  allProjsNum.textContent = allProjArr.length;
  todayNum.textContent = allProjArr.filter((e) => e.countdown === 1).length;
  weekNum.textContent = allProjArr.filter((e) => e.countdown <= 7).length;
};

// set local storage
const setLocalStorage = (e) => {
  console.log("set local", e);
  // Store
  window.localStorage.setItem(
    "projName1",
    JSON.stringify(allProjArr[e.length - 1].name)
  );
  // Retrieve
  let arr = JSON.parse(window.localStorage.getItem("projName1"));
  console.log("arr", arr);
};

// create project
//////////////////////////////////////////////////////////////
const createProject = (e) => {
  const form = e.parentNode.parentNode.children;
  // if edit is active
  if (editProj === true) {
    allProjArr[activeProjNum].name = form[0].children[1].value;
    allProjArr[activeProjNum].priority = form[1].children[0].value;
    allProjArr[activeProjNum].startDate = dateFormat(form[2].children[0].value);
    allProjArr[activeProjNum].endDate = dateFormat(form[3].children[0].value);
    allProjArr[activeProjNum].countdown = daysLeftFunc(
      form[3].children[0].value
    );

    // grab the selected div
    let edited = document.querySelectorAll(".projNodeWrapper")[activeProjNum];

    // make edits
    edited.children[0].setAttribute(
      "class",
      `projPriorityColor ${allProjArr[activeProjNum].priority}`
    );
    edited.children[1].textContent = allProjArr[activeProjNum].name;
    edited.children[4].textContent = allProjArr[activeProjNum].startDate;
    edited.children[5].textContent = allProjArr[activeProjNum].endDate;
    edited.children[6].textContent = daysLeftFunc(
      document.getElementById("endDateInput").value
    );

    // reset active proj
    activeProjNum = null;
  } else if (editProj === false) {
    let projName = form[0].children[1].value,
      projPriority = form[1].children[0].value,
      projStartDate = dateFormat(form[2].children[0].value),
      projEndDate = dateFormat(form[3].children[0].value);

    // days left
    const daysLeft = daysLeftFunc(form[3].children[0].value);

    // construct object
    let newProjObj = projConstruct(
      projName,
      projPriority,
      projStartDate,
      projEndDate,
      daysLeft
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

    const projCompleteDiv = document.createElement("div");
    projCompleteDiv.setAttribute("class", "projCompleteDiv");
    const projCompleteCheckbox = document.createElement("input");
    projCompleteCheckbox.setAttribute("type", "checkbox");
    projCompleteCheckbox.setAttribute("onclick", "markComplete(this)");
    projCompleteCheckbox.setAttribute("class", "markComplete");
    let checkboxLabel = document.createElement("label");
    checkboxLabel.textContent = "Incomplete";

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
    newTaskWrapper.append(uList, newTaskDiv, projEditorWrapper);
    projEditorWrapper.append(projEditButton, projDeleteButton);
    projCompleteDiv.append(projCompleteCheckbox, checkboxLabel);

    projNodeWrapper.append(
      projPriorityColor,
      projNameDiv,
      projCompleteDiv,
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
  organize(allProjArr);
  // local storage
  setLocalStorage(allProjArr);

  editProj = false;
  // close popup
  closeNewProject();
  // reset inputs
  resetInputs();
  console.log("allProjArr", allProjArr);
};

// invoke a test proj
const invokeProj = (() => {
  document.getElementById("projName").value = "Minecraft House";
  document.getElementById("prioritySelect").value = "Low";
  document.getElementById("startDateInput").value = "2023-02-05";
  document.getElementById("endDateInput").value = "2023-10-15";

  createProject(document.getElementById("createProjectButton"));

  addNewTask(document.querySelector(".newTaskDiv"));
  document.getElementById("taskName").value = "Living Room";
  document.getElementById("taskDesc").value =
    "Carpet, windows, chairs, lanterns.";
  createTask(document.getElementById("createTaskButton"));

  addNewTask(document.querySelector(".newTaskDiv"));
  document.getElementById("taskName").value = "Craft Room";
  document.getElementById("taskDesc").value =
    "2 Chests, 3 furnaces, 1 crafting table, 1 anvil.";
  createTask(document.getElementById("createTaskButton"));
})();

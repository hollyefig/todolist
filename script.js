// import format from "date-fns";

const doc = document.documentElement,
  allProjectsWrapper = document.querySelector(".allProjects");

let blurBg = false,
  allProjArr = [],
  activeProj,
  editProj = false,
  activeProjNum,
  nightMode = false;

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

// construct project object
const projConstruct = (name, priority, start, end, countdown) => {
  return {
    name: name,
    priority: priority,
    startDate: start,
    endDate: end,
    countdown: countdown,
    complete: false,
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
  const element = e.parentNode.parentNode;
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

// add new task popup
const addNewTask = (e) => {
  let taskPopup = document.getElementById("newTaskPopup");
  blurBg = true;
  document.getElementById("blurBg").classList.add("blurBg");
  taskPopup.classList.remove("displayNone");

  activeProj = e.parentNode.childNodes[0];
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

// create task
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
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

// organize into arrays by day, week, complete
const organize = (e) => {
  allProjsNum.textContent = allProjArr.length;
  todayNum.textContent = allProjArr.filter((e) => e.countdown === 1).length;
  weekNum.textContent = allProjArr.filter((e) => e.countdown <= 7).length;
};

// create project
//
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
    newTaskWrapper.append(uList, newTaskDiv);
    projEditorWrapper.append(projEditButton, projDeleteButton);
    projCompleteDiv.append(projCompleteCheckbox, checkboxLabel);

    projNodeWrapper.append(
      projPriorityColor,
      projNameDiv,
      projCompleteDiv,
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
  organize(allProjArr);

  editProj = false;
  // close popup
  closeNewProject();
  // reset inputs
  document.getElementById("projName").value = "";
  document.getElementById("startDateInput").value = "";
  document.getElementById("endDateInput").value = "";
};

// invoke
const invokeProj = (() => {
  document.getElementById("projName").value = "Project 1";
  document.getElementById("prioritySelect").value = "Low";
  document.getElementById("startDateInput").value = "2023-02-05";
  document.getElementById("endDateInput").value = "2023-02-15";
})();

const listContainer = document.querySelector("#task-container")
const listContainer2 = document.querySelector("#task-container2")
const listContainer3 = document.querySelector("#task-container3")

const STORAGE_KEY = "TODO_List"
//localStorage.removeItem(STORAGE_KEY) just incase I mess up

// I COULD NOT FIGURE OUT HOW TO USE AN SVG PROPERLY
const SVGS = {
    DELETE: '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/></svg>',
    TODO: '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M5.617 2.076a1 1 0 0 1 1.09.217L8 3.586l1.293-1.293a1 1 0 0 1 1.414 0L12 3.586l1.293-1.293a1 1 0 0 1 1.414 0L16 3.586l1.293-1.293A1 1 0 0 1 19 3v18a1 1 0 0 1-1.707.707L16 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L12 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L8 20.414l-1.293 1.293A1 1 0 0 1 5 21V3a1 1 0 0 1 .617-.924ZM9 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clip-rule="evenodd"/></svg>',
    ONGOING: '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"/></svg>',
    FINISHED: '<svg class="w-6 h-6 text-gray-200 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/></svg> '
}

let tasks = localStorage.getItem(STORAGE_KEY) || {}
if (typeof tasks === "string") {
    tasks = JSON.parse(tasks)
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function updateTaskType(taskItem, uuid, taskType) {
    tasks[uuid].TaskType = taskType

    let container = null;
    if (taskType == "TODO") {
        container = listContainer
    } else if (taskType == "ONGOING") {
        container = listContainer2
    } else if (taskType == "FINISHED") {
        container = listContainer3
    }

    container.appendChild(taskItem)
}

function addTask(taskType, uuid, title, description) {
    uuid = uuid || crypto.randomUUID()

    tasks[uuid] = {
        Title: title || "Enter task",
        Description: description || "Enter task description",
        TaskType: taskType || "TODO"
    }

    const taskItem = document.createElement("div")
    taskItem.classList.add("task-item")
    updateTaskType(taskItem, uuid, taskType)
    
    const taskItemTop = document.createElement("div")
    taskItemTop.classList.add("task-item-top")
    taskItem.appendChild(taskItemTop)

    const taskItemTitle = document.createElement("h3")
    taskItemTitle.classList.add("task-item-title")
    taskItemTitle.innerHTML = tasks[uuid].Title
    taskItemTitle.contentEditable = true
    taskItemTop.appendChild(taskItemTitle)
    taskItemTop.addEventListener("input", (event) => {
        tasks[uuid].Title = taskItemTitle.innerText
    });

    const taskItemActionContainer = document.createElement("div")
    taskItemActionContainer.classList.add("task-item-action-container")
    taskItemTop.appendChild(taskItemActionContainer)

    const actions = {["TODO"]: "svg/todo-list.svg", ["ONGOING"]: "svg/ongoing.svg", ["FINISHED"]: "svg/finished.svg",[ "DELETE"]: "svg/delete.svg"}
    for (const [action, svg] of Object.entries(actions)) {
        const taskItemAction = document.createElement("a")
        taskItemAction.classList.add("task-item-action")
        taskItemActionContainer.appendChild(taskItemAction)

        taskItemAction.innerHTML = SVGS[action]
        
        taskItemAction.addEventListener("click", (event) => {
            if (action === "DELETE") {
                delete tasks[uuid]
                taskItem.remove()
                return
            }
            
            updateTaskType(taskItem, uuid, action)
        });
    }

    const taskItemDescription = document.createElement("h4")
    taskItemDescription.classList.add("task-item-description")
    taskItemDescription.innerText = tasks[uuid].Description
    taskItemDescription.contentEditable = true
    taskItem.appendChild(taskItemDescription)

    taskItemDescription.addEventListener("input", (event) => {
        tasks[uuid].Description = taskItemDescription.innerText
    });
}

function main() {
    for (const [uuid, taskData] of Object.entries(tasks)) {
        addTask(taskData.TaskType, uuid, taskData.Title, taskData.Description)
    }

    window.addEventListener('beforeunload', function (e) {
        saveData()
    });

    setInterval(() => {
        saveData()
    }, 10)
}

main()


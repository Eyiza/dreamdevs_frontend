const taskList = document.querySelector("#task-list ul")

taskList.addEventListener("click", (event)=>{
    //console.log(event)
    if (event.target.className === "delete"){
        const li = event.target.parentNode
        li.remove()
    }
})

const searchInput = document.querySelector("#search-tasks input")
searchInput.addEventListener("input", (event)=>{
    // console.log(event.target.value)
    const searchTerm = event.target.value.toLowerCase()
    const tasks = taskList.getElementsByTagName("li")
    // console.log(tasks)
    for (task of tasks){
        const taskName = task.getElementsByTagName("span")[0].textContent.toLowerCase()
        if (taskName.includes(searchTerm)){
            task.style.display = "flex";
        } else {
            task.style.display = "none"
        }
    }
})

const form = document.querySelector("#add-task")
form.addEventListener("submit", (event)=>{
    event.preventDefault()

    const inputValue = document.querySelector("#add-task input").value.trim()
    if (!inputValue){
        alert("oga get small sense, then add a task")
        return
    }

    const { firstSpanTag, secondSpanTag, liTag } = createElement()

    firstSpanTag.textContent = inputValue;
    secondSpanTag.textContent = "delete";

    liTag.appendChild(firstSpanTag)
    liTag.appendChild(secondSpanTag)
    taskList.appendChild(liTag)

    addClassList(firstSpanTag, secondSpanTag)

    form.reset();

})

function addClassList(firstSpanTag, secondSpanTag) {
    firstSpanTag.classList.add("name")
    secondSpanTag.classList.add("delete")
}

function createElement() {
    const liTag = document.createElement("li")
    const firstSpanTag = document.createElement("span")
    const secondSpanTag = document.createElement("span")
    return { firstSpanTag, secondSpanTag, liTag }
}


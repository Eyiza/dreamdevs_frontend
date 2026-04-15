import React, { useEffect, useState } from 'react'
import styles from './taskManager.module.css'
// OR
// import './taskManager.module.css'
import { mockTaskManager } from './mockTaskManager'

const TaskManager = () => {
    const [tasks, setTasks] = useState([])
    const [input, setInput] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault() // Default form submission behavior (page refresh) is prevented
        if (!input) {
            alert("Oga get sense, then add a task")
            return
        }

        const newTask = {
            id: tasks.length + 1,
            name: input
        }
        setTasks((prev)=>([...prev, newTask]))
        setInput('')
    }

    const handleDelete = (id) => {
        const filtered = tasks.filter((task) => task.id != id) 
        setTasks(filtered)
    }

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await mockTaskManager()
                setTasks(tasks)
            } catch (error) {
                console.log("Error fetching tasks:", error)
            }
        }
        fetchTasks()
    }, [])

    const filteredTasks = tasks.filter((task) => task.name.toLowerCase().includes(searchInput.toLowerCase()))

  return (
    <div className={styles.wrapper}>
        <header>
            <div className={styles.pagebanner}>
                <h1 className={styles.title}>Task Manager</h1>

                <form className={styles.searchtasks}>
                    <input onChange={(e)=>setSearchInput(e.target.value.trim())} type="text" placeholder="Search tasks..." />
                </form>
            </div>
        </header>

        <div className={styles.tasklist}>
            <h2 className={styles.title}>Tasks to Do</h2>

            <ul>
                {
                    filteredTasks?.map((task) => (
                        <li key={task.id}>
                            <span className={styles.name}>{task.name}</span>
                            <span onClick={() => handleDelete(task.id)} className={styles.delete}>delete</span>
                        </li>
                    ))
                }
            </ul>
        </div>

        <form onSubmit={handleSubmit} className={styles.addtask}>
            <input value={input} onChange={(e)=>setInput(e.target.value.trim())} type="text" placeholder="Add a task..." />
            <button>Add</button>
        </form>

    </div>
  )
}

export default TaskManager
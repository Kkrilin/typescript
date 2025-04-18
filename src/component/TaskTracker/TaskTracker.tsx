import { useState } from "react"
import { Status } from "../../constant"
import { v4 as uuidv4 } from "uuid"

export interface Task {
    id: string,
    name: string,
    active: Status
}

const TaskTracker = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [active, setActive] = useState<number>(0)
    const [taskName, setTaskName] = useState<string>("")

    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const updatedTask = tasks.map((task) => {
            return id === task.id ? {
                ...task,
                active: task.active === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE
            } :
                task
        })
        setTasks(updatedTask)

    }

    const handleDelete = (e: React.MouseEvent<HTMLSpanElement>, id: string) => {
        const filterTask = tasks.filter((task) => id !== task.id)
        setTasks(filterTask)
    }

    const handleAdd = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        if (!taskName) {
            return
        }
        setTasks([...tasks, { id: uuidv4(), name: taskName, active: 1 }])
        setTaskName("")
    }


    const filteredTasks: Task[] = active === Status.ACTIVE ? tasks.filter(task => task.active === Status.ACTIVE) : tasks;

    return <div style={{ width: "30rem", marginTop: "5rem", backgroundColor: "white", color: "black", borderRadius: "10px", maxHeight: "85vh" }}>
        <div className="task_app">
            <div>
                <h1>Task Tracker</h1>
            </div>
            <div style={{ display: 'flex', alignItems: "center" }}>
                <form onSubmit={(e) => handleAdd(e)}>
                    <input onInput={(e) => setTaskName(e.currentTarget.value)} value={taskName} type="text" />
                    <button className="add_button" type="submit" >Add</button>
                </form>
            </div>
            <div className="filter" >
                <span onClick={() => setActive(0)} className={`filter_type  ${active === 0 ? "active" : ''}`} >All</span>
                <span onClick={() => setActive(1)} className={`filter_type ${active === 1 ? "active" : ''}`}>Active</span>
            </div>
            <div style={{ overflowY: "auto", maxHeight: "60vh" }}>
                <ul>
                    {filteredTasks.map((task, i) => (
                        <li key={i + 1} >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <input checked={!task.active} onChange={(e) => handleChecked(e, task.id)} type="checkbox" name="" id="" />
                                <h3 style={{ width: "18rem", marginLeft: "18px" }}>{task.name}</h3>
                                <span style={{ padding: "0.4rem 0.6rem ", backgroundColor: "brown", borderRadius: "6px", color: "white" }} onClick={(e) => handleDelete(e, task.id)}>X</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
}


// const Tasks


export default TaskTracker
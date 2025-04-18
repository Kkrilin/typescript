import { useState } from "react"
import { Task } from "../../App"
import { Status } from "../../constant"

interface Props {
    tasks: Task[],
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}


const TaskTracker = ({ tasks, setTasks }: Props) => {
    const [active, setActive] = useState<number>(0)
    const [taskName, setTaskName] = useState<string>("")

    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        const updatedTask = tasks.map((task, index) => {
            return i === index ? {
                ...task,
                active: task.active === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE
            } :
                task
        })
        setTasks(updatedTask)

    }

    const handleDelete = (e: React.MouseEvent<HTMLSpanElement>, i: number) => {
        const filterTask = tasks.filter((task, index) => i !== index)
        setTasks(filterTask)
    }

    const handleAdd = () => {
        setTasks([...tasks, { name: taskName, active: 1 }])
        setTaskName("")
    }


    const filteredTasks: Task[] = active ? tasks.filter(task => task.active) : tasks;

    return <div style={{ width: "30rem", marginTop: "10rem", backgroundColor: "white", color: "black", borderRadius: "10px" }}>
        <div className="task_app">
            <div>
                <h1>Task Tracker</h1>
            </div>
            <div style={{ display: 'flex', alignItems: "center" }}>
                <input onInput={(e) => setTaskName(e.target.value)} value={taskName} type="text" />
                <button onClick={() => handleAdd()} className="add_button" >Add</button>
            </div>
            <div className="filter" >
                <span onClick={() => setActive(0)} className={`filter_type  ${active === 0 ? "active" : ''}`} >All</span>
                <span onClick={() => setActive(1)} className={`filter_type ${active === 1 ? "active" : ''}`}>Active</span>
            </div>
            <div>
                <ul>
                    {filteredTasks.map((task, i) => (
                        <li key={i + 1} >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <input checked={!task.active} onChange={(e) => handleChecked(e, i)} type="checkbox" name="" id="" />
                                <h3 style={{ width: "18rem", marginLeft: "18px" }}>{task.name}</h3>
                                <span style={{ padding: "0.4rem 0.6rem ", backgroundColor: "brown", borderRadius: "6px", color: "white" }} onClick={(e) => handleDelete(e, i)}>X</span>
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
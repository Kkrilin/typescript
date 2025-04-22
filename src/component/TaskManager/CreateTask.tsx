import React, { useEffect, useState } from 'react'
import { taskBaseUrl, header } from '../../api'
import { TaskData, Priority, CreateTaskResponse, Task, Params } from '../../constant'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'sonner'
import moment from 'moment-timezone'
import { CircularProgress } from '@mui/material'

type Props = {
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
    setEditedTask: React.Dispatch<React.SetStateAction<Task | null>>
    editedTask: Task | null
    params: Params

}
const initialState = {
    priority: Priority.LOW
}
const CreateTask = ({ setTasks, setEditedTask, editedTask, params }: Props) => {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [taskData, setTaskData] = useState<TaskData>(initialState)
    const [loading, setLoading] = useState<boolean>(false)
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setTaskData(prvState => {
            return {
                ...prvState,
                [name]: value
            }
        })
    }

    useEffect(() => {
        if (editedTask && isEdit) {
            setTaskData(initialState)
        }
    }, [params])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!taskData.title || !taskData.priority || !taskData.dueDate) {
            toast.error('all data required')
            return
        }
        let url: string = taskBaseUrl
        if (editedTask && isEdit) {
            url = `${taskBaseUrl}/${editedTask.id}`
        }
        const payload: AxiosRequestConfig = {
            url,
            method: isEdit ? 'put' : 'post',
            data: taskData,
            headers: header.headers
        }
        setLoading(true)
        axios<CreateTaskResponse>(payload)
            .then((res: AxiosResponse<CreateTaskResponse>) => {
                toast.success(`${isEdit ? 'task edited' : 'task created'}`)
                setTasks(prvState => {
                    if (prvState.length === 10) {
                        prvState.pop()
                    }
                    if (isEdit) {
                        return prvState.map(t => t.id === res.data.task.id ? res.data.task : t)
                    }
                    return [res.data.task, ...prvState]
                })
                if (!isEdit && typeof localStorage.getItem('count') === 'string') {
                    const count: number = parseInt(localStorage.getItem('count') ?? '0')
                    localStorage.setItem('count', `${count + 1}`)
                }
                setTaskData(initialState)
                setEditedTask(null)
                setIsEdit(false)
            }).catch((error: AxiosError) => {
                toast.error(`failed to ${isEdit ? "update" : "create"} task ${error.message}`)
            }).finally(() => {
                setLoading(false)
            })
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsEdit(true)
        const editTask = JSON.parse(e.dataTransfer.getData("task"))
        setEditedTask(editTask)
        setTaskData(prvState => {
            if (editTask) {
                console.log(moment(editTask.dueDate).format("DD/MM/YYYY"))
                return {
                    ...prvState,
                    description: editTask.description,
                    dueDate: moment(editTask.dueDate).format("YYYY-MM-DD"),
                    title: editTask.title,
                    priority: editTask.priority
                }
            }
            return prvState
        })
        console.log('somthing drop', editTask)
    }
    console.log('taskData.dueDate', taskData.dueDate)
    return (
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} style={{ backgroundColor: "#fff", width: "40vw", borderRadius: "10px", padding: "1rem 2rem", marginTop: "2rem" }}>
            <div>
                <form onSubmit={(e) => handleSubmit(e)} action="">
                    <div className='task_field'>
                        <label htmlFor="title">Title</label>
                        <input onChange={(e) => handleInput(e)} value={taskData.title || ''} name='title' id='title' type="text" />
                    </div>
                    <div className='task_field'>
                        <label htmlFor="de">Description</label>
                        <input onChange={(e) => handleInput(e)} value={taskData.description || ''} name='description' id='title' type="text" />
                    </div>
                    <div className='task_field'>
                        <label htmlFor="priority">Priority</label>
                        <select onChange={(e) => handleInput(e)} value={taskData.priority} name='priority' id="priority">
                            <option value="low">low</option>
                            <option value="medium">medium</option>
                            <option value="high">high</option>
                        </select>
                    </div>
                    <div className='task_field'>
                        <label htmlFor="title">Due Date</label>
                        <input onChange={(e) => handleInput(e)} value={`${taskData.dueDate}`} name='dueDate' id='title' type="date" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "end" }}>
                        <button style={{ position: "relative" }} className='task_save_button'>{isEdit ? "Edit" : "Save"} {loading ? <CircularProgress style={{ position: "absolute", color: "white", left: "56%" }} size="15px" color="inherit" /> : ''}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTask;

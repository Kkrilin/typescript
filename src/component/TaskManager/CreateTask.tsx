import React, { useState } from 'react'
import { taskBaseUrl, header } from '../../api'
import { TaskData, Priority, CreateTaskResponse } from '../../constant'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

type Props = {
    setTaskData: React.Dispatch<React.SetStateAction<TaskData>>
    taskData: TaskData

}
const initialState = {
    priority: Priority.LOW
}
const CreateTask = ({ setTaskData, taskData }: Props) => {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setTaskData(prvState => {
            return {
                ...prvState,
                [name]: value
            }
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!taskData.title || !taskData.priority || !taskData.dueDate) {
            toast.error('all data required')
            return
        }
        //  typescript generic typeing wdecide what will res body will have
        axios.post<CreateTaskResponse>(taskBaseUrl, taskData, header)
            .then((res: AxiosResponse<CreateTaskResponse>) => {
                toast.success('task created')
                setTaskData(initialState)
            }).catch((error: AxiosError) => {
                toast.error(`failed to create task ${error.message}`)
            }).finally(() => {

            })
    }

    return (
        <div style={{ backgroundColor: "#fff", width: "40vw", borderRadius: "10px", padding: "1rem 2rem", marginTop: "2rem" }}>
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
                        <button className='task_save_button'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTask;

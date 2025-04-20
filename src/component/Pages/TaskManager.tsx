
import Header from '../TaskManager/Header'
import { ListTaskResponse, Params, User } from '../../constant'
import CreateTask from '../TaskManager/CreateTask'
import FilterAndSort from '../TaskManager/FilterAndSort'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Task } from '../../constant'
import ListingTask from '../TaskManager/ListingTask'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { header, taskBaseUrl } from '../../api';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';


type Props = {
    user: User
}

const TaskManager = ({ user }: Props) => {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState<Task[]>([])
    const [page, setPage] = useState<number>(1)
    const [params, setParams] = useState<Params>({})
    // const [createdTask, setCreatedTask] = useState<TaskData>(initialState)
    const [deletedTask, setDeletedTask] = useState<Task | null>(null)
    const [editedTask, setEditedTask] = useState<Task | null>(null)
    const listHeader = {
        ...header,
        params: {
            page,
            ...params
        }
    }

    const token = localStorage.getItem('token')
    header.headers = {
        ...header.headers,
        Authorization: `Bearer ${token}`
    }
    useEffect(() => {
        if (!user.id) {
            localStorage.clear()
            toast.error('please login again')
            setTimeout(() => navigate('/'), 200)
        } else {
            axios.get<ListTaskResponse>(taskBaseUrl, listHeader)
                .then((res: AxiosResponse<ListTaskResponse>) => {
                    setTasks(() => res.data.tasks.filter(t => editedTask ? editedTask.id !== t.id : t))
                    localStorage.setItem("count", JSON.stringify(res.data.count))
                }).catch((error: AxiosError) => {
                    toast.error(`something went wrong ${error.message}`)
                })
        }
    }, [page, deletedTask, params, editedTask])

    console.log('deletedTask', deletedTask)
    console.log('editedTask', editedTask)

    console.log(tasks);
    const count: number = Number(localStorage.getItem("count"))
    const startPage: number = count > 0 ? 1 + (page - 1) * tasks.length : 0;
    const endPage: number = tasks.length + (page - 1) * tasks.length < count ? tasks.length + (page - 1) * tasks.length : count
    return (
        <div>
            <Header user={user} />
            <div style={{ display: "flex", gap: "4rem", width: "90%", marginTop: "1rem", padding: "1rem 0rem", margin: "0 auto" }}>
                <div style={{ height: "850px", width: "50%", backgroundColor: "#fff", borderRadius: "10px", padding: "1rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <ListingTask setParams={setParams} tasks={tasks} setTasks={setTasks} setDeletedTask={setDeletedTask} />
                    <div style={{ display: 'flex', justifyContent: "end" }}>
                        <div style={{ display: 'flex', gap: "10px", alignItems: "center" }}>
                            <span>{startPage}</span>
                            <span>-</span>
                            <span>{endPage}</span>
                            <span>of</span>
                            <span>{count}</span>
                            <span className='pagination_arrow' onClick={() => setPage(prvState => prvState > 1 ? prvState - 1 : prvState)}>
                                <ArrowBackIcon />
                            </span>
                            <span className='pagination_arrow' onClick={() => setPage(prvState => endPage < count ? prvState + 1 : prvState)}>
                                <ArrowForwardIcon />
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <FilterAndSort setParams={setParams} />
                    <CreateTask editedTask={editedTask} setEditedTask={setEditedTask} setTasks={setTasks} />
                </div>
            </div>
        </div>
    )
}

export default TaskManager
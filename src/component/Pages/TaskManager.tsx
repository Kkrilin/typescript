
import Header from '../TaskManager/Header'
import { initialState, ListTaskResponse, Params, Priority, TaskData, User } from '../../constant'
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
    const [taskData, setTaskData] = useState<TaskData>(initialState)
    header.params = {
        page,
        ...params
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
            axios.get<ListTaskResponse>(taskBaseUrl, header)
                .then((res: AxiosResponse<ListTaskResponse>) => {
                    setTasks(res.data.tasks)
                    localStorage.setItem("count", JSON.stringify(res.data.count))
                }).catch((error: AxiosError) => {
                    toast.error(`something went wrong ${error.message}`)
                })
        }
    }, [page, taskData, params])

    console.log(tasks);
    const count: number = Number(localStorage.getItem("count"))
    const startPage: number = count > 0 ? 1 + (page - 1) * 10 : 0;
    const endPage: number = 10 + (page - 1) * 10 < count ? 10 + (page - 1) * 10 : count
    return (
        <div>
            <Header user={user} />
            <div style={{ display: "flex", gap: "4rem", width: "90%", marginTop: "1rem", padding: "1rem 0rem", margin: "0 auto" }}>
                <div style={{ height: "850px", width: "50%", backgroundColor: "#fff", borderRadius: "10px", padding: "1rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <ListingTask setParams={setParams} tasks={tasks} setTaskData={setTaskData} />
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
                    <CreateTask taskData={taskData} setTaskData={setTaskData} />
                </div>
            </div>
        </div>
    )
}

export default TaskManager
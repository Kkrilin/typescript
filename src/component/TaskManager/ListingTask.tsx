// import React from "react";
import moment from "moment-timezone";
import { initialState, Order, Task, TaskData, Params, Status } from "../../constant";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios, { AxiosError } from "axios";
import { header, taskBaseUrl } from "../../api";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  tasks: Task[]
  setDeletedTask: React.Dispatch<React.SetStateAction<Task | null>>
  setParams: React.Dispatch<React.SetStateAction<Params>>
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
};

type TaskCardProp = {
  task: Task,
  number: number
  setDeletedTask: React.Dispatch<React.SetStateAction<Task | null>>
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const ListingTask = ({ tasks, setDeletedTask, setParams, setTasks }: Props) => {
  const [prioritySort, setPrioritySort] = useState<Order>(Order.ASC)
  const [dueDateSort, setDueDateSort] = useState<Order>(Order.ASC)

  const handlePrioritySort = () => {
    setPrioritySort(state => state === Order.NONE ? Order.ASC : state === Order.ASC ? Order.DESC : Order.NONE)
    setParams((prvState => {
      return {
        ...prvState,
        prioritySort
      }
    }))
  }

  const handleDueDateSort = () => {
    setDueDateSort(state => state === Order.NONE ? Order.ASC : state === Order.ASC ? Order.DESC : Order.NONE)
    setParams((prvState => {
      return {
        ...prvState,
        dueDate: dueDateSort
      }
    }))
  }
  return (
    <table >
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Description</th>
          <th onClick={handlePrioritySort}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2rem', cursor: "pointer" }}>
              Priority&nbsp;
              {prioritySort === Order.ASC
                ? ''
                : prioritySort === Order.DESC
                  ? <KeyboardArrowUpIcon />
                  : <KeyboardArrowDownIcon />}
            </div>
          </th>
          <th onClick={handleDueDateSort}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2rem', cursor: "pointer" }}>
              Due Date&nbsp;
              {dueDateSort === Order.ASC
                ? ''
                : dueDateSort === Order.DESC
                  ? <KeyboardArrowUpIcon />
                  : <KeyboardArrowDownIcon />}
            </div>
          </th>

          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{
        tasks.map(((task, i) => <TaskCard setTasks={setTasks} setDeletedTask={setDeletedTask} key={task.id} task={task} number={i + 1} />))
      }</tbody>
    </table>
  );
};


const TaskCard = ({ task, number, setDeletedTask, setTasks }: TaskCardProp) => {
  const [doubleClick, setDoubleClick] = useState<boolean>(false)
  const token = localStorage.getItem('token')
  header.headers = {
    ...header.headers,
    Authorization: `Bearer ${token}`
  }

  const handleTaskDelete = () => {
    axios.delete(`${taskBaseUrl}/${task.id}`, header)
      .then(() => {
        toast.success('Task Deleted');
        setDeletedTask(task)
      }).catch((error) => toast.error(error.message))
  }
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDoubleClick(false)
    axios.put(`${taskBaseUrl}/${task.id}`, { status: e.target.value }, header)
      .then(() => {
        setTasks(prvState => {
          const updateTask = prvState.map(p => {
            if (p.id === task.id) {
              return {
                ...task,
                status: e.target.value
              }
            }
            return p
          })
          return updateTask
        })
      })
      .catch((error: AxiosError) => toast.error(`something went wrong ${error.message}`))
    console.log(e.target.value)
  }

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, task: Task) => {
    console.log("drag start")
    e.dataTransfer.setData('task', JSON.stringify(task))
  }

  return (
    <tr draggable onDragStart={(e) => handleDragStart(e, task)} >
      <td >{number}</td>
      <td >{task.title}</td>
      <td >{task.description}</td>
      <td >{task.priority}</td>
      <td >{moment(task.dueDate).format("YYYY/MM/DD")}</td>
      {!doubleClick && <td onDoubleClick={() => setDoubleClick(true)}>{task.status}</td>}
      {doubleClick && <td><select onChange={(e) => handleSelectChange(e)} id="priority" value={task.status}>
        <option value="pending">pending</option>
        <option value="completed">completed</option>
      </select><span style={{ marginLeft: "2px" }} onClick={() => setDoubleClick(false)}>X</span></td>}
      <td >
        <button onClick={handleTaskDelete} >
          <DeleteIcon />
        </button>
      </td>
    </tr>
  )
}

export default ListingTask;

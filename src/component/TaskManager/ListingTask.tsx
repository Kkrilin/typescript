// import React from "react";
import moment from "moment-timezone";
import { initialState, Order, Task, TaskData } from "../../constant";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios, { AxiosError } from "axios";
import { header, taskBaseUrl } from "../../api";
import { toast } from "sonner";
import { useState } from "react";
import { Params } from "react-router-dom";

type Props = {
  tasks: Task[]
  setTaskData: React.Dispatch<React.SetStateAction<TaskData>>
  setParams: React.Dispatch<React.SetStateAction<Params>>
};

type TaskCardProp = {
  task: Task,
  number: number
  setTaskData: React.Dispatch<React.SetStateAction<TaskData>>
}

const ListingTask = ({ tasks, setTaskData, setParams }: Props) => {
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2rem', cursor:"pointer" }}>
              Priority&nbsp;
              {prioritySort === Order.ASC
                ? ''
                : prioritySort === Order.DESC
                  ? <KeyboardArrowUpIcon />
                  : <KeyboardArrowDownIcon />}
            </div>
          </th>
          <th onClick={handleDueDateSort}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2rem', cursor:"pointer" }}>
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
        tasks.map(((task, i) => <TaskCard setTaskData={setTaskData} key={i + 1} task={task} number={i + 1} />))
      }</tbody>
    </table>
  );
};


const TaskCard = ({ task, number, setTaskData }: TaskCardProp) => {
  const [doubleClick, setDoubleClick] = useState<boolean>(false)
  const token = localStorage.getItem('token')
  header.headers = {
    ...header.headers,
    Authorization: `Bearer ${token}`
  }

  const handleTaskDelete = () => {
    axios.delete(`${taskBaseUrl}/${task.id}`, header)
      .then(() => {
        toast.success('task deleted')
        setTaskData(() => ({ ...initialState }))
      }).catch((error) => toast.error(error.message))
  }
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDoubleClick(false)
    axios.put(`${taskBaseUrl}/${task.id}`, { status: e.target.value }, header)
      .then(() => {
        setTaskData(() => ({ ...initialState }))
      })
      .catch((error: AxiosError) => toast.error(`something went wrong ${error.message}`))
    console.log(e.target.value)
  }

  return (
    <tr >
      <td >{number}</td>
      <td >{task.title}</td>
      <td >{task.description}</td>
      <td >{task.priority}</td>
      <td >{moment(task.dueDate).format("YYYY/MM/DD")}</td>
      {!doubleClick && <td onDoubleClick={() => setDoubleClick(true)}>{task.status}</td>}
      {doubleClick && <select onChange={(e) => handleSelectChange(e)} style={{ marginTop: "0.98rem", height: "2rem" }} id="priority" value={task.status}>
        <option value="pending">pending</option>
        <option value="completed">completed</option>
      </select>}
      <td >
        <button onClick={handleTaskDelete} >
          <DeleteIcon />
        </button>
      </td>
    </tr>
  )
}

export default ListingTask;

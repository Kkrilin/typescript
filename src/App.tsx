import TaskTracker from './component/TaskTracker/TaskTracker.tsx'
// import { Status } from './constant'
import './App.css'
import { useState } from 'react'



export interface Task {
  name: string,
  active:  0 | 1
}


function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  return (
    <TaskTracker tasks={tasks} setTasks={setTasks} />
  )
}

export default App

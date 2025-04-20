import { Routes, Route } from "react-router-dom"
import UserAuth from "../Pages/UserAuth"
import TaskManager from "../Pages/TaskManager"
import { useState } from "react"
import { User } from "../../constant"

const AppRoutes = () => {
    const [user, setUser] = useState<User>(() => {
        const userData = localStorage.getItem("userData")
        if (userData) {
            return JSON.parse(userData)
        }
        return {}
    })


    return (
        <Routes>
            <Route path="/" element={<UserAuth setUser={setUser} />} />
            <Route path="/user" element={<TaskManager user={user} />} />
        </Routes>
    )
}

export default AppRoutes
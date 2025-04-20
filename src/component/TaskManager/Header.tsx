// import axios from 'axios'
import { useNavigate, NavigateFunction } from 'react-router-dom'
// import { userAuthUrl } from '../../api'
import { User } from '../../constant'


type Props = {
    user: User
}

const Header = ({ user }: Props) => {
    const navigate: NavigateFunction = useNavigate()
    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    return (
        <header style={{ padding: "0.8rem 2rem", backgroundColor: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Tasks</h2>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h3 style={{ marginRight: "1rem" }}>{user?.name}</h3>
                    <button className='logout' onClick={() => handleLogout()}>Log out</button>
                </div>
            </div>
        </header>
    )
}

export default Header
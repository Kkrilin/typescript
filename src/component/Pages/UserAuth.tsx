import React, { useState } from 'react'
import { userAuthUrl, header } from "../../api"
import { useNavigate } from 'react-router-dom'
import { NavigateFunction } from 'react-router-dom'
import axios from 'axios'
import { User } from '../../constant'
import { toast } from 'sonner'
import { Backdrop, Button, CircularProgress } from '@mui/material'
const enum Method {
    LOG = "log",
    SIGN = "sign"
}

type Props = {
    setUser: React.Dispatch<React.SetStateAction<User>>
}

interface FormData {
    name?: string,
    email: string,
    password: string
}

const UserAuth = ({ setUser }: Props) => {
    const [method, setMethod] = useState<string>("log")
    const [formData, setFormData] = useState<FormData>({ email: "", password: "" })
    const navigate: NavigateFunction = useNavigate()
    const [open, setOpen] = useState<boolean>(false);
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget
        setFormData((prvState) => {
            return {
                ...prvState,
                [name]: value
            }
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let url: string = ''
        if (!formData.email || !formData.password) {
            toast.error('form incomplete')
            return
        }
        if (method === Method.SIGN) {
            if (!formData.name) {
                toast.error("form incomplete")
                return
            }
            url = `${userAuthUrl}/register`
        } else if (method === Method.LOG) {
            url = `${userAuthUrl}/login`
        }
        setOpen(true)
        axios.post(url, formData, header).then(res => {
            setUser(res.data.user)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userData', JSON.stringify(res.data.user))
            navigate("/user")
        }).catch((error) => toast.error(error.response.data?.message))
            .finally(() => setOpen(false))
    }

    return (
        <div className='user_auth'>
            <div style={{ padding: "2rem 1rem" }}>
                <h2 style={{ textAlign: "center", fontSize: "1.9rem" }}> TASK MANAGEMENT</h2>
                <div>
                    <div style={{ marginTop: "1.8rem", borderRadius: "10px", backgroundColor: "#f9f5ef" }}>
                        <span onClick={() => {
                            setMethod('log')
                            setFormData({ email: "", password: "" })
                        }
                        } className={`auth_span ${method === Method.LOG ? 'active_span' : ""}  span_one`}>Log in</span>
                        <span onClick={() => {
                            setFormData({ email: "", password: "" })
                            setMethod('sign')
                        }

                        } className={`auth_span  ${method === Method.SIGN ? 'active_span' : ""} span_two`}>Sign Up</span>
                    </div>
                </div>
                <form className='auth_form' onSubmit={(e) => handleSubmit(e)}>
                    {method === Method.SIGN && <input value={formData.name} onInput={(e) => handleInput(e)} name='name' type="text" placeholder='Name' />}
                    <input value={formData.email} onInput={(e) => handleInput(e)} type="text" placeholder='Email' name='email' />
                    <input value={formData.password} onInput={(e) => handleInput(e)} type="password" placeholder='Password' name='password' />
                    {/* <button type='submit'>{method === Method.LOG ? "Log in" : "Sign up"}</button> */}
                    <SimpleBackdrop open={open}  >
                        {method === Method.LOG ? "Log in" : "Sign up"}
                    </SimpleBackdrop>
                </form>
            </div>
        </div>
    )
}

type BackDropProps = {
    open: boolean
    children: string
}


function SimpleBackdrop({ children, open }: BackDropProps) {
    return (
        <div>
            <Button type='submit' variant="contained" >
                {children}
            </Button>
            <Backdrop
                sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
                open={open}
            // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default UserAuth
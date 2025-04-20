// import React from 'react'

type Props = {
    setParams: React.Dispatch<React.SetStateAction<{}>>
}

const FilterAndSort = ({ setParams }: Props) => {


    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setParams(prvState => {
            return {
                ...prvState,
                ...{ priority: e.target.value === "none" ? '' : e.target.value }
            }
        })
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setParams(prvState => {
            return {
                ...prvState,
                ...{ status: e.target.value === "none" ? '' : e.target.value }
            }
        })
    }
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams(prvState => {
            return {
                ...prvState,
                ...{ startDate: e.target.value ? e.target.value : '' }
            }
        })
    }
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams(prvState => {
            return {
                ...prvState,
                ...{ endDate: e.target.value ? e.target.value : '' }
            }
        })
    }

    return (
        <div style={{ backgroundColor: "#fff", width: "40vw", borderRadius: "10px", padding: "2rem 2rem" }}>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                <div className='filter'>
                    <h3>Filter BY :</h3>
                    <div >
                        <label htmlFor="priority">Priority</label>
                        <select onChange={(e) => handlePriorityChange(e)} id="priority" defaultValue="none    ">
                            <option value="none">none</option>
                            <option value="low">low</option>
                            <option value="medium">medium</option>
                            <option value="high">high</option>
                        </select>
                    </div>
                    <div>
                        <h3 >Due Date</h3>
                        <div style={{ display: "flex", flexDirection: "row", marginTop: "6px" }}>
                            <div style={{ width: "8rem" }}>
                                <label htmlFor="s_duedate">start Date</label>
                                <input onChange={(e) => handleStartDateChange(e)} style={{ width: "90%" }} type="date" name="" id="s_duedate" />
                            </div>
                            <div style={{ width: "8rem" }}>
                                <label htmlFor="e_duedate">end Date</label>
                                <input onChange={(e) => handleEndDateChange(e)} style={{ width: "90%" }} type="date" name="" id="e_duedate" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='sort'>
                    <div style={{ marginTop: "2rem" }}>
                        <label htmlFor="priority">Status</label>
                        <select onChange={(e) => handleStatusChange(e)} id="priority" defaultValue="none">
                            <option value="none">none</option>
                            <option value="pending">pending</option>
                            <option value="completed">completed</option>
                        </select>
                    </div>
                    <div style={{ marginTop: "2rem" }}>
                        <h3>Sort BY :</h3>
                        <div>
                            {/* <label htmlFor="priority">Priority</label> */}
                            <select id="priority" defaultValue="priority">
                                <option value="priority">priority</option>
                                <option value="duedate">duedate</option>
                            </select>
                        </div>
                    </div>
                    {/* <div>
                        <label htmlFor="f_duedate">Due Date</label>
                        <input type="date" name="" id="f_duedate" />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default FilterAndSort
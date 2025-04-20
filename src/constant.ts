
//  task tracker
export enum Status {
    PENDING= 'pending',
    COMPLETED= 'completed'
}
// priority status
export const enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

//  sorting
export const enum Order {
    ASC ="asc",
    DESC = 'desc',
    NONE =""
}

// task form data
export interface TaskData {
    title?: string,
    description?: string,
    priority?: Priority,
    dueDate?: string,
}

// user data
export interface User {
    id?: string,
    email?: string,
    name?: string,
    Tasks?: []
}

// task data
 export interface Task {
    id: string,
    title?: string,
    description?: string,
    priority?: Priority,
    dueDate?: Date,
    userId: string
    status: Status
}

export type CreateTaskResponse = {
    success: 0 | 1;
    task: Task;
  };
export type ListTaskResponse = {
    success: 0 | 1;
    tasks: Task[];
    count: number
  };

  export const initialState = {
    priority: Priority.LOW
}

export  interface Params {
    priority?: Priority,
    status?: Status,
    startDate?: string,
    endDate?: string,
    dueDate?: Order
    prioritySort?: Order 
}
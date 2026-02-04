import api from './api';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface TasksResponse {
    success: boolean;
    message: string;
    count: number;
    tasks: Task[];
}

export interface TaskResponse {
    success: boolean;
    message: string;
    task: Task;
}

export interface TaskFilters {
    status?: string;
    priority?: string;
    search?: string;
    sort?: string;
}

export const taskService = {
    async getTasks(filters?: TaskFilters): Promise<TasksResponse> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.sort) params.append('sort', filters.sort);

        const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
        return response.data;
    },

    async getTask(id: string): Promise<TaskResponse> {
        const response = await api.get<TaskResponse>(`/tasks/${id}`);
        return response.data;
    },

    async createTask(data: CreateTaskData): Promise<TaskResponse> {
        const response = await api.post<TaskResponse>('/tasks', data);
        return response.data;
    },

    async updateTask(id: string, data: UpdateTaskData): Promise<TaskResponse> {
        const response = await api.put<TaskResponse>(`/tasks/${id}`, data);
        return response.data;
    },

    async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};

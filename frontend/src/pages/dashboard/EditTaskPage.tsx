import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import type { UpdateTaskData, Task } from '../../services/taskService';
import {
    ArrowLeftIcon,
    Loader2Icon,
    AlertCircleIcon
} from 'lucide-react';

export function EditTaskPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<UpdateTaskData>({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
    });

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) return;
            try {
                const response = await taskService.getTask(id);
                const task: Task = response.task;
                setFormData({
                    title: task.title,
                    description: task.description || '',
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
                });
            } catch (err: unknown) {
                const error = err as { response?: { data?: { message?: string } } };
                setError(error.response?.data?.message || 'Failed to load task');
            } finally {
                setIsFetching(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title?.trim()) {
            setError('Title is required');
            return;
        }

        if (!id) return;

        setIsLoading(true);
        try {
            const data: UpdateTaskData = {
                ...formData,
                dueDate: formData.dueDate || undefined
            };
            await taskService.updateTask(id, data);
            navigate('/dashboard/tasks');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to update task');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2Icon className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    to="/dashboard/tasks"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Tasks
                </Link>
                <h1 className="text-2xl font-bold text-white">Edit Task</h1>
                <p className="text-gray-400 mt-1">Update your task details</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2 text-red-400">
                        <AlertCircleIcon className="size-5 shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter task description (optional)"
                        rows={4}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Due Date
                    </label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-6 py-2.5 rounded-lg transition font-medium disabled:opacity-70"
                    >
                        {isLoading && <Loader2Icon className="size-4 animate-spin" />}
                        Update Task
                    </button>
                    <Link
                        to="/dashboard/tasks"
                        className="px-6 py-2.5 text-gray-400 hover:text-white transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

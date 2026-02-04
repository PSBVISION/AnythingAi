import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import type { Task } from '../../services/taskService';
import {
    ArrowLeftIcon,
    Loader2Icon,
    EditIcon,
    TrashIcon,
    CalendarIcon,
    ClockIcon,
    AlertCircleIcon
} from 'lucide-react';

export function TaskDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) return;
            try {
                const response = await taskService.getTask(id);
                setTask(response.task);
            } catch (err: unknown) {
                const error = err as { response?: { data?: { message?: string } } };
                setError(error.response?.data?.message || 'Failed to load task');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        setIsDeleting(true);
        try {
            await taskService.deleteTask(id);
            navigate('/dashboard/tasks');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to delete task');
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            'pending': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
            'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            'completed': 'bg-green-500/20 text-green-400 border-green-500/50'
        };
        return styles[status as keyof typeof styles] || styles.pending;
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            'low': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            'medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            'high': 'bg-red-500/20 text-red-400 border-red-500/50'
        };
        return styles[priority as keyof typeof styles] || styles.medium;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2Icon className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="max-w-2xl mx-auto">
                <Link
                    to="/dashboard/tasks"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Tasks
                </Link>
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
                    <AlertCircleIcon className="size-12 text-red-400 mx-auto mb-3" />
                    <p className="text-red-400">{error || 'Task not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <Link
                    to="/dashboard/tasks"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Tasks
                </Link>
                <div className="flex gap-2">
                    <Link
                        to={`/dashboard/tasks/${id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                    >
                        <EditIcon className="size-4" />
                        Edit
                    </Link>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                    >
                        <TrashIcon className="size-4" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`text-sm px-3 py-1 rounded-full border ${getStatusBadge(task.status)}`}>
                            {task.status.replace('-', ' ')}
                        </span>
                        <span className={`text-sm px-3 py-1 rounded-full border ${getPriorityBadge(task.priority)}`}>
                            {task.priority} priority
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">{task.title}</h1>
                </div>

                <div className="p-6 space-y-6">
                    {task.description && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                            <p className="text-white whitespace-pre-wrap">{task.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {task.dueDate && (
                            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                                <CalendarIcon className="size-5 text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Due Date</p>
                                    <p className="text-white">{new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <ClockIcon className="size-5 text-gray-500" />
                            <div>
                                <p className="text-xs text-gray-500">Created</p>
                                <p className="text-white">{new Date(task.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-white mb-2">Delete Task</h3>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete "{task.title}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-70"
                            >
                                {isDeleting ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                    <TrashIcon className="size-4" />
                                )}
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

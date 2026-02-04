import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import type { Task, TaskFilters } from '../../services/taskService';
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    Loader2Icon,
    ListTodoIcon,
    TrashIcon,
    EditIcon,
    XIcon,
    CheckCircleIcon,
    AlertCircleIcon
} from 'lucide-react';

export function TasksListPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const filters: TaskFilters = {};
            if (search) filters.search = search;
            if (statusFilter) filters.status = statusFilter;
            if (priorityFilter) filters.priority = priorityFilter;

            const response = await taskService.getTasks(filters);
            setTasks(response.tasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setMessage({ type: 'error', text: 'Failed to load tasks' });
        } finally {
            setIsLoading(false);
        }
    }, [search, statusFilter, priorityFilter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchTasks]);

    const handleDelete = async () => {
        if (!deleteTaskId) return;
        setIsDeleting(true);
        try {
            await taskService.deleteTask(deleteTaskId);
            setTasks(tasks.filter(t => t._id !== deleteTaskId));
            setMessage({ type: 'success', text: 'Task deleted successfully' });
            setDeleteTaskId(null);
        } catch (error) {
            console.error('Failed to delete task:', error);
            setMessage({ type: 'error', text: 'Failed to delete task' });
        } finally {
            setIsDeleting(false);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setPriorityFilter('');
    };

    const hasActiveFilters = search || statusFilter || priorityFilter;

    const getStatusBadge = (status: string) => {
        const styles = {
            'pending': 'bg-gray-500/20 text-gray-400',
            'in-progress': 'bg-yellow-500/20 text-yellow-400',
            'completed': 'bg-green-500/20 text-green-400'
        };
        return styles[status as keyof typeof styles] || styles.pending;
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            'low': 'bg-blue-500/20 text-blue-400',
            'medium': 'bg-yellow-500/20 text-yellow-400',
            'high': 'bg-red-500/20 text-red-400'
        };
        return styles[priority as keyof typeof styles] || styles.medium;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tasks</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your tasks and stay organized</p>
                </div>
                <Link
                    to="/dashboard/tasks/new"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-4 py-2.5 rounded-lg transition font-medium"
                >
                    <PlusIcon className="size-5" />
                    New Task
                </Link>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-3 rounded-lg flex items-center justify-between ${
                    message.type === 'success' 
                        ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                        : 'bg-red-500/10 border border-red-500/50 text-red-400'
                }`}>
                    <div className="flex items-center gap-2">
                        {message.type === 'success' ? (
                            <CheckCircleIcon className="size-5" />
                        ) : (
                            <AlertCircleIcon className="size-5" />
                        )}
                        <span className="text-sm">{message.text}</span>
                    </div>
                    <button onClick={() => setMessage(null)}>
                        <XIcon className="size-4" />
                    </button>
                </div>
            )}

            {/* Search & Filters */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition ${
                            showFilters || hasActiveFilters
                                ? 'bg-primary/20 border-primary text-primary'
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                        }`}
                    >
                        <FilterIcon className="size-5" />
                        Filters
                        {hasActiveFilters && (
                            <span className="size-5 bg-primary text-black text-xs rounded-full flex items-center justify-center">
                                {[statusFilter, priorityFilter].filter(Boolean).length + (search ? 1 : 0)}
                            </span>
                        )}
                    </button>
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                            >
                                <XIcon className="size-4" />
                                Clear all
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Tasks List */}
            {isLoading ? (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                    <div className="flex items-center justify-center gap-3 text-gray-400">
                        <Loader2Icon className="size-6 animate-spin" />
                        Loading tasks...
                    </div>
                </div>
            ) : tasks.length === 0 ? (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                    <ListTodoIcon className="size-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {hasActiveFilters ? 'No matching tasks' : 'No tasks yet'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {hasActiveFilters 
                            ? 'Try adjusting your filters or search query'
                            : 'Create your first task to get started'
                        }
                    </p>
                    {hasActiveFilters ? (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            <XIcon className="size-4" />
                            Clear filters
                        </button>
                    ) : (
                        <Link
                            to="/dashboard/tasks/new"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg transition"
                        >
                            <PlusIcon className="size-4" />
                            Create Task
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Title</th>
                                    <th className="text-left text-sm font-medium text-gray-400 px-4 py-3 hidden sm:table-cell">Status</th>
                                    <th className="text-left text-sm font-medium text-gray-400 px-4 py-3 hidden md:table-cell">Priority</th>
                                    <th className="text-left text-sm font-medium text-gray-400 px-4 py-3 hidden lg:table-cell">Due Date</th>
                                    <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {tasks.map((task) => (
                                    <tr key={task._id} className="hover:bg-gray-800/50 transition">
                                        <td className="px-4 py-4">
                                            <Link to={`/dashboard/tasks/${task._id}`} className="text-white hover:text-primary transition">
                                                {task.title}
                                            </Link>
                                            {task.description && (
                                                <p className="text-sm text-gray-500 truncate max-w-xs mt-1">{task.description}</p>
                                            )}
                                            <div className="flex gap-2 mt-2 sm:hidden">
                                                <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(task.status)}`}>
                                                    {task.status}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusBadge(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 hidden md:table-cell">
                                            <span className={`text-xs px-2.5 py-1 rounded-full ${getPriorityBadge(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-400 text-sm hidden lg:table-cell">
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/dashboard/tasks/${task._id}/edit`}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    <EditIcon className="size-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteTaskId(task._id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                                >
                                                    <TrashIcon className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTaskId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-white mb-2">Delete Task</h3>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete this task? This action cannot be undone.
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
                                onClick={() => setDeleteTaskId(null)}
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

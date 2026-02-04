import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import type { Task } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import {
    ListTodoIcon,
    CheckCircle2Icon,
    ClockIcon,
    PlayCircleIcon,
    PlusIcon,
    ArrowRightIcon
} from 'lucide-react';

export function DashboardPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await taskService.getTasks();
                setTasks(response.tasks);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const stats = [
        {
            name: 'Total Tasks',
            value: tasks.length,
            icon: ListTodoIcon,
            color: 'bg-blue-500/20 text-blue-400'
        },
        {
            name: 'Completed',
            value: tasks.filter(t => t.status === 'completed').length,
            icon: CheckCircle2Icon,
            color: 'bg-green-500/20 text-green-400'
        },
        {
            name: 'In Progress',
            value: tasks.filter(t => t.status === 'in-progress').length,
            icon: PlayCircleIcon,
            color: 'bg-yellow-500/20 text-yellow-400'
        },
        {
            name: 'Pending',
            value: tasks.filter(t => t.status === 'pending').length,
            icon: ClockIcon,
            color: 'bg-gray-500/20 text-gray-400'
        }
    ];

    const recentTasks = tasks.slice(0, 5);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-gray-900 rounded-xl p-5 animate-pulse">
                            <div className="h-10 w-10 bg-gray-800 rounded-lg mb-3" />
                            <div className="h-4 w-20 bg-gray-800 rounded mb-2" />
                            <div className="h-8 w-12 bg-gray-800 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div className="bg-gradient-to-r from-primary/20 to-transparent rounded-xl p-6">
                <h1 className="text-2xl font-bold text-white">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-400 mt-1">
                    Here's what's happening with your tasks today.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                        <div className={`inline-flex p-2.5 rounded-lg ${stat.color}`}>
                            <stat.icon className="size-5" />
                        </div>
                        <p className="text-gray-400 text-sm mt-3">{stat.name}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Tasks */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                    <h2 className="text-lg font-semibold text-white">Recent Tasks</h2>
                    <Link
                        to="/dashboard/tasks"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        View all
                        <ArrowRightIcon className="size-4" />
                    </Link>
                </div>
                
                {recentTasks.length === 0 ? (
                    <div className="p-8 text-center">
                        <ListTodoIcon className="size-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No tasks yet</p>
                        <Link
                            to="/dashboard/tasks/new"
                            className="inline-flex items-center gap-2 mt-4 bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary/90 transition"
                        >
                            <PlusIcon className="size-4" />
                            Create your first task
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {recentTasks.map((task) => (
                            <Link
                                key={task._id}
                                to={`/dashboard/tasks/${task._id}`}
                                className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-2 rounded-full ${
                                        task.status === 'completed' ? 'bg-green-500' :
                                        task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'
                                    }`} />
                                    <span className="text-white">{task.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    to="/dashboard/tasks/new"
                    className="flex items-center gap-4 bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-primary/50 transition group"
                >
                    <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition">
                        <PlusIcon className="size-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">Create New Task</p>
                        <p className="text-sm text-gray-400">Add a new task to your list</p>
                    </div>
                </Link>
                <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-4 bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-primary/50 transition group"
                >
                    <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition">
                        <div className="size-6 rounded-full bg-primary text-black flex items-center justify-center font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-white">View Profile</p>
                        <p className="text-sm text-gray-400">Manage your account settings</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

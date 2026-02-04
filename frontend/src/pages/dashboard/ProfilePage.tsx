import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import {
    UserIcon,
    MailIcon,
    LockIcon,
    Loader2Icon,
    CheckCircleIcon,
    AlertCircleIcon,
    EditIcon
} from 'lucide-react';

export function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        try {
            const response = await authService.updateProfile({ name, email });
            updateUser(response.user);
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setIsEditing(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setPasswordLoading(true);

        try {
            await authService.changePassword({ currentPassword, newPassword });
            setPasswordMessage({ type: 'success', text: 'Password changed successfully' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>

            {/* Profile Card */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                                <p className="text-gray-400">{user?.email}</p>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition"
                            >
                                <EditIcon className="size-4" />
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                            message.type === 'success' 
                                ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                                : 'bg-red-500/10 border border-red-500/50 text-red-400'
                        }`}>
                            {message.type === 'success' ? (
                                <CheckCircleIcon className="size-5" />
                            ) : (
                                <AlertCircleIcon className="size-5" />
                            )}
                            <span className="text-sm">{message.text}</span>
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg transition disabled:opacity-70"
                                >
                                    {isLoading && <Loader2Icon className="size-4 animate-spin" />}
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setName(user?.name || '');
                                        setEmail(user?.email || '');
                                    }}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                                <UserIcon className="size-5 text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Full Name</p>
                                    <p className="text-white">{user?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                                <MailIcon className="size-5 text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-white">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Password Change */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Change Password</h3>
                            <p className="text-sm text-gray-400">Update your password to keep your account secure</p>
                        </div>
                        {!showPasswordForm && (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition"
                            >
                                <LockIcon className="size-4" />
                                Change
                            </button>
                        )}
                    </div>
                </div>

                {showPasswordForm && (
                    <div className="p-6">
                        {passwordMessage && (
                            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                                passwordMessage.type === 'success' 
                                    ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                                    : 'bg-red-500/10 border border-red-500/50 text-red-400'
                            }`}>
                                {passwordMessage.type === 'success' ? (
                                    <CheckCircleIcon className="size-5" />
                                ) : (
                                    <AlertCircleIcon className="size-5" />
                                )}
                                <span className="text-sm">{passwordMessage.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg transition disabled:opacity-70"
                                >
                                    {passwordLoading && <Loader2Icon className="size-4 animate-spin" />}
                                    Update Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                        setPasswordMessage(null);
                                    }}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

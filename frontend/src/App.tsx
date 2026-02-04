import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Landing Page Components
import { Banner } from "./components/banner";
import { Footer } from "./components/footer";
import LenisScroll from "./components/lenis";
import { Navbar } from "./components/navbar";
import { CtaSection } from "./sections/cta-section";
import { FaqSection } from "./sections/faq-section";
import { FeatureSection } from "./sections/feature-section";
import { HeroSection } from "./sections/hero-section";
import { LogoMarquee } from "./sections/logo-marquee";
import { TestimonialSection } from "./sections/testimonial-section";
import { WorkSection } from "./sections/work-section";

// Admin Dashboard Components
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { DashboardLayout } from './components/admin/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { TasksListPage } from './pages/dashboard/TasksListPage';
import { CreateTaskPage } from './pages/dashboard/CreateTaskPage';
import { EditTaskPage } from './pages/dashboard/EditTaskPage';
import { TaskDetailPage } from './pages/dashboard/TaskDetailPage';

function LandingPage() {
    return (
        <>
            <Banner />
            <Navbar />
            <LenisScroll />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800">
                <HeroSection />
                <LogoMarquee />
                <FeatureSection />
                <WorkSection />
                <TestimonialSection />
                <FaqSection />
                <CtaSection />
            </main>
            <Footer />
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Dashboard Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="tasks" element={<TasksListPage />} />
                        <Route path="tasks/new" element={<CreateTaskPage />} />
                        <Route path="tasks/:id" element={<TaskDetailPage />} />
                        <Route path="tasks/:id/edit" element={<EditTaskPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
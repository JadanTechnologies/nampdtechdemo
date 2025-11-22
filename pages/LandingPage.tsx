import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBranding } from '../context/BrandingContext'; // New Import

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>
        <p className="text-dark/70">{children}</p>
    </div>
);

const TechCube = ({ cubeLogoUrl }: { cubeLogoUrl: string | null }) => (
    <div className="w-64 h-64" style={{ perspective: '1000px' }}>
        {/* FIX: Corrected a typo in the transformStyle property for proper 3D rendering. */}
        <div className="relative w-full h-full animate-rotate-cube" style={{ transformStyle: 'preserve-3d' }}>
            {['translateZ(8rem)', 'rotateY(180deg) translateZ(8rem)', 'rotateY(-90deg) translateZ(8rem)', 'rotateY(90deg) translateZ(8rem)', 'rotateX(90deg) translateZ(8rem)', 'rotateX(-90deg) translateZ(8rem)'].map((transform, i) => (
                <div key={i} className="absolute w-full h-full bg-primary/20 border-2 border-secondary rounded-lg flex items-center justify-center p-4" style={{ transform, backfaceVisibility: 'hidden' }}>
                     {cubeLogoUrl ? (
                        <img src={cubeLogoUrl} alt="Brand Cube Logo" className="h-24 w-24 object-contain" />
                     ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-accent opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                            {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" />}
                            {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                            {i === 3 && <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />}
                            {i === 4 && <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />}
                            {i === 5 && <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />}
                        </svg>
                     )}
                </div>
            ))}
        </div>
    </div>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { branding, loading } = useBranding();

    useEffect(() => {
        if (!loading) {
            document.title = `${branding.brandName} Member Portal`;
        }
    }, [branding, loading]);

    const quickLogin = (email: string) => {
        navigate(`/login?email=${email}`);
    }

    const demoUsers = [
        { role: 'Member', email: 'member@test.com', color: 'blue' },
        { role: 'Chairman', email: 'chairman@test.com', color: 'green' },
        { role: 'State Admin', email: 'stateadmin@test.com', color: 'purple' },
        { role: 'Super Admin', email: 'superadmin@test.com', color: 'yellow' },
    ];

    if (loading) {
        return <div>Loading...</div>; // Or a proper spinner component
    }

    return (
        <div className="bg-light text-dark font-sans">
            {/* Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       {(branding.showLogoInHeader && branding.logoUrl) ? (
                         <img src={branding.logoUrl} alt={`${branding.brandName} Logo`} className="h-10 w-auto" />
                       ) : (
                         <div className="text-2xl font-bold text-primary">{branding.brandName}</div>
                       )}
                    </div>
                    <div className="space-x-4">
                        <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
                        <Link to="/register" className="bg-primary text-white py-2 px-5 rounded-full hover:bg-secondary transition duration-300">Register</Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="bg-white">
                <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-primary leading-tight">
                            Empowering the Nation's Mobile Technicians.
                        </h1>
                        <p className="mt-4 text-lg text-dark/80 max-w-lg mx-auto md:mx-0">
                            Join the official portal for professional development, secure registration, and community connection.
                        </p>
                        <div className="mt-8 space-x-4">
                            <Link to="/register" className="bg-accent text-primary font-bold py-3 px-8 rounded-full hover:opacity-90 transition-transform transform hover:scale-105">Become a Member</Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center items-center h-64">
                       <TechCube cubeLogoUrl={branding.cubeLogoUrl} />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-dark">The Professional's Portal</h2>
                        <p className="text-dark/70 mt-2">Everything you need, all in one place.</p>
                    </div>
                    {/* FIX: The FeatureCard component requires a `children` prop, which was missing. Added descriptive text for each feature. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard title="AI-Powered Registration" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                            Scan your NIN slip with our AI to auto-fill your details, making registration fast and error-free.
                        </FeatureCard>
                        <FeatureCard title="Digital ID & Certificate" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zM10 8a2 2 0 100-4 2 2 0 000 4z" /></svg>}>
                            Get instant access to a verifiable digital ID card and a printable certificate upon membership activation.
                        </FeatureCard>
                         <FeatureCard title="Secure Approval Workflow" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                            Our multi-level approval process ensures all members are properly vetted by local and state leadership.
                        </FeatureCard>
                         <FeatureCard title="Member Directory" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}>
                            Connect with fellow technicians across the nation through our comprehensive member directory.
                        </FeatureCard>
                        <FeatureCard title="Financial Tracking" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}>
                            Manage your payments with ease and access your financial history anytime. Admins get powerful financial overviews.
                        </FeatureCard>
                        <FeatureCard title="Profile Management" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                            Keep your personal and business information up-to-date through your personal profile page.
                        </FeatureCard>
                    </div>
                </div>
            </section>

             {/* Demo Section */}
            <section className="bg-white py-20">
                 <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-dark">Explore the Portal (Demo Access)</h2>
                    <p className="text-dark/70 mt-2 mb-8">Use the emails below to log in and test the features for each role.</p>
                     <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                         {demoUsers.map(user => (
                             <div key={user.role} className={`p-4 bg-${user.color}-100 border-l-4 border-${user.color}-500 text-left rounded-md`}>
                                 <h4 className={`text-lg font-bold text-${user.color}-800`}>{user.role}</h4>
                                 <p className="text-sm text-gray-700 font-mono break-all">{user.email}</p>
                                 <button onClick={() => quickLogin(user.email)} className={`mt-3 text-sm font-semibold text-${user.color}-700 hover:underline`}>Login &rarr;</button>
                             </div>
                         ))}
                    </div>
                 </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary text-white">
                <div className="container mx-auto px-6 py-8 text-center">
                    <div className="mb-4">
                        <p>{branding.address}</p>
                        <p>{branding.contactEmail} | {branding.contactPhone}</p>
                    </div>
                    <p>&copy; {new Date().getFullYear()} {branding.brandName}. All Rights Reserved.</p>
                    <p className="text-sm opacity-70">Empowering Mobile Phone Technicians Across the Nation.</p>
                    <p className="text-sm mt-4 opacity-50">Developed by Jadan Technologies</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
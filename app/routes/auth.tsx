// @ts-ignore
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useI18n } from "~/hooks/useI8n";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' }
])


const Auth = () => {
    const a = useI18n()
    const { isLoading, auth } = usePuterStore()

    const location = useLocation()
    const next = location.search.split('next=')[1]
    const navigate = useNavigate()

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next)
    }, [auth.isAuthenticated, next])
    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <nav className="resume-nav fixed top-0 left-0 w-full p-4">
                <Link to={'/'} className='back-button'>
                    <img src="/icons/back.svg" alt="back logo" className='w-2.5 h-2.5' />
                    <span className=' text-gray-800 text-sm font-semibold'>{a.common.backHomepage}</span>
                </Link>
            </nav>
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col gap-2 items-center text-center">
                        <h1>{a.auth.welcome}</h1>
                        <h2>{a.auth.subText}</h2>
                    </div>
                    <div className="flex items-center justify-center">
                        {
                            isLoading ? (
                                <button className="auth-button animate-pulse">{a.auth.signingIn}</button>
                            ) : (
                                <>
                                    {auth.isAuthenticated ? (
                                        <button className="auth-button" onClick={auth.signOut}>
                                            <p>{a.auth.logout}</p>
                                        </button>
                                    ) : (
                                        <button className="auth-button" onClick={auth.signIn}>
                                            <p>{a.auth.login}</p>
                                        </button>

                                    )}
                                </>
                            )
                        }
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth;
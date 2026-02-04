export const Footer = () => {
    return (
        <>
            <footer className="px-6 md:px-16 lg:px-24 xl:px-32 border-t border-gray-800">
                <div className="border-x p-8 md:p-14 border-gray-800 grid gap-12 md:grid-cols-2">
                    <div>
                        <img
                            src="/logo-mark.svg"
                            alt="Logo Mark"
                            width={30}
                            height={30}
                        />
                        <p className="mt-6 text-sm/7 max-w-sm text-gray-500">
                            Anything.ai builds autonomous AI agents capable of watching signals, making real-time decisions, and triggering actions across complex enterprise workflows.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-urbanist text-lg/8 font-semibold">
                                Solutions
                            </h4>
                            <ul className="mt-3">
                                <li className="text-sm/7 text-gray-500">
                                    <a href="#" className="hover:underline">
                                        AI Agents
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="#" className="hover:underline">
                                        Platform Features
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="#" className="hover:underline">
                                        Use Cases
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="#" className="hover:underline">
                                        Integrations
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-urbanist text-lg/8 font-semibold">
                                Company
                            </h4>
                            <ul className="mt-3">
                                <li className="text-sm/7 text-gray-500">
                                    <a href="#" className="hover:underline">
                                        About
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="#" className="hover:underline">
                                        Contact
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="#" className="hover:underline">
                                        Privacy
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="#" className="hover:underline">
                                        Terms
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="border-t border-gray-800">
                <p className="text-gray-500 py-6 text-center">
                    Copyright {new Date().getFullYear()} &copy;
                    <a href="https://psbvision.com">
                        psbvision
                    </a>{' '}
                    All Right Reserved.
                </p>
            </div>
        </>
    );
};
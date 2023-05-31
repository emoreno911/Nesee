import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="site-content bg-transparent overflow-hidden pattern-polka">
            <section className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-10">
                <div className="max-w-md px-4 mx-auto sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
                    <div>
                        <div className="flex items-center">
                            <span className="text-4xl font-bold text-white">
                                NES
                            </span>
                            <img
                                className="w-auto h-14 -ml-1"
                                src="/ico-color.svg"
                                alt="Nesee logo"
                            />
                        </div>
                        <div className="mt-10 flex flex-col items-center text-center">
                            <div className="mt-6 sm:max-w-xl">
                                <h1 className="text-3xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
                                    Create and Edit Your Own Customized NFT Bundles
                                    <span className="text-primary">.</span>
                                </h1>
                                <h2 className="mt-6 text-lg text-yellow-600 sm:text-xl">
                                    Experience the magic of nested NFTs.
                                </h2>
                            </div>
                            <div className="mt-2 w-80 space-y-4">
                                <p className="sm:pl-2.5 text-base font-black tracking-tight text-gray-800 sm:text-lg">
                                    &nbsp;
                                </p>
                                <Link to="/wallet">
                                    <button className="bg-blue-500 text-white uppercase font-bold text-lg w-full py-3 px-6 my-3 rounded-md">
                                        START HERE
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="overflow-hidden lg:relative pb-10">
                <div className="text-sm text-center text-gray-400">
                    <p>Made for the Web3athon 2023</p>
                    <p>Powered by Unique Network</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
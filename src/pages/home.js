import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="site-content bg-white overflow-hidden">
            <section className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-10">
                <div className="max-w-md px-4 mx-auto sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
                    <div>
                        <div className="flex items-center">
                            <span className="text-4xl font-bold text-gray-900">
                                nes
                            </span>
                            <img
                                className="w-auto h-12 mt-1 -ml-1"
                                src="/ico-color.svg"
                                alt="Nesee logo"
                            />
                        </div>
                        <div className="mt-14">
                            <div className="mt-6 sm:max-w-xl">
                                <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
                                    Create and Edit Your Own Customized NFT Bundles
                                    <span className="text-primary">.</span>
                                </h1>
                                <h2 className="mt-6 text-lg text-gray-500 sm:text-xl">
                                    Experience the magic of nested NFTs.
                                </h2>
                            </div>
                            <div className="mt-10 space-y-4">
                                <p className="sm:pl-2.5 text-base font-black tracking-tight text-gray-800 sm:text-lg">
                                    &nbsp;
                                </p>
                                <Link to="/playground">
                                    <button className="bg-blue-500 text-white uppercase font-bold text-lg w-full py-3 px-6 my-3 rounded-md">
                                        START HERE
                                    </button>
                                </Link>
                            </div>
                            <div className="mt-6"></div>
                        </div>
                    </div>
                </div>
                <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
                    <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                        <div className="hidden sm:block">
                            <div className="absolute inset-y-0 w-screen left-1/2 bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full"></div>
                            <svg
                                className="absolute -mr-3 top-8 right-1/2 lg:m-0 lg:left-0"
                                width="404"
                                height="392"
                                fill="none"
                                viewBox="0 0 404 392"
                            >
                                <defs>
                                    <pattern
                                        id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                                        x="0"
                                        y="0"
                                        width="20"
                                        height="20"
                                        patternUnits="userSpaceOnUse"
                                    >
                                        <rect
                                            x="0"
                                            y="0"
                                            width="4"
                                            height="4"
                                            className="text-gray-200"
                                            fill="currentColor"
                                        ></rect>
                                    </pattern>
                                </defs>
                                <rect
                                    width="404"
                                    height="392"
                                    fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                                ></rect>
                            </svg>
                        </div>
                        <div className="relative pl-4 -mr:20 sm:-mr-32 md:-mr-16 sm:mx-auto sm:max-w-3xl sm:px-0 lg:h-full lg:max-w-none lg:flex lg:items-center xl:pl-12">
                            <img
                                className="w-full rounded-l-3xl lg:w-auto 2xl:h-full 2xl:max-w-none"
                                src="/images/nft-bro.svg"
                                alt="Nesee"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <footer className="overflow-hidden lg:relative pb-10">
                <div className="text-sm text-center text-gray-700">
                    <p>Made for the Web3athon 2023</p>
                    <p>Powered by Unique Network</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
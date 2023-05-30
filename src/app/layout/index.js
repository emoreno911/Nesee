import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout({ children }) {
    return (
        <div className="bg-slate-800 font-sans w-full min-h-screen m-0">
            <Header />

            <div className="lg:container mx-auto flex flex-col sm:flex-row">
                <div className="hidden sm:block w-full sm:w-1/4 md:w-1/5">
                    <SideMenu />
                </div>
                <div className="w-full sm:w-3/4 md:w-4/5 py-4 sm:py-10 px-4">{children}</div>
            </div>
        </div>
    );
}

export default Layout;

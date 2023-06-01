import { useState } from "react";
import { useDatacontext } from "../context";

function AccountSwitch({ fontSize = "sm" }) {
    const {
        data: { balance, accounts, currentAccountIndex },
        fn: { switchWalletAccount, initAccountWithWallet },
    } = useDatacontext();

    const [isOpen, setIsOpen] = useState(false);
    const currentAccount = accounts[currentAccountIndex];

    const handleSwitchAccount = (i) => {
        switchWalletAccount(i);
        setIsOpen(false);
    };

    const handleWalletConnect = () => {
        initAccountWithWallet();
    }

    if (accounts.length < 1) {
        return (
            <button 
                className={`text-${fontSize} bg-white text-gray-700 uppercase font-bold text-xs py-1 px-3 rounded-sm border border-gray-700 hover:bg-blue-100`}
                onClick={handleWalletConnect}
            >
                Connect Wallet
            </button>
        );
    }

    return (
        <div className="inline-flex bg-white border rounded-md">
            <div className="text-center px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-l-md">
                <small>{currentAccount.name}</small>
                <div>
                    {balance.formatted} {balance.unit}
                </div>
            </div>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center h-full px-2 text-gray-600 border-l border-gray-100 hover:text-gray-700 rounded-r-md hover:bg-gray-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                <div
                    className={`${
                        isOpen ? "" : "hidden"
                    } absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg`}
                >
                    <div className="p-2">
                        {accounts.map((acc, i) => (
                            <button
                                key={acc.address}
                                onClick={() => handleSwitchAccount(i)}
                                className="w-full block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700"
                            >
                                <div>{acc.name}</div>{" "}
                                <div>{acc.addressShort}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountSwitch;

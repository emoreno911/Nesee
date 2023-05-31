import { useEffect, useState } from "react";
import { useDatacontext } from "../app/context";
import Tokens from "../app/common/Tokens";
import Layout from "../app/layout";
import OnboardingButton from "../app/common/OnboardingButton";

function Wallet() { 
    const [account, setAccount] = useState({});
    const {
        data: { accounts, currentAccountIndex },
        fn: {},
    } = useDatacontext();

    useEffect(() => {
        setAccount({})
        setTimeout(() => {
            const account = accounts[currentAccountIndex] || {};
            setAccount(account);
        }, 100);
    }, [accounts, currentAccountIndex])

    const tokens = account.address ? <Tokens owner={[account.address]} /> : null;

    return (
        <Layout>
            <div className="flex items-center justify-between mt-4 mb-2">
                <h3 className="text-gray-100 font-semibold text-xl">
                    <span>Account</span>{" "}
                    <small className="text-yellow-600 text-md">({account.addressShort})</small>
                </h3>
                <OnboardingButton />
            </div>
            { tokens }
        </Layout>
    )
}

export default Wallet
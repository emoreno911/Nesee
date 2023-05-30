import { useEffect, useState } from "react";
import { useDatacontext } from "../app/context";
import Tokens from "../app/common/Tokens";
import Layout from "../app/layout";

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
            <h3 className="text-gray-100 font-semibold text-xl mt-4">
                <span>Account</span>{" "}
                <small className="text-yellow-600 text-md">({account.addressShort})</small>
            </h3>
            { tokens }
        </Layout>
    )
}

export default Wallet
import React, {
    createContext,
    useState,
    useEffect,
    useContext
} from "react";
import { Polkadot } from "@unique-nft/utils/extension";
import Sdk from "@unique-nft/sdk";
import { baseNetworkURL } from "./utils";

const DataContext = createContext();
export const useDatacontext = () => useContext(DataContext);

const DataContextProvider = (props) => {
    const [balance, setBalance] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
    const [loaderMessage, setLoaderMessage] = useState(null);

    // currentNode is the last selected node in nestingEditor
    const [currentNode, setCurrentNode] = useState(null);

    useEffect(() => {
        const polkaAccountIndex = window.localStorage.getItem("polkaAccountIndex");
        if (polkaAccountIndex !== null) setCurrentAccountIndex(parseInt(polkaAccountIndex));

        setTimeout(() => {
            initAccountWithWallet();
        }, 1500);
    }, []);

    const initAccountWithWallet = async () => {
        const result = await Polkadot.enableAndLoadAllWallets();
        const account = result.accounts[currentAccountIndex];
		console.log(account)
        const sdk = new Sdk({
            baseUrl: baseNetworkURL,
            signer: account.uniqueSdkSigner,
        });

        const balance = await sdk.balance.get({ address: account.address });
        setBalance(balance.availableBalance);

        setAccounts(result.accounts);
    };

    const switchWalletAccount = async (newIndex) => {
        const account = accounts[newIndex];
        const sdk = new Sdk({
            baseUrl: baseNetworkURL,
            signer: account.uniqueSdkSigner,
        });

        const balance = await sdk.balance.get({ address: account.address });
        setBalance(balance.availableBalance);
        setCurrentAccountIndex(newIndex);
        window.localStorage.setItem("polkaAccountIndex", newIndex)
    };

    

    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    };

    const data = {
        currentNode,
        loaderMessage,
        currentAccountIndex,
        accounts,
        balance,
    };

    const fn = {
        isMobile,
        initAccountWithWallet,
        switchWalletAccount,
        setLoaderMessage,
        setCurrentNode
    };

    return (
        <DataContext.Provider value={{ data, fn }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;

import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useId,
} from "react";
import { Polkadot } from "@unique-nft/utils/extension";
import Sdk from "@unique-nft/sdk";
import { baseNetworkURL } from "./utils";
import {
    createCollection,
    mintNewBundle,
    mintRefungibleToken,
    nestRftTokens,
	getPiecesCount,
	sendAirdrop
} from "./unique";

const DataContext = createContext();
export const useDatacontext = () => useContext(DataContext);

const DataContextProvider = (props) => {
    const [balance, setBalance] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [currentAccountIndex, setCurrentAccountIndex] = useState(1);
    const [loaderMessage, setLoaderMessage] = useState(null);

    useEffect(() => {
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
        console.log(account);

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
    };

    

    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    };

    const data = {
        loaderMessage,
        currentAccountIndex,
        accounts,
        balance,
    };

    const fn = {
        isMobile,
        initAccountWithWallet,
        switchWalletAccount,
    };

    return (
        <DataContext.Provider value={{ data, fn }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;

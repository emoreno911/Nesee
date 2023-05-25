import { useState } from "react";
import { PopupButton } from "@typeform/embed-react";
import { useDatacontext } from "../app/context";
import { ipfsBundleImage } from "../app/utils";
import Tokens from "../app/common/Tokens";
import Layout from "../app/layout";
import ModalAbout from "../app/home/ModalAbout";
import {
    getTokenDetailInfo,
    createCollection,
    createRftCollection,
    mintRefungibleToken,
    mintNewBundle,
    nestRftTokens,
    setPermissions,
    setProperties,
    createLiveCollection,
    mintLiveNFT
} from "../app/unique";

const Button = ({ children, onClick, color = "pink" }) => (
    <button
        className={`bg-${color}-500 text-white uppercase font-bold text-sm py-3 px-6 my-3 rounded-md`}
        onClick={onClick}
    >
        {children}
    </button>
);

function Playground() {
    const {
        data: { accounts, currentAccountIndex },
        fn: {},
    } = useDatacontext();

    const account = accounts[currentAccountIndex]
    const [collectionId, setCollectionId] = useState(1575); //useState(500); //useState(486);

    const mintNewLoyaltyBundle = () => {
        console.log("minting...", accounts[currentAccountIndex]);
        const encodedAttributes = {
            name: `Bundle ${Math.floor(Math.random() * (9999 - 1000) + 1000)}`,
        };
        mintNewBundle(account, {}, collectionId, ipfsBundleImage);
    };

    const mintNewRFT = () => {
        console.log("minting...");
        mintRefungibleToken(account);
    };

    const handleNesting = () => {
        nestRftTokens(account, {
            parentCollection: 590,
            parentToken: 2,
            childCollection: 590,
            childToken: 6,
        });
    };

    const handleTypeformSubmit = ({ formId, responseId }) => {
        console.log(
            `Form ${formId} submitted, response id: ${responseId}`,
            "by user 98098-565765-76542"
        );
    };

    const updateLiveNFT = () => {
        console.log('Updating properties...')
        setProperties(account)
    }

    const newLiveCollection = () => {
        createLiveCollection(account);
    }

    const mintLiveToken = () => {
        const attrs = [0, 'Test 1'];
        mintLiveNFT(account, attrs, 1577, 'QmSwfJJnhmAseGTaki1Z8ao6jG8k9pp9nSyXkeHaYqYGMM')
    }

    return (
        <Layout>
            <h2 className="text-gray-500 font-bold text-xl my-4">Playground</h2>
            <div className="w-full shadow-md border border-white bg-white rounded p-5 my-4">
                <ul className="list-decimal pl-6">
                    <li className="pb-2">
                        <span>Create a loyalty bundle NFT</span>
                    </li>
                    <li className="pb-2">
                        <span>Create a 20 pieces RFT for the bundle</span>
                    </li>
                    <li className="pb-2">
                        <span>Send n pieces to another bundle</span>
                    </li>
                    <li className="pb-2">
                        <span>Show completion status</span>
                    </li>
                </ul>
                <div className="pt-0">
                    <Button onClick={() => updateLiveNFT()}>
                        Update Live NFT
                    </Button>{" "}
                    <Button color="blue" onClick={() => newLiveCollection(account)}>
                        New Live Collection
                    </Button>{" "}
                    <Button color="blue" onClick={() => mintLiveToken()}>
                        Mint Live Token
                    </Button>{" "}
                    <Button color="yellow" onClick={() => setPermissions(account)}>
                        Nest Tokens
                    </Button>{" "}
                    <Button color="yellow" onClick={() => getTokenDetailInfo(account, 500, 1)}>
                        Get Info
                    </Button>{" "}
                    <PopupButton
                        id="rj7duAmj"
                        className="bg-gray-700 text-white uppercase font-bold text-sm py-3 px-6 my-3 rounded-md"
                        onSubmit={handleTypeformSubmit}
                    >
                        Typeform Survey
                    </PopupButton>{" "}
                    <ModalAbout />
                </div>
            </div>

            <h3 className="text-gray-500 font-bold text-xl mt-4">
                <span>Tokens</span>{" "}
                <small className="text-sm">(Collection {collectionId})</small>
            </h3>
            <Tokens collectionIds={[collectionId]} />
        </Layout>
    );
}

export default Playground;

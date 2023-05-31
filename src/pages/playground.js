import { useState } from "react";
import { useDatacontext } from "../app/context";
import { ipfsBundleImage } from "../app/utils";
import Tokens from "../app/common/Tokens";
import Layout from "../app/layout";
import  {
    createComposableCollection,
    getTokenDetailInfo,
    setNftProperties,
    unNestTokens,
    nestTokens,
    mintNft,
    checkAllowList,
    checkAdminList,
    sendAirdrop
} from "../unique/service"
import { backgrounds, partsComposable } from "../unique/data";

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
        data: { accounts, currentAccountIndex, balance },
        fn: { setLoaderMessage },
    } = useDatacontext();

    const account = accounts[currentAccountIndex]
    const [collectionId, setCollectionId] = useState(1647);
    const [currentTokenId, setCurrentTokenId ] = useState(11);

    const handleNesting = () => {
        console.log("nesting tokens...")
        // unNestTokens(account, {
        //     parentCollection: 590,
        //     parentToken: 1,
        //     childCollection: 590,
        //     childToken: 3,
        // });
    };

    const updateLiveNFT = async () => {
        console.log('Updating properties...', currentTokenId)
        setLoaderMessage("updating properties...")
        const result = await setNftProperties(
            account,
            collectionId,
            currentTokenId,
            [
                //{ key: "a.0", value: `1` },
                //{ key: "a.1", value: `{"_":"Rand ${Date.now()}"}` },
                //{ key: "i.c", value: 'QmQCYzPwa5N4T4GGY4r5P7ybAPsiZ5YeNpzX6ikw8JAjfW' }
            ]
        )
        console.log(result)
        setLoaderMessage(null)
    }

    const updateLiveBackground = async () => {
        const res = await getTokenDetailInfo(account, collectionId, currentTokenId)
        const ipfsCid = res.tokenDetail.image.ipfsCid;
        const newImage = backgrounds.filter(b => b.ipfs !== ipfsCid);

        console.log('Updating properties...', currentTokenId)
        setLoaderMessage("updating properties...")
        const result = await setNftProperties(
            account,
            collectionId,
            currentTokenId,
            [
                { key: "i.c", value: newImage[0].ipfs }
            ]
        )
        console.log(result)
        setLoaderMessage(null)
    }

    const newLiveCollection = () => {
        console.log("creating updateable collection")
        createComposableCollection(account);
    }

    const mintLiveToken = async () => {
        setLoaderMessage("minting NFT...")
        const tokenId = await mintNft(
            account, 
            collectionId, 
            "QmSjkPY3Na5uhCryJYYKypfzq69uem6BK6Qx2m3njiaYib", 
            { type: 0, title: "Random NFT" }, 
            true
        )
        console.log(tokenId)
        setLoaderMessage(null)

        if (tokenId !== null) {
            setCurrentTokenId(tokenId);
        }
    }

    const handleGetTokenInfo = async () => {
        //console.log("getting token info...")
        setLoaderMessage("getting token info...")
        const result = await getTokenDetailInfo(account, collectionId, currentTokenId);
        console.log(result)
        setLoaderMessage(null)
    }

    const handleAllowList = async () => {
        console.log('checking allow list...')
        //const result = await checkAdminList(account, collectionId);
        const result = await checkAllowList(account, collectionId);
        console.log(result)
    }

    const handleOnboarding = async () => {
        // send airdrop
        setLoaderMessage("sending onboard airdrop...")
        if (parseInt(balance.amount) < 10) {
            const airdrop = await sendAirdrop(account.address);
        } else {
            console.log("no airdrop needed!");
        }
            
        // add user to allow list for mint
        setLoaderMessage("approving mint permissions...")
        const allow = await checkAllowList(account, collectionId);

        // mint body items, 1 background and 2 bundle containers
        setLoaderMessage("minting test nfts, this might take a few minutes...")
        const nfts = [{type: 0, ipfs: "QmQCYzPwa5N4T4GGY4r5P7ybAPsiZ5YeNpzX6ikw8JAjfW", title: "Bundle Container"}];
        
        await batchMint(nfts)
        setLoaderMessage(null)
    }

    let len = 0;
    const batchMint = async (data) => {
        const { ipfs, type, title } = data[len];
        console.log('Procesing...', title)
        setLoaderMessage(`minting ${len} of ${data.length} test nfts, this might take a few minutes...`)
        await mintNft(account, collectionId, ipfs, {type, title}, true);
        len++
        if (len < data.length) {
            await batchMint(data)
        }
        else {
            console.log('finish!')
            return;
        }
    }

    return (
        <Layout>
            <h2 className="text-gray-500 font-bold text-xl my-4">Playground</h2>
            <div className="w-full shadow-md border border-white bg-white rounded p-5 my-4">
                <div className="pt-0">
                    <Button color="yellow" onClick={() => newLiveCollection()}>
                        Get Info
                    </Button>{" "}
                    <Button color="blue" onClick={() => mintLiveToken()}>
                        Mint Live Token
                    </Button>{" "}
                    <Button onClick={() => updateLiveBackground()}>
                        Update Live NFT
                    </Button>{" "}
                    <Button color="red" onClick={() => handleAllowList()}>
                        Check Allow List
                    </Button>{" "}
                    <Button color="yellow" onClick={() => handleNesting()}>
                        Nest Tokens
                    </Button>{" "}
                    <Button color="green" onClick={() => handleOnboarding()}>
                        Onboard User
                    </Button>{" "}
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

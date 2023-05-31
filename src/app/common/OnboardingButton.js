import { useEffect, useState } from "react";
import { useDatacontext } from "../../app/context";
import { partsComposable } from "../../unique/data";
import  {
    mintNft,
    checkAllowList,
    sendAirdrop
} from "../../unique/service"
import Button from "./Button";


const OnboardingButton = () => {
    const {
        data: { accounts, currentAccountIndex, balance },
        fn: { setLoaderMessage },
    } = useDatacontext();

    const account = accounts[currentAccountIndex]
    const [collectionId, setCollectionId] = useState(1648);
    const [mintedNfts, setMintedNfts] = useState(0);

    useEffect(() => {
        const num = window.localStorage.getItem("mintedNfts") || 0;
        setMintedNfts(parseInt(num));
    }, [])

    const setCounter = (num) => {
        window.localStorage.setItem("mintedNfts", num);
        setMintedNfts(num)
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

        // mint body items, 2 background and 2 bundle containers
        setLoaderMessage("minting test nfts, this might take a few minutes...")
        const nfts = partsComposable;
        
        await batchMint(nfts, mintedNfts)
        setLoaderMessage(null)
    }

    const batchMint = async (data, count) => {
        const { ipfs, type, title } = data[count];
        console.log('Procesing...', title)
        setLoaderMessage(`minting ${count} of ${data.length} test nfts, this might take a few minutes...`)
        await mintNft(account, collectionId, ipfs, {type, title}, true);
        
        count++
        setCounter(count)

        if (count < data.length) {
            await batchMint(data, count)
        }
        else {
            console.log('finish!')
            return;
        }
    }

    if (mintedNfts >= partsComposable.length) {
        return null;
    }

    return (
        <Button onClick={() => handleOnboarding()}>
            <span>Mint Test Tokens</span>
        </Button>
    );
};

export default OnboardingButton;

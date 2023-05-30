import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDatacontext } from "../app/context";
import { fallbackNoImage, isDynamicBackground, unrollBundle } from "../app/utils";
import { getTokenDetailInfo, setNftProperties } from "../unique/service";
import Layout from "../app/layout";
import NestingVizTree from "../app/common/NestingVizTree";
import Loader from "../app/common/Loader";
import Button from "../app/common/Button";
import { backgrounds } from "../unique/data";

function Detail() {
    const {
        data: { accounts, currentAccountIndex },
        fn: { setLoaderMessage },
    } = useDatacontext();

    const { type, tokenInfo } = useParams();
    const [collectionId, tokenId] = tokenInfo.split("_");

    const [tokenDetail, setTokenDetail] = useState({});
    const [bundleInfo, setBundleInfo] = useState([]);

    useEffect(() => {
        getDetails()
    }, [tokenInfo, accounts]);

    const getDetails = async () => {
        //console.log(type, collectionId, tokenId)
        const account = accounts[currentAccountIndex];
        if (!account) return;

        const { tokenDetail, bundleInfo } = await getTokenDetailInfo(
            account,
            collectionId,
            tokenId,
            type
        );

        console.log(bundleInfo);
        setTokenDetail(tokenDetail);
        //unroll(bundleInfo);

        const arr = unrollBundle(bundleInfo);
        setBundleInfo(arr);
    };

    const updateLiveBackground = async () => {
        const isConfirm = window.confirm(
            `Do you want to update this dynamic token?`
        );
        if (!isConfirm) return; 

        const account = accounts[currentAccountIndex]
        const ipfsCid = tokenDetail.image.ipfsCid;
        const newImage = backgrounds.filter(b => b.ipfs !== ipfsCid);
        const rand_0_1 = Date.now()%2;

        console.log('Updating properties...', tokenId)
        setLoaderMessage("updating properties...")
        const result = await setNftProperties(
            account,
            collectionId,
            tokenId,
            [
                { key: "a.1", value: `{"_":"${newImage[rand_0_1].title}"}` },
                { key: "i.c", value: newImage[rand_0_1].ipfs }
            ]
        )
        console.log(result)
        setLoaderMessage(null)
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    if (Object.keys(tokenDetail).length === 0) {
        return (
            <Layout>
                <Loader />
            </Layout>
        );
    }

    return (
        <Layout>
            <h2 className="text-gray-100 font-semibold text-xl my-4">
                Token Detail
            </h2>
            <div className="relative w-full lg:max-w-full lg:flex my-2 p-4 shadow-md border border-slate-900 bg-darkdeep rounded my-4">
                <div className="flex items-center bg-cover text-center overflow-hidden">
                    <img
                        src={tokenDetail.image.fullUrl || fallbackNoImage}
                        alt=""
                        className="h-72 w-auto"
                    />
                </div>
                <div className="pl-6 flex flex-col flex-1">
                    <div className="mb-2">
                        <span className="inline-block py-1 leading-none text-yellow-600 uppercase tracking-wide text-xs">
                            {type}
                        </span>
                        <div className="text-gray-100 font-bold text-4xl">
                            {tokenDetail.collection.tokenPrefix} #{tokenId}
                        </div>
                        <div className="text-gray-100 my-4">
                            <span>{tokenDetail.collection.name}</span>{" "}
                            <span>({collectionId})</span>
                        </div>

                        <div className="mb-1">
                            <span className="inline-block py-1 leading-none text-yellow-600 uppercase tracking-wide text-xs">
                                Attributes
                            </span>
                        </div>
                        <table className="table text-gray-100 text-left w-full">
                            <tbody>
                                {Object.keys(tokenDetail.attributes).map(
                                    (key) => (
                                        <tr key={key}>
                                            <th>
                                                {
                                                    tokenDetail.attributes[key]
                                                        .name._
                                                }
                                            </th>
                                            <td className="pl-2">
                                                <input 
                                                    readOnly 
                                                    type="text" 
                                                    className="w-full bg-transparent outline-0"  
                                                    value={tokenDetail.attributes[key].value._} 
                                                />
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>

                        <div className="mt-4">  
                            {!isDynamicBackground(collectionId, tokenDetail.attributes) ? "" : (
                                <Button onClick={() => updateLiveBackground()}>
                                    <span>Update Dynamic NFT</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="text-red-400 inline ml-2 w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </Button>                                   
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <h2 className="text-gray-100 font-semibold text-xl my-4">
                Bundle Diagram
            </h2>
            <div className="w-full shadow-md border border-slate-900 bg-darkdeep rounded my-4" style={{height: "500px"}}>
                <NestingVizTree treeData={bundleInfo} currentNode={{tokenId, collectionId}} />
            </div>
        </Layout>
    );
}

export default Detail;

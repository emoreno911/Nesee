import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDatacontext } from "../app/context";
import { fallbackNoImage } from "../app/utils";
import { getTokenDetailInfo } from "../unique/service";
import Layout from "../app/layout";
import NestingVizTree from "../app/common/NestingVizTree";
import Loader from "../app/common/Loader";

function Detail() {
    const {
        data: { accounts, currentAccountIndex },
        fn: {  },
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
        unroll(bundleInfo);
    };

    const unroll = (bundle) => {
        const arr = [];
        const getNodes = (children, parentCollection, parentId) => {
            children.forEach((el) => {
                const { tokenId, collectionId, nestingChildTokens } = el;
                const isBundle = el.hasOwnProperty('nestingChildTokens');
                if (isBundle)
                    getNodes(nestingChildTokens, collectionId, tokenId);

                arr.push({ tokenId, collectionId, parentCollection, parentId, isBundle });
            });
        };

        // set main node
        arr.push({tokenId: bundle.tokenId, collectionId: bundle.collectionId, parentCollection: 0, parentId: 0, isBundle:true});
        // get children nodes
        getNodes(
            bundle.nestingChildTokens,
            bundle.collectionId,
            bundle.tokenId
        );
        console.log(arr);
        setBundleInfo(arr);
    };

    if (Object.keys(tokenDetail).length === 0) {
        return (
            <Layout>
                <Loader />
            </Layout>
        );
    }

    return (
        <Layout>
            <h2 className="text-gray-500 font-bold text-xl my-4">
                Token Detail
            </h2>
            <div className="relative w-full lg:max-w-full lg:flex my-2 p-4 shadow-md border border-white bg-white rounded my-4">
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
                        <div className="text-gray-900 font-bold text-4xl">
                            {tokenDetail.collection.tokenPrefix} #{tokenId}
                        </div>
                        <div className="my-4">
                            <span>{tokenDetail.collection.name}</span>{" "}
                            <span>({collectionId})</span>
                        </div>

                        <div className="mb-1">
                            <span className="inline-block py-1 leading-none text-yellow-600 uppercase tracking-wide text-xs">
                                Attributes
                            </span>
                        </div>
                        <table className="table- text-left w-full">
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
                                                    className="w-full outline-0"  
                                                    value={tokenDetail.attributes[key].value._} 
                                                />
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <h2 className="text-gray-500 font-bold text-xl my-4">
                Bundle Diagram
            </h2>
            <div className="w-full shadow-md border border-white bg-white rounded my-4" style={{height: "500px"}}>
                {/* <pre>{JSON.stringify(bundleInfo, null, 2)}</pre> */}
                <NestingVizTree treeData={bundleInfo} currentNode={{tokenId, collectionId}} />
            </div>
        </Layout>
    );
}

export default Detail;

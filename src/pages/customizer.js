import { useState } from "react";
import { useDatacontext } from "../app/context";
import Layout from "../app/layout";
import NestingEditor from "../app/editor/NestingEditor";

const getData = () => {
    const data =
        '[{"tokenId":2,"collectionId":590,"parentCollection":0,"parentId":0,"isBundle":true},{"tokenId":6,"collectionId":590,"parentCollection":590,"parentId":2,"isBundle":false},{"tokenId":4,"collectionId":523,"parentCollection":590,"parentId":5,"isBundle":false},{"tokenId":3,"collectionId":523,"parentCollection":590,"parentId":5,"isBundle":false},{"tokenId":5,"collectionId":523,"parentCollection":590,"parentId":5,"isBundle":false},{"tokenId":5,"collectionId":590,"parentCollection":590,"parentId":2,"isBundle":true}]';
    return JSON.parse(data);
};

function BundleEditor() {
    const {
        data: { accounts, currentAccountIndex },
        fn: {},
    } = useDatacontext();

    const [bundle, setBundle] = useState(getData()); //useState(500); //useState(486);

    const rebuildTree = (data) => {
        setBundle([])
        console.log(data)
        setTimeout(() => {
            setBundle(data)
        }, 500);
    }

    return (
        <Layout>
            <h2 className="text-gray-500 font-bold text-xl my-4">
                Bundle Editor
            </h2>
            <div className="w-full shadow-md border border-white bg-white rounded p-5 my-4">
                <ul className="list-decimal pl-6">
                    <li className="pb-2">
                        <span>Create a loyalty bundle NFT</span>
                    </li>
                    <li className="pb-2">
                        <span>Create a 20 pieces RFT for the bundle</span>
                    </li>
                </ul>
            </div>

            <h3 className="text-gray-500 font-bold text-xl mt-4">
                <span>Tokens</span>
            </h3>
            <div
                className="w-full shadow-md border border-white bg-white rounded my-4"
                style={{ height: "500px" }}
            >
                <NestingEditor treeData={bundle} rebuildTree={rebuildTree} />
            </div>
        </Layout>
    );
}

export default BundleEditor;

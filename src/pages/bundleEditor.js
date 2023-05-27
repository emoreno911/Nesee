import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDatacontext } from "../app/context";
import { graphqlEndpoint, tokensQuery } from "../unique/queries";
import Layout from "../app/layout";
import Loader from "../app/common/Loader";
import EmptyState from "../app/common/EmptyState";
import NestingEditor from "../app/editor/NestingEditor";
import { getBundleInfo } from "../unique/service";
import { unrollBundle } from "../app/utils";


function EditorContainer({ account }) {
    const owner = account.address;
    const [bundle, setBundle] = useState([]);
    const { data, isLoading, error } = useQuery("tokens", async () => {
        return axios({
            url: graphqlEndpoint,
            method: "POST",
            data: {
                query: tokensQuery(owner),
            },
        }).then((response) => response.data.data);
    });

    useEffect(() => {
        if (!data) return;

        const _data = data.tokens.data.map(o => {
            const tokenId = o.token_id;
            const collectionId = o.collection_id;
            const parentCollection = 0;
            const parentId = 0;
            const isBundle = o.children_count > 0;
            const tokenName = o.token_name;
            const image = o.image.fullUrl;
            const nodeId = `${collectionId}_${tokenId}`;
            return { nodeId, tokenName, tokenId, collectionId, parentCollection, parentId, isBundle }
        })

        const _bundles = _data.filter(o => o.isBundle).map(o => getBundleInfo(account, o.collectionId, o.tokenId));
        Promise.all(_bundles).then(values => {
            let arr = [];
            values.forEach(bundle => {
                const b = unrollBundle(bundle);
                const c = b.map(o => {
                    o.nodeId = `${o.collectionId}_${o.tokenId}`;
                    return o;
                })
                // include tokenname with unionBy
                arr = [...arr, ...c]
            })

            const res = _.unionBy(arr, _data, 'nodeId')
            console.log('arr', values)

            setBundle(res)
        })

        //setBundle(_data);
    }, [data])

    if (isLoading) return <Loader />;
    if (error) return <EmptyState style="mx-8" message={error.message} />;

    const rebuildTree = (data) => {
        setBundle([])
        console.log(data)
        setTimeout(() => {
            setBundle(data)
        }, 500);
    }

    return <NestingEditor treeData={bundle} rebuildTree={rebuildTree} />
}

function BundleEditor() {
    const {
        data: { accounts, currentAccountIndex },
        fn: {},
    } = useDatacontext();

    return (
        <Layout>
            <h2 className="text-gray-500 font-bold text-xl my-4">
                Bundle Editor
            </h2>
            <div
                className="w-full shadow-md border border-white bg-white rounded my-4"
                style={{ height: "500px" }}
            >
                { accounts.length > 0 ? <EditorContainer account={accounts[currentAccountIndex]} /> : <div></div> }
            </div>
        </Layout>
    );
}

export default BundleEditor;

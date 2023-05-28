import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDatacontext } from "../app/context";
import { graphqlEndpoint, tokensQuery } from "../unique/queries";
import Layout from "../app/layout";
import EmptyState from "../app/common/EmptyState";
import NestingEditor from "../app/editor/NestingEditor";
import { getBundleInfo, nestTokens, unNestTokens } from "../unique/service";
import { unrollBundle } from "../app/utils";


function EditorContainer({ account, setLoaderMessage }) {
    const owner = account.address;
    const [dataAvailable, setDataAvailable] = useState(false);
    const [bundle, setBundle] = useState([]);
    const { data, isLoading, error } = useQuery("tokens", async () => {
        if (dataAvailable) return;
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

        if (dataAvailable) return;

        const _data = data.tokens.data.map(o => {
            const tokenId = o.token_id;
            const collectionId = o.collection_id;
            const parentCollection = 0;
            const parentId = 0;
            const isBundle = o.children_count > 0;
            const tokenName = o.token_name;
            const image = o.image.fullUrl;
            const nodeId = `${collectionId}_${tokenId}`;
            return { nodeId, tokenName, tokenId, collectionId, parentCollection, parentId, isBundle, image }
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
            console.log('arr', res)

            setBundle(res)
            setDataAvailable(true)
        })

        //setBundle(_data);
    }, [data])

    if (isLoading) return null;
    if (error) return <EmptyState style="mx-8" message={error.message} />;

    const nestAndRebuild = async (updatedTree, nestArgs) => {
        setBundle([])
        //console.log(data)
        setLoaderMessage("Nesting token...")
        const result = await nestTokens(account, nestArgs);
        if (result !== null) {
            setLoaderMessage("Token nested successfully...")
            setBundle(updatedTree)
        }
        else {
            setLoaderMessage("Something went wrong, try again!")
        }

        setTimeout(() => {
            setLoaderMessage(null)
        }, 1500);
    }

    const unnestAndRebuild = async (updatedTree, nestArgs) => {
        setBundle([])
        setLoaderMessage("Unnesting token...")
        const result = await unNestTokens(account, nestArgs);
        if (result !== null) {
            setLoaderMessage("Token unnested successfully...")
            setBundle(updatedTree)
        }
        else {
            setLoaderMessage("Something went wrong, try again!")
        }

        setTimeout(() => {
            setLoaderMessage(null)
        }, 1500);
    }

    return (
        <NestingEditor 
            treeData={bundle} 
            nestAndRebuild={nestAndRebuild} 
            unnestAndRebuild={unnestAndRebuild}
        />
    )
}

function BundleEditor() {
    const {
        data: { accounts, currentAccountIndex },
        fn: { setLoaderMessage },
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
                { 
                    accounts.length > 0 ? 
                        <EditorContainer account={accounts[currentAccountIndex]} setLoaderMessage={setLoaderMessage} /> 
                        : <div></div> 
                }
            </div>
        </Layout>
    );
}

export default BundleEditor;

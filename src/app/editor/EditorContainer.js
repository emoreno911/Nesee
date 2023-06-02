import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { graphqlEndpoint, tokensQuery } from "../../unique/queries";
import { unrollBundle } from "../utils";
import EmptyState from "../common/EmptyState";
import NestingEditor from "../editor/NestingEditor";
import {
    getBundleInfo,
    nestTokens,
    unNestTokens,
    getCollectionsInfo,
} from "../../unique/service";


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

        if (dataAvailable) return; // avoid multiple redraws

        const _data = data.tokens.data.map((o) => {
            return {
                nodeId: `${o.collection_id}_${o.token_id}`,
                tokenId: o.token_id,
                tokenName: o.token_name,
                attributes: o.attributes,
                collectionId: o.collection_id,
                isBundle: o.children_count > 0,
                image: o.image.fullUrl,
                parentCollection: 0,
                parentId: 0,
            };
        });

        const _bundles = _data
            .filter((o) => o.isBundle)
            .map((o) => getBundleInfo(account, o.collectionId, o.tokenId));

        Promise.all(_bundles).then((values) => {
            let arr = [];
            values.forEach((bundle) => {
                const b = unrollBundle(bundle);
                const c = b.map((o) => {
                    o.nodeId = `${o.collectionId}_${o.tokenId}`;
                    return o;
                });
                // include tokenname with unionBy
                arr = [...arr, ...c];
            });

            const res = _.unionBy(arr, _data, "nodeId");
            console.log("arr", res);

            const uniqCollections = _.uniq(res.map((o) => o.collectionId));
            getCollectionsInfo(uniqCollections)
                .then((response) => {
                    if (!response.collections) return;

                    const _tokens = res.map((o) => {
                        const c = response.collections.data.find(
                            (c) => c.collection_id === o.collectionId
                        );
                        o.tokenName = `${c.token_prefix} #${o.tokenId}`;
                        return o;
                    });

                    setBundle(_tokens);
                    setDataAvailable(true);
                })
                .catch((err) => {
                    console.log("error", err);
                });
        });

        //setBundle(_data);
    }, [data]);

    if (isLoading) return null;
    if (error) return <EmptyState style="mx-8" message={error.message} />;

    const nestAndRebuild = async (updatedTree, nestArgs) => {
        setBundle([]);
        //console.log(data)
        try {
            setLoaderMessage("Nesting token...");
            const result = await nestTokens(account, nestArgs);
            if (result !== null) {
                setLoaderMessage("Token nested successfully...");
                setBundle(updatedTree);
            } else {
                setLoaderMessage("Something went wrong, try again!");
            }
        } catch (error) {
            setLoaderMessage("Something went wrong, refresh page!");
        }

        setTimeout(() => {
            setLoaderMessage(null);
        }, 1500);
    };

    const unnestAndRebuild = async (updatedTree, nestArgs) => {
        setBundle([]);
        try {
            setLoaderMessage("Unnesting token...");
            const result = await unNestTokens(account, nestArgs);
            if (result !== null) {
                setLoaderMessage("Token unnested successfully...");
                setBundle(updatedTree);
            } else {
                setLoaderMessage("Something went wrong, try again!");
            }
        } catch (error) {
            setLoaderMessage("Something went wrong, refresh page!");
        }

        setTimeout(() => {
            setLoaderMessage(null);
        }, 1500);
    };

    return (
        <NestingEditor
            treeData={bundle}
            nestAndRebuild={nestAndRebuild}
            unnestAndRebuild={unnestAndRebuild}
        />
    );
}

export default EditorContainer;
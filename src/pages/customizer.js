import { useEffect, useState } from "react";
import { useDatacontext } from "../app/context";
import Layout from "../app/layout";
import NestingEditor from "../app/editor/NestingEditor";
import { getBundleInfo } from "../app/unique";
import { unrollBundle } from "../app/utils";
import ModalCustomize from "../app/customizer/ModalCustomize";

function Customizer() {
    const {
        data: { accounts, currentAccountIndex },
        fn: {},
    } = useDatacontext();

    const [bundle, setBundle] = useState([]);
    const [bundleTree, setBundleTree] = useState([]);

    const rebuildTree = (data) => {
        setBundle([])
        console.log(data)
        setTimeout(() => {
            setBundle(data)
        }, 500);
    }

    const getData = async () => {
        const account = accounts[currentAccountIndex];
        const _bundle = await getBundleInfo(account, 590, 2);
        const tree = unrollBundle(_bundle);
        setBundleTree(tree);
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <Layout>
            <div className="flex justify-between">
                <h2 className="text-gray-500 font-bold text-xl my-4">
                    Bundle Customizer
                </h2>
                <ModalCustomize />
            </div>

            <div
                className="w-full shadow-md border border-white bg-white rounded my-4"
                style={{ height: "500px" }}
            >
                <NestingEditor treeData={bundleTree} rebuildTree={rebuildTree} />
            </div>
        </Layout>
    );
}

export default Customizer;

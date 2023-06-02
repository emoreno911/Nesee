import { useDatacontext } from "../app/context";
import Layout from "../app/layout";
import EditorContainer from "../app/editor/EditorContainer";


function BundleEditor() {
    const {
        data: { accounts, currentAccountIndex },
        fn: { setLoaderMessage },
    } = useDatacontext();

    const editorHeight = "500px";

    return (
        <Layout>
            <h2 className="text-gray-100 font-semibold text-xl my-4">
                Bundle Editor
            </h2>
            <div
                className="w-full shadow-md bg-darkdeep rounded my-4"
                style={{ height: editorHeight }}
            >
                {accounts.length > 0 ? (
                    <EditorContainer
                        account={accounts[currentAccountIndex]}
                        setLoaderMessage={setLoaderMessage}
                    />
                ) : (
                    <div></div>
                )}
            </div>
        </Layout>
    );
}

export default BundleEditor;

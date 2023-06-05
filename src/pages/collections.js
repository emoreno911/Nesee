import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDatacontext } from "../app/context";
import Collections from "../app/common/Collections";
import Tokens from "../app/common/Tokens";
import Layout from "../app/layout";
import { CaretRightIcon } from "../app/icons";
import ModalForm from "../app/collections/ModalForm";


function CollectionsPage() {
    const {
        data: { accounts, currentAccountIndex }
    } = useDatacontext();

    const { collectionId } = useParams();

    const account = accounts[currentAccountIndex];
    const owner = account ? account.address : "";

    if (!account)
        return null;

    return (
        <Layout>
        {
            collectionId ? 
            (<>
                <div className="flex justify-between items-center">
                    <h3 className="text-gray-100 font-bold text-xl mt-4 flex items-center">
                        <span>Your Collections</span> 
                        <CaretRightIcon />
                        <span>{collectionId}</span>
                    </h3>
                    <ModalForm isMintForm={true} />
                </div>
    
                <Tokens owner={owner} collectionIds={parseInt(collectionId)} />
            </>) 
            :
            (<>
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-xl mt-4">
                        <span>Your Collections</span>
                    </h3>
                    <ModalForm isMintForm={false} />
                </div>
    
                <Collections owner={owner} />
            </>)
        }        
        </Layout>
    );
}

export default CollectionsPage;

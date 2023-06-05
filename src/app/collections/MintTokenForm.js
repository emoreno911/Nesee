import Tokens from "../common/Tokens";

function MintTokenForm({ owner, collectionId }) {
    

    return (
        <>
            <h3 className="text-gray-100 font-bold text-xl mt-4 flex items-center">
                <span>Your Collections</span> 
                <Caret />
                <span>{collectionId}</span>
            </h3>

            <Tokens owner={owner} collectionIds={parseInt(collectionId)} />
        </>
    );
}

export default MintTokenForm;

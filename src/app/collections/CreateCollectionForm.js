import Collections from "../common/Collections";

function CreateCollectionForm({ owner }) {
    return (
        <>
            <h3 className="text-white font-bold text-xl mt-4">
                <span>Your Collections</span>
            </h3>

            <Collections owner={owner} />
        </>
    );
}

export default CreateCollectionForm;
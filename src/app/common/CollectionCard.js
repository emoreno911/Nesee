import { Link } from "react-router-dom";
import { fallbackNoImage } from "../utils";

const CollectionCard = ({
    data: {
        collection_id,
        token_prefix,
        name,
        collection_cover,
    },
}) => {
    if (!collection_id) return <div className="hidden"></div>;

    const image = collection_cover ? `https://ipfs.unique.network/ipfs/${collection_cover}` : fallbackNoImage;

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-4">
            <Link to={`/collections/${collection_id}`}>
                <div className="h-2 w-full">&nbsp;</div>
                <div className="c-card block bg-darkmode shadow-md hover:shadow-xl rounded-lg overflow-hidden">
                    <div className="relative pb-48 overflow-hidden">
                        <img
                            className="absolute inset-0 h-full w-full object-contain"
                            src={image}
                            alt=""
                        />
                    </div>
                    <div className="p-4">
                        <h2 className="my-1 text-white font-bold flex justify-between items-center">
                            <span>{token_prefix}</span>
                            <span className="inline-block px-2 py-1 leading-none bg-yellow-200 text-yellow-800 rounded-md font-semibold uppercase tracking-wide text-xs">
                                ID: {collection_id}
                            </span>
                            
                        </h2>
                        <h3 className="my-1 text-gray-400 font-bold">
                            {name}
                        </h3>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CollectionCard;
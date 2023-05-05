import { Link } from "react-router-dom";
import { fallbackNoImage } from "../utils";

const CollectionCard = ({
    data: {
        collection_id,
        type,
        token_prefix,
        name,
        collection_cover,
        description,
    },
}) => {
    if (!collection_id) return <div className="hidden"></div>;

    const linkTo = `/visual/${collection_id}`;

    const image = collection_cover ? `https://ipfs.unique.network/ipfs/${collection_cover}` : fallbackNoImage;

    return (
        <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4">
            <Link to={linkTo}>
                <a className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
                    <div className="relative pb-48 overflow-hidden">
                        <img
                            className="absolute inset-0 h-full w-full object-contain"
                            src={image}
                            alt=""
                        />
                    </div>
                    <div className="p-4">
                        <h2 className="my-1 text-black font-bold">({token_prefix}) {name}</h2>
                        <span className="inline-block py-1 leading-none text-gray-500 uppercase tracking-wide text-xs">
                            {description}
                        </span>
                    </div>
                    <div className="px-4 pb-4 text-xs text-gray-700">
                        <div className="flex items-center justify-end">
                            <span className="inline-block px-2 py-1 leading-none bg-yellow-200 text-yellow-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                                {type}
                            </span>
                        </div>
                    </div>
                </a>
            </Link>
        </div>
    );
};

export default CollectionCard;
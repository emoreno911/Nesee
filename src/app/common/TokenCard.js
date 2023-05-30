import { Link } from "react-router-dom";
import { fallbackNoImage, isDynamicBackground } from "../utils";

const TokenCard = ({
    data: {
        attributes,
        collection_id,
        collection_name,
        token_id,
        token_name,
        image,
        children_count,
        type,
    },
}) => {
    if (!collection_id) return <div className="hidden"></div>;

    const _type = children_count > 0 ? "bundle" : "token";
    const linkTo = `/detail/${_type}/${collection_id}_${token_id}`;

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-4">
            <Link to={linkTo}>
                <div className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
                    <div className="h-2 w-full">&nbsp;</div>
                    <div className="relative pb-48 overflow-hidden">
                        <img
                            className="absolute inset-0 h-full w-full object-contain"
                            src={image.fullUrl || fallbackNoImage}
                            alt=""
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center my-1 text-black font-bold">
                                <span>{token_name}</span>
                                <span className="inline text-red-400 ml-1" title="Dynamic Background">
                                    {!isDynamicBackground(collection_id, attributes) ? "" : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>                                      
                                    )}
                                </span>
                            </h2>

                            {children_count > 0 ? (
                                <span className="inline-block px-2 py-1 leading-none bg-pink-200 text-pink-800 rounded-full font-semibold uppercase tracking-wide text-xs mr-1">
                                    BUNDLE
                                </span>
                            ) : (
                                <span className="inline-block px-2 py-1 leading-none bg-yellow-200 text-yellow-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                                    {type}
                                </span>
                            )}
                        </div>
                        <span className="inline-block py-1 leading-none text-gray-500 uppercase tracking-wide text-xs">
                            {collection_name} ({collection_id})
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default TokenCard;

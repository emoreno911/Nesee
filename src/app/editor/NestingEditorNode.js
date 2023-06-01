import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { fallbackNoImage, isComposableBundle, isDynamicBackground } from "../utils";


function NestingEditorNode({ data }) {
    let highlight = "border-blue-400 bg-slate-700 text-white";
    if (data.hasOwnProperty("isHighlight") && data.isHighlight)
		highlight = "border-pink-400 bg-pink-100 text-black";

    let selected = "border-blue-400 bg-slate-700 text-white";
    if (data.hasOwnProperty("isSelected") && data.isSelected)
		selected = "border-blue-600 bg-blue-200 text-black";

    const handleImageError = (evt) => {
        evt.currentTarget.src = fallbackNoImage;
        evt.currentTarget.title = "Missing image!";
    }

    return (
        <div
            className={`px-4 py-2 shadow-md rounded-md border-2 ${selected} ${highlight}`}
        >
            <div className="flex items-center">
                {/* <div className="rounded-full w-12 h-12 text-lg flex justify-center items-center bg-gray-100">
                    {data.isBundle ? boxEmoji : puzzleEmoji}
                </div> */}
                <div className="w-12 h-12 text-lg flex justify-center items-center bg-gray-100">
                    <img src={data.image} alt={data.tokenId} onError={handleImageError} className="w-full h-full"/>
                </div>
                <div className="ml-2 mb-1">
                    <div className="flex items-center text-lg font-bold">
                        <span>{data.tokenName}</span>{" "}
                        {!isDynamicBackground(data.collectionId, data.attributes || {}) ? "" : (
                            <span className="inline text-red-400 ml-1" title="Dynamic Background">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>   
                            </span>                                   
                        )}
                        {!isComposableBundle(data.collectionId, data.attributes || {}) ? "" : (
                            <span className="inline text-teal-400 ml-1" title="Composable Bundle">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                </svg> 
                            </span>                              
                        )}
                    </div>
                    {data.isBundle ? (
                        <span className="inline-block px-2 py-1 leading-none bg-pink-200 text-pink-800 rounded-lg font-semibold uppercase tracking-wide text-xs">
                            BUNDLE
                        </span>
                    ) : (
                        <span className="inline-block px-2 py-1 leading-none bg-yellow-200 text-yellow-800 rounded-lg font-semibold uppercase tracking-wide text-xs">
                            {"NFT"}
                        </span>
                    )}
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Top}
                className="!bg-blue-500"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-blue-500"
            />
        </div>
    );
}

export default memo(NestingEditorNode);

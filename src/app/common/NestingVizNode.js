import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { fallbackNoImage } from "../utils";

function NestingVizNode({ data }) {
    let highlight = "border-blue-400 bg-slate-700 text-white";
    if (data.hasOwnProperty("isHighlight") && data.isHighlight)
		highlight = "border-blue-600 bg-blue-200 text-black";

    const handleImageError = (evt) => {
        evt.currentTarget.src = fallbackNoImage;
        evt.currentTarget.title = "Missing image!";
    }

    return (
        <div
            className={`px-4 py-2 shadow-md rounded-md border-2 ${highlight}`}
        >
            <div className="flex">
                <div className="w-12 h-12 text-lg flex justify-center items-center bg-gray-100">
                    <img src={data.image} alt={data.tokenId} onError={handleImageError} className="w-full h-full"/>
                </div>
                <div className="ml-2">
                    <div className="text-lg font-bold">
                        <a href={`#/detail/token/${data.id}`} target="_blank">{data.title}</a>
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
                className="w-16 !bg-teal-500"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-16 !bg-teal-500"
            />
        </div>
    );
}

export default memo(NestingVizNode);

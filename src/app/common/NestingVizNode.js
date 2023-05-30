import React, { memo } from "react";
import { Handle, Position } from "reactflow";

const boxEmoji = "📦";
const puzzleEmoji = "🧩";

function NestingVizNode({ data }) {
    let highlight = "border-blue-400 bg-slate-700 text-white";
    if (data.hasOwnProperty("isHighlight") && data.isHighlight)
		highlight = "border-blue-600 bg-blue-200 text-black";

    return (
        <div
            className={`px-4 py-2 shadow-md rounded-md border-2 ${highlight}`}
        >
            <div className="flex">
                <div className="rounded-full w-12 h-12 text-lg flex justify-center items-center bg-gray-100">
                    {data.isBundle ? boxEmoji : puzzleEmoji}
                </div>
                <div className="ml-2">
                    <div className="text-lg font-bold">#{data.tokenId}</div>
                    <div className="text-gray-400">{data.collectionId}</div>
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

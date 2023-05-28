import React, { memo } from "react";
import { Handle, Position } from "reactflow";

const boxEmoji = "📦";
const puzzleEmoji = "🧩";


function NestingEditorNode({ data }) {
    let highlight = "border-stone-400 bg-white";
    if (data.hasOwnProperty("isHighlight") && data.isHighlight)
		highlight = "border-pink-400 bg-pink-100";

    let selected = "border-stone-400 bg-white";
    if (data.hasOwnProperty("isSelected") && data.isSelected)
		selected = "border-orange-400 bg-orange-100";

    return (
        <div
            className={`px-4 py-2 shadow-md rounded-md border-2 ${highlight} ${selected}`}
        >
            <div className="flex">
                {/* <div className="rounded-full w-12 h-12 text-lg flex justify-center items-center bg-gray-100">
                    {data.isBundle ? boxEmoji : puzzleEmoji}
                </div> */}
                <div className="w-12 h-12 text-lg flex justify-center items-center bg-gray-100">
                    <img src={data.image} alt={data.tokenId} className="w-full h-full"/>
                </div>
                <div className="ml-2">
                    <div className="text-lg font-bold">#{data.tokenId}</div>
                    <div className="text-gray-500">{data.collectionId}</div>
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

export default memo(NestingEditorNode);

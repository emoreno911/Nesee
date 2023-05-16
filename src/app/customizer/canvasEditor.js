import { useEffect, useState } from "react"; // ^18.2.0 (modificar y probar)
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import Button from "../common/Button";

const faces = [
    {title: "Monke #1", url: "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/72/22211-monkey-face-icon.png"},
    {title: "Shib #2", url: "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/72/22214-dog-face-icon.png"},
    {title: "Wolf #3", url: "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/72/22217-wolf-face-icon.png"},
    {title: "Leo #4", url: "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/72/22222-lion-face-icon.png"}
]

const CanvasEditor = () => {
    const [ elems, setElems ] = useState(faces);
    const { selectedObjects, editor, onReady } = useFabricJSEditor();

    useEffect(() => {
        if (!editor) return;

        // fabric.Image.fromURL(
        //     "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/72/22215-dog-icon.png",
        //     (oImg) => {
        //         editor.canvas.add(oImg);
        //         console.log('add dog!', oImg)
        //     }
        // );
    }, []);

    const showElems = () => {
        console.log(editor.canvas.getObjects())
    }

    const saveJSON = () => {
        //const showProps = ["type","version","originX","originY","left","top","width","height","scaleX","scaleY","angle","flipX","flipY","opacity","visible","src"];
        const {version, objects} = editor.canvas.toObject();
        const objsWithPropsFiltered = objects.map(o => {
            let {type,version,originX,originY,left,top,width,height,scaleX,scaleY,angle,flipX,flipY,opacity,visible,src} = o;
            return {type,version,originX,originY,left,top,width,height,scaleX,scaleY,angle,flipX,flipY,opacity,visible,src}
        })

        const result = { version, objects: objsWithPropsFiltered }
        console.log(result)
    }

    const addImage = (url) => {
        fabric.Image.fromURL(url, (oImg) => { editor.canvas.add(oImg) } )
    }

    return (
        <>
            <div className="h-96 flex flex-col sm:flex-row">
                <div className="bg-red-100 w-full sm:w-2/3 lg:w-3/4">
                    <FabricJSCanvas className="h-full" onReady={onReady} />
                </div>
                <div className="bg-blue-100 w-full sm:w-1/3 lg:w-1/4">
                    <div>
                        {elems.map(({title, url}) => (
                            <button 
                                key={title} 
                                className="w-full border border-gray-600 my-2 px-2 py-1"
                                onClick={() => addImage(url)}
                            >
                                <span>{title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <Button color="blue" onClick={() => showElems()}>
                    List Elems
                </Button>
                <Button color="green" onClick={() => saveJSON()}>
                    Save JSON
                </Button>
            </div>
        </>
    );
};

export default CanvasEditor;

import { useEffect, useState } from "react"; // ^18.2.0 (modificar y probar)
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import Button from "../common/Button";

const faces = [
    {id: "500_1", title: "Monke #1", url: "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/72/22211-monkey-face-icon.png"},
    {id: "500_2", title: "Shib #2", url: "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/72/22214-dog-face-icon.png"},
    {id: "500_3", title: "Wolf #3", url: "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/72/22217-wolf-face-icon.png"},
    {id: "500_4", title: "Leo #4", url: "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/72/22222-lion-face-icon.png"}
]

const CanvasEditor = () => {
    const [ canvasItems, setCanvasItems ] = useState([]);
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
        const ids = editor.canvas.getObjects().map(({nftid, title}) => ({ nftid, title })); // get ids and titles
        const {version, objects} = editor.canvas.toObject(); 
        const objsWithPropsFiltered = objects.map((o, i) => {
            let {type,version,originX,originY,left,top,width,height,scaleX,scaleY,angle,flipX,flipY,opacity,visible,src} = o;
            return {...ids[i],type,version,originX,originY,left,top,width,height,scaleX,scaleY,angle,flipX,flipY,opacity,visible,src}
        })

        const result = { version, objects: objsWithPropsFiltered };
        const b64result = btoa(JSON.stringify(result));
        window.localStorage.setItem("bundle", b64result);
        console.log("saved to local storage");
    }

    const loadJSON = () => {
        const res = window.localStorage.getItem("bundle");
        const json = JSON.parse(atob(res));
        editor.canvas.loadFromJSON(json, () => {
            editor.canvas.renderAll();
        });
        updateCanvasItems(json.objects);
    }

    const layerUp = (nftid) => {
        //var activeObject = editor.canvas.getActiveObject();
        const item = editor.canvas.getObjects().find(o => o.nftid === nftid);
        if (item) {
            editor.canvas.bringForward(item);
            updateCanvasItems();
        }
    }

    const layerDown = (nftid) => {
        const item = editor.canvas.getObjects().find(o => o.nftid === nftid);
        if (item) {
            editor.canvas.sendBackwards(item);
            updateCanvasItems();
        }
    }

    const addImage = ({url, id, title}) => {
        fabric.Image.fromURL(url, (oImg) => { 
            oImg.nftid = id; 
            oImg.title = title;
            editor.canvas.add(oImg); 
        })
    }

    const toggleCanvasImage = (img) => {
        const index = editor.canvas.getObjects().findIndex(o => o.nftid === img.id);
        if (index === -1) {
            addImage(img)
        } else {
            // remove
            editor.canvas.remove(editor.canvas.item(index))
        }
        updateCanvasItems();
    }

    const updateCanvasItems = (items = null) => {
        setTimeout(() => {
            const _items = items !== null ? items : editor.canvas.getObjects(); // assign here to get the updated canvas
            _items.reverse();
            setCanvasItems(_items.map(({nftid, title}) => ({ nftid, title })));
        }, 50);
    }

    const canvasIncludes = (id) => {
        return canvasItems.map(o => o.nftid).includes(id);
    }

    return (
        <>
            <div className="h-96 flex flex-col sm:flex-row">
                <div className="bg-red-100 w-full sm:w-2/3 lg:w-3/4">
                    <FabricJSCanvas className="h-full" onReady={onReady} />
                </div>
                <div className="bg-blue-100 w-full sm:w-1/3 lg:w-1/4">
                    <div>
                        {canvasItems.map(({nftid, title}) => (
                            <div key={nftid} className="text-xs w-full border border-gray-600 mb-2">   
                                <button className="bg-blue-400 py-1 px-2" onClick={() => layerUp(nftid)}>U</button>
                                <button className="bg-purple-400 py-1 px-2 mr-1" onClick={() => layerDown(nftid)}>D</button>
                                <span>{title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <div className="flex">
                    {elems.map(({title, url, id}) => (
                        <button 
                            key={id} 
                            className={`w-full rounded-md border border-gray-600 m-2 px-2 py-1 ${canvasIncludes(id) ? 'bg-pink-200 border-pink-600' : ''}`}
                            onClick={() => toggleCanvasImage({url, id, title})}
                        >
                            <span>{title}</span>
                        </button>
                    ))}
                </div>
                <Button color="blue" onClick={() => showElems()}>
                    List Elems
                </Button>
                {" "}
                <Button color="green" onClick={() => saveJSON()}>
                    Save JSON
                </Button>
                {" "}
                <Button color="yellow" onClick={() => loadJSON()}>
                    Load JSON
                </Button>
            </div>
        </>
    );
};

export default CanvasEditor;

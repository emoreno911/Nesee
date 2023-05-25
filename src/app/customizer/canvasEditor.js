import { useEffect, useState } from "react"; // ^18.2.0 (modificar y probar)
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { Flipper, Flipped } from 'react-flip-toolkit';
import Button from "../common/Button";

const parts = [
    {id: "375_13", title: "BODY #1", url: "/nft/body.png"},
    {id: "375_1", title: "MOUTH #1", url: "/nft/mouth1.png"},
    {id: "375_2", title: "MOUTH #2", url: "/nft/mouth2.png"},
    {id: "375_3", title: "MOUTH #3", url: "/nft/mouth3.png"},
    {id: "375_4", title: "MOUTH #4", url: "/nft/mouth4.png"},
    {id: "375_5", title: "EYES #1", url: "/nft/eyes1.png"},
    {id: "375_6", title: "EYES #2", url: "/nft/eyes2.png"},
    {id: "375_7", title: "EYES #3", url: "/nft/eyes3.png"},
    {id: "375_8", title: "EYES #4", url: "/nft/eyes4.png"},
    {id: "375_9", title: "HAT #1", url: "/nft/hat1.png"},
    {id: "375_10", title: "HAT #2", url: "/nft/hat2.png"},
    {id: "375_11", title: "HAT #3", url: "/nft/hat3.png"},
    {id: "375_12", title: "HAT #4", url: "/nft/hat4.png"},
    {id: "375_14", title: "BACK #1", url: "/nft/bg1.jpg"},
    {id: "375_15", title: "BACK #2", url: "/nft/bg2.jpg"},
    {id: "375_16", title: "BACK #3", url: "/nft/bg3.jpg"},
]

const CanvasEditor = () => {
    const [ canvasItems, setCanvasItems ] = useState([]);
    const [ elems, setElems ] = useState(parts);
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
        console.log(editor.canvas.toObject())
    }

    const clearCanvas = () => {
        editor.canvas.clear();
        updateCanvasItems();
    }

    const deselectCurrentObject = () => {
        editor.canvas.discardActiveObject()
        editor.canvas.renderAll()
    }

    const exportImage = () => {
        const imgB64 = editor.canvas.toDataURL('png');
        //console.log(img)
        var win = window.open();
        win.document.write(`<iframe src="${imgB64}" frameborder="0" style="width:100%; height:100%;" allowfullscreen> </iframe>`);
    }

    const saveJSON = () => {
        const ids = editor.canvas.getObjects().map(({nftid, title}) => ({ nftid, title })); // get ids and titles
        const {version, objects} = editor.canvas.toObject(); 
        const objsWithPropsFiltered = objects.map((o, i) => {
            let {type,version,originX,originY,left,top,width,height,scaleX,scaleY,angle,flipX,flipY,opacity,visible,src,crossOrigin} = o;
            return {...ids[i],type,version,originX,originY,left,top,width,height,scaleX,scaleY,angle,flipX,flipY,opacity,visible,src,crossOrigin}
        })

        const result = { version, objects: objsWithPropsFiltered };
        const b64result = btoa(JSON.stringify(result));
        window.localStorage.setItem("bundle", b64result);
        console.log("saved to local storage", b64result);
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
            //oImg.set({ height: 128 })
            editor.canvas.add(oImg); 
        },
        { crossOrigin: 'anonymous' }
        )
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
                    <Flipper flipKey={canvasItems.map(o => o.nftid).join('')}>
                    <div>
                        {canvasItems.map(({nftid, title}) => (
                            <Flipped key={nftid} flipId={nftid} stagger>
                                <div className="text-xs w-full border border-gray-600 mb-2">   
                                    <button className="bg-blue-400 py-1 px-2" onClick={() => layerUp(nftid)}>U</button>
                                    <button className="bg-purple-400 py-1 px-2 mr-1" onClick={() => layerDown(nftid)}>D</button>
                                    <span>{title}</span>
                                </div>
                            </Flipped>
                        ))}
                    </div>
                    </Flipper>
                </div>
            </div>
            <div>
                <div className="flex flex-wrap">
                    {elems.map(({title, url, id}) => (
                        <button 
                            key={id} 
                            className={`rounded-md border border-gray-600 m-2 px-2 py-1 ${canvasIncludes(id) ? 'bg-pink-200 border-pink-600' : ''}`}
                            onClick={() => toggleCanvasImage({url, id, title})}
                        >
                            <span>{title}</span>
                        </button>
                    ))}
                </div>
                <Button color="red" onClick={() => deselectCurrentObject()}>
                    Clear
                </Button>
                {" "}
                <Button color="blue" onClick={() => exportImage()}>
                    Export
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

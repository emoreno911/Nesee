import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { Flipper, Flipped } from 'react-flip-toolkit';
import { useDatacontext } from "../context";
import { getBundleInfo } from "../../unique/service";
import { unrollBundle } from "../utils";
import Button from "../common/Button";
import { graphqlEndpoint, tokensQueryB } from "../../unique/queries";


const CanvasEditor = () => {
    const [ canvasItems, setCanvasItems ] = useState([]);
    const [ nextElem, setNextElem ] = useState({});
    const [ elems, setElems ] = useState([]);
    const { selectedObjects, editor, onReady } = useFabricJSEditor();

    const {
        data: { accounts, currentAccountIndex, currentNode }
    } = useDatacontext()

    useEffect(() => {
        if (!editor) return;

        //updateData();
        getDemoElements();
    }, [currentNode]);

    const updateData = async () => {
        const account = accounts[currentAccountIndex];
        const { collectionId, tokenId, isBundle } = currentNode.data;

        if (isBundle) {
            const bundle = await getBundleInfo(account, collectionId, tokenId);
            const data = unrollBundle(bundle);
            console.log("data", data);

            const els = data.map(el => {
                el.id = `${el.collectionId}_${el.tokenId}`;
                el.title = `${el.collectionId}#${el.tokenId}`;
                el.url = el.image;
                return el
            })
            setElems(els);
            //clearCanvas();
        }  
    }

    const getDemoElements = async () => {
        const response = await axios({
            url: graphqlEndpoint,
            method: "POST",
            data: {
                query: tokensQueryB(null, [1575]), //1589,1575
            },
        });
    
        const res = response.data.data;
        const elems = res.tokens.data.map(el => {
            el.id = `${el.collection_id}_${el.token_id}`;
            el.title = `${el.token_name}`;
            el.url = el.image.fullUrl;

            // find the attribute named "type"
            //el.type = el.attributes[0].value._ // the easy way if attr[0] == type
            const attr = Object.keys(el.attributes).map(k => el.attributes[k]).find(attr => attr.name._ === "type")
            el.type = attr ? attr.value._ : 'none'

            return el
        })

        const groupedElems = _.groupBy(elems, 'type')
        setElems(groupedElems)
    }

    const showElems = () => {
        console.log(editor.canvas.toObject())
    }

    const clearCanvas = () => {
        editor.canvas.clear();
        updateCanvasItems();
        setNextElem({});
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

    const getJSON = () => {
        const ids = editor.canvas.getObjects().map(({nftid, title, nftype}) => ({ nftid, title, nftype })); // get ids and titles
        const {version, objects} = editor.canvas.toObject(); 
        const objsWithPropsFiltered = objects.map((o, i) => {
            let {type,version,originX,originY,left,top,width,height,scaleX,scaleY,angle,flipX,flipY,opacity,visible,src,crossOrigin} = o;
            return {...ids[i],type,version,originX,originY,left,top,width,height,scaleX,scaleY,angle,flipX,flipY,opacity,visible,src,crossOrigin}
        })

        const result = { version, objects: objsWithPropsFiltered };
        return result;
    }

    const saveJSON = () => {
        const result = getJSON();
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

    const addImage = ({url, id, title, type}) => {
        fabric.Image.fromURL(url, (oImg) => { 
            oImg.nftid = id; 
            oImg.title = title;
            oImg.nftype = type;
            //oImg.set({ height: 128 })
            editor.canvas.add(oImg); 
        },
        { crossOrigin: 'anonymous' }
        )
    }

    const toggleCanvasImage = () => {
        const {id, title, url, type} = nextElem;
        const index = editor.canvas.getObjects().findIndex(o => o.nftid === id);
        const replaceIndex = editor.canvas.getObjects().findIndex(o => o.nftype === type); // just one nft of each type

        if (index === -1) {
            if (replaceIndex !== -1) {
                editor.canvas.remove(editor.canvas.item(replaceIndex))
            }
            addImage({id, title, url, type})
        } else {
            // remove
            editor.canvas.remove(editor.canvas.item(index))
        }
        updateCanvasItems();
    }

    const removeCanvasElem = (id) => {
        const index = editor.canvas.getObjects().findIndex(o => o.nftid === id);
        editor.canvas.remove(editor.canvas.item(index));
        updateCanvasItems();
    }

    const previewNextCanvasImage = (data) => {
        deselectCurrentObject();
        setNextElem(data);
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

    const dynamicRegenerate = () => {
        const json = getJSON();
        const elements = Object.keys(elems).map(key => elems[key].map((el) => el));
        const flatElems = _.flatten(elements);
        const res = json.objects.map(o => {
            const updated = flatElems.find(el => el.id === o.nftid);
            if (updated) {
                o.src = updated.url
            }
            return o;
        })

        editor.canvas.loadFromJSON({version: json.version, objects: res}, () => {
            editor.canvas.renderAll();
        });
        //updateCanvasItems(res);
    }

    const updateBundle = () => {
        // const imgB64 = editor.canvas.toDataURL('png');
        // const json = getJSON();
        // const b64Json = btoa(JSON.stringify(json));
    }

    return (
        <>
            <div className="mb-2">
                <Button onClick={() => deselectCurrentObject()}>
                    Deselect
                </Button>
                {" "}
                <Button onClick={() => clearCanvas()}>
                    Clear
                </Button>
                {" "}
                <Button onClick={() => exportImage()}>
                    Export
                </Button>
                {" "}
                {/* <Button onClick={() => saveJSON()}>
                    Save JSON
                </Button>
                {" "}
                <Button onClick={() => loadJSON()}>
                    Load JSON
                </Button> */}
                
                <Button onClick={() => dynamicRegenerate()}>
                    Regenerate Live
                </Button>
                {" "}
                <Button onClick={() => saveJSON()}>
                    Update Bundle
                </Button>
            </div>
            <div className="h-96 flex flex-col sm:flex-row font-sans">
                <div className="w-full lg:w-1/4 overflow-auto px-1">
                    {Object.keys(elems).map(key => (
                        <div key={key}>
                            <h3 className="font-semibold text-yellow-600 text-md capitalize">{key}</h3>
                            {elems[key].map((el) => (
                                <button 
                                    key={el.id} 
                                    type="button"
                                    className={`block text-sm text-left rounded-sm w-full px-2 mb-2 ${canvasIncludes(el.id) ? 'bg-slate-700 font-semibold border border-blue-400' : ''}`}
                                    onClick={() => previewNextCanvasImage(el)}
                                >
                                    <span>{el.title}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="bg-darkdeep w-full lg:w-2/4">
                    <FabricJSCanvas className="h-full" onReady={onReady} />
                </div>
                <div className="flex flex-col justify-between w-full lg:w-1/4 px-1">
                    <Flipper flipKey={canvasItems.map(o => o.nftid).join('')}>
                    <div>
                        {canvasItems.map(({nftid, title}) => (
                            <Flipped key={nftid} flipId={nftid} stagger>
                                <div className="flex text-xs w-full border border-gray-600 bg-slate-700 rounded-sm mb-2">   
                                    <button className="bg-blue-400 p-1" onClick={() => layerUp(nftid)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                        </svg>
                                    </button>
                                    <button className="bg-purple-400 p-1 mr-1" onClick={() => layerDown(nftid)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>
                                    <div className="flex flex-1 items-center justify-between">
                                        <span className="font-semibold">{title}</span>
                                        <button className="bg-red-400 p-1" onClick={() => removeCanvasElem(nftid)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Flipped>
                        ))}
                    </div>
                    </Flipper>
                    <div title="preview next">
                        { !nextElem.hasOwnProperty("id") ? null : (
                            <div className={`flex items-center px-2 py-2 rounded-sm border-2 border-blue-400 bg-slate-700`}>
                                <div className="w-12 h-12 text-lg bg-gray-100 relative">
                                    <img src={nextElem.url} alt={nextElem.id} className="w-full h-full"/>
                                    <div className="absolute w-full h-full left-0 top-0">
                                        <button
                                            type="button"
                                            onClick={() => toggleCanvasImage()}
                                            className="w-full h-full text-xs bg-black/25 rounded-sm text-white px-1 px-3 flex justify-center items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>

                                        </button>
                                    </div>
                                </div>
                                <div className="ml-2 mb-1">
                                    <div className="text-md font-bold">{nextElem.title}</div>
                                    <div className="text-sm text-gray-400">{nextElem.type}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CanvasEditor;

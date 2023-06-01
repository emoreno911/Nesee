export const ipfsBundleImage = "QmY3XC4Twr62QcMz2StdQZsrrffYKuyimscfM6acA6yCwf";
export const ipfsTicketImage = "Qmbw957mpvrK6ARp1Uq7taLYRCJaakuaw3p42bAZkPDv9Z";
export const fallbackNoImage = "/images/noimage.svg";
export const strokeButtonStyle =
    "bg-white text-gray-700 uppercase font-bold font-sans text-xs py-1 px-3 mr-1 rounded-sm border border-gray-700 hover:bg-blue-100";

export const appMetadata = {
    name: "NESEE",
    description: "Enjoy the experience of customized NFT's",
    icon: "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652131690/dz-logo-black_c86gzb.png",
};

export const baseNetworkURL = "https://rest.unique.network/opal/v1";

// String base 64 to blob
export const dataURItoBlob = (dataURI) => {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: mimeString });

    return [blob, mimeString];
};

export const unrollBundle = (bundle) => {
    const arr = [];
    const getNodes = (children, parentCollection, parentId) => {
        children.forEach((el) => {
            const {
                tokenId,
                attributes,
                collectionId,
                nestingChildTokens,
                image: { fullUrl },
            } = el;

            const isBundle = el.hasOwnProperty("nestingChildTokens");
            if (isBundle) getNodes(nestingChildTokens, collectionId, tokenId);

            arr.push({
                attributes,
                tokenId,
                collectionId,
                parentCollection,
                parentId,
                isBundle,
                image: fullUrl,
            });
        });
    };

    // set main node
    arr.push({
        attributes: bundle.attributes,
        tokenId: bundle.tokenId,
        collectionId: bundle.collectionId,
        parentCollection: 0,
        parentId: 0,
        isBundle: true,
        image: bundle.image.fullUrl,
    });
    // get children nodes
    getNodes(bundle.nestingChildTokens, bundle.collectionId, bundle.tokenId);

    return arr;
};

export const isDynamicBackground = (collectionId, attributes) => {
    const attr = Object.keys(attributes)
        .map((k) => attributes[k])
        .find((attr) => attr.name._ === "type");
    if (typeof attr === "undefined") return false;
    return parseInt(collectionId) === 1648 && attr.value._ === "background";
};

export const isComposableBundle = (collectionId, attributes) => {
    const attr = Object.keys(attributes)
        .map((k) => attributes[k])
        .find((attr) => attr.name._ === "type");
    if (typeof attr === "undefined") return false;
    return parseInt(collectionId) === 1648 && attr.value._ === "root";
};

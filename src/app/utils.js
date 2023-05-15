export const ipfsBundleImage = "QmY3XC4Twr62QcMz2StdQZsrrffYKuyimscfM6acA6yCwf";
export const ipfsTicketImage = "Qmbw957mpvrK6ARp1Uq7taLYRCJaakuaw3p42bAZkPDv9Z";
export const fallbackNoImage = "https://via.placeholder.com/300/444444/FFFFFF/?text=IMG"//"https://wallet.unique.network/static/media/empty-image.06dd29a7fc6c895e8369e8f0bb5780b2.svg";
export const formFieldStyle = "w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline";

export const appMetadata = {
	name: "NESEE",
    description: "Enjoy the experience of customized NFT's",
    icon: "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652131690/dz-logo-black_c86gzb.png"
}

export const baseNetworkURL = "https://rest.unique.network/opal/v1"

// String base 64 to blob 
export const dataURItoBlob = (dataURI) => {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	
	for (var i = 0; i < byteString.length; i++) {
	  ia[i] = byteString.charCodeAt(i);
	}
	var blob = new Blob([ab], {type: mimeString});
	
	return [blob, mimeString];
}

export const unrollBundle = (bundle) => {
	const arr = [];
	const getNodes = (children, parentCollection, parentId) => {
		children.forEach((el) => {
			const { tokenId, collectionId, nestingChildTokens } = el;
			const isBundle = el.hasOwnProperty('nestingChildTokens');
			if (isBundle)
				getNodes(nestingChildTokens, collectionId, tokenId);

			arr.push({ tokenId, collectionId, parentCollection, parentId, isBundle });
		});
	};

	// set main node
	arr.push({tokenId: bundle.tokenId, collectionId: bundle.collectionId, parentCollection: 0, parentId: 0, isBundle:true});
	// get children nodes
	getNodes(
		bundle.nestingChildTokens,
		bundle.collectionId,
		bundle.tokenId
	);
	
	return arr;
};
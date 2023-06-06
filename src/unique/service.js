import axios from "axios";
import Sdk from "@unique-nft/sdk";
import { Web3Storage } from 'web3.storage';
import { KeyringProvider } from "@unique-nft/accounts/keyring";
import { SchemaTools } from "@unique-nft/schemas";
import { baseNetworkURL } from "../app/utils";
import { graphqlEndpoint, collectionsFilterQuery, collectionsQuery } from "./queries";
import { buildComposableCollectionSchema, composableCollectionSchema, composablePropertyPermissions, staticCollectionSchema, tokenPermissions } from "./schemas";

const storageClient = new Web3Storage({ token: process.env.REACT_APP_WEB3STORAGE_KEY });

export const getWalletClient = (account) => {
    //const account = accounts[currentAccountIndex];
    const address = account.address;
    const sdk = new Sdk({
        baseUrl: baseNetworkURL,
        signer: account.uniqueSdkSigner,
    });

    return { sdk, address };
};

export const getSeedClient = async () => {
    const seed = process.env.REACT_APP_ACC_SEED;
    const options = { type: "sr25519" };

    const provider = new KeyringProvider(options);
    await provider.init();

    const signer = provider.addSeed(seed);

    const clientOptions = {
        baseUrl: baseNetworkURL,
        signer,
    };

    const sdk = new Sdk(clientOptions);
    const address = signer.getAddress();

    return { sdk, address };
};

export const getTokenDetailInfo = async (account, collectionId, tokenId) => {
    const { sdk, address } = getWalletClient(account);

    const tokenDetail = await sdk.token.get({ collectionId, tokenId });
    const bundleInfo = await sdk.token.getBundle({
        collectionId,
        tokenId,
    });

    return { tokenDetail, bundleInfo };
};

export const getBundleInfo = async (account, collectionId, tokenId) => {
    const { sdk, address } = getWalletClient(account);

    const bundleInfo = await sdk.token.getBundle({
        collectionId,
        tokenId,
    });

    return bundleInfo;
};

export const getCollectionsByOwner = async (owner) => {
    const response = await axios({
        url: graphqlEndpoint,
        method: "POST",
        data: {
            query: collectionsQuery(owner),
        },
    });

    return response.data.data;
};

export const getCollectionsInfo = async (filter) => {
    const response = await axios({
        url: graphqlEndpoint,
        method: "POST",
        data: {
            query: collectionsFilterQuery(filter),
        },
    });

    return response.data.data;
};

export const getCollectionById = async (account, collectionId) => {
    const { sdk, address } = getWalletClient(account);
    const response = await  sdk.collection.get({collectionId});
    return response;
}

export const hasNeseeSchema = async (account, collectionId) => {
    const { sdk, address } = getWalletClient(account);
    const response = await  sdk.collection.get({collectionId});
    try {
        // check if the collection has the NESEE schema
        const [attr0, attr1, attr2,] = response.properties;
        const cond0 = attr0.value.indexOf('"_":"type"') !== -1;
        const cond1 = attr1.value.indexOf('"_":"name"') !== -1;
        const cond2 = attr2.value.indexOf('"_":"composition"') !== -1;

        const cond3 = response.tokenPropertyPermissions.find(o => o.key === "a.2").permission.mutable;
        const cond4 = response.tokenPropertyPermissions.find(o => o.key === "i.c").permission.mutable;

        return (cond0 && cond1 && cond2 && cond3 && cond4)
    } catch (err) {
        return false
    }
}

export const createStaticCollection = async (account) => {
    const { sdk, address } = getWalletClient(account);
    const [name, description, tokenPrefix] = [
        "Nes Ghosts",
        "Nesee Ghosts body parts",
        "NGHO",
    ];

    console.log("creating static collection...");

    const { error, parsed } = await sdk.collection.create.submitWaitResult(
        {
            address,
            name,
            description,
            tokenPrefix,
            schema: staticCollectionSchema,
            permissions: tokenPermissions
        },
        {
            signer: account,
        }
    );

    if (error) {
        console.log("Error occurred while creating a collection. ", error);
        return null;
    }

    const { collectionId } = parsed;
    console.log("new collection", collectionId);

    return collectionId;
};

export const createComposableCollection = async (account, { name, description, symbol, types, coverIpfs }) => {
    const { sdk, address } = getWalletClient(account);
    const schema = buildComposableCollectionSchema(coverIpfs, types);

    console.log("creating dynamic collection...");
    const { error, parsed } = await sdk.collection.create.submitWaitResult(
        {
            address,
            name,
            description,
            tokenPrefix: symbol,
            schema,
            permissions: tokenPermissions,
            tokenPropertyPermissions: composablePropertyPermissions,
        },
        {
            signer: account,
        }
    );

    if (error) {
        console.log("Error occurred while creating a collection. ", error);
        return null;
    }

    const { collectionId } = parsed;
    console.log("new collection", collectionId);

    return collectionId;
};

export const mintComposableNft = async (account, {type, name, ipfsCid, _collectionId} ) => {    
    const { sdk, address } = getWalletClient(account);

    const tokenProperties = SchemaTools.encodeUnique.token(
        {
            image: { ipfsCid },
            encodedAttributes: {
                0: type,
                1: { _: name },
            },
        },
        composableCollectionSchema
    );

    console.log("minting nft...");
    const { error, parsed } = await sdk.token.create.submitWaitResult(
        {
            address,
            collectionId: _collectionId,
            properties: tokenProperties,
        },
        { signer: account }
    );

    if (error) {
        console.log("Error occurred while minting. ", error);
        return null;
    }

    const { collectionId, tokenId } = parsed;
    console.log("new token", collectionId, tokenId);
    return tokenId;
};

export const mintNft = async (account, _collectionId, ipfsCid, props, isComposable = false) => {
    // const client = new Sdk({ baseUrl: 'https://rest.unique.network/opal/v1' });
    // const file = fs.readFileSync(`./your_picture.png`);
    // const { fullUrl, cid } = await client.ipfs.uploadFile({ file });

    
    const { sdk, address } = getWalletClient(account);
    const collectionSchema = isComposable ? composableCollectionSchema : staticCollectionSchema;
    const { type, title } = props;

    const tokenProperties = SchemaTools.encodeUnique.token(
        {
            image: { ipfsCid },
            encodedAttributes: {
                0: type,
                1: { _: title },
            },
        },
        collectionSchema
    );

    console.log("minting nft...");
    const { error, parsed } = await sdk.token.create.submitWaitResult(
        {
            address,
            collectionId: _collectionId,
            properties: tokenProperties,
        },
        { signer: account }
    );

    if (error) {
        console.log("Error occurred while minting. ", error);
        return null;
    }

    const { collectionId, tokenId } = parsed;
    console.log("new token", collectionId, tokenId);
    return tokenId;
};

export const setNftProperties = async (
    account,
    collectionId,
    tokenId,
    props
) => {
    const { sdk, address } = getWalletClient(account);
    const options = {
        address,
        collectionId,
        tokenId,
        properties: [
            ...props,
            //{ key: "a.0", value: "0"},
            //{ key: "a.1", value: '{"_":"Day BG"}' }
            //{ key: "a.2", value: '{"_":"base64_string"}' }
            //{ key: "i.c", value: 'QmSwfJJnhmAseGTaki1Z8ao6jG8k9pp9nSyXkeHaYqYGMM' }
        ],
    };

    const { error, parsed } = await sdk.token.setProperties.submitWaitResult(
        options,
        { signer: account }
    );

    if (error) {
        console.log("Error occurred while updating. ", error);
        return null;
    }

    const { properties } = parsed;
    console.log("props updated", properties);
    return properties;
};

export const nestTokens = async (account, nestArgs) => {
    const { parentCollection, parentId, childCollection, childId } = nestArgs;
    const { sdk, address } = getWalletClient(account);

    const args = {
        address,
        parent: {
            collectionId: parentCollection,
            tokenId: parentId,
        },
        nested: {
            collectionId: childCollection,
            tokenId: childId,
        },
    };

    console.log("nesting...");
    const { error, parsed } = await sdk.token.nest.submitWaitResult(args, {signer: account});

    if (error) {
        console.log("Error occurred while nesting", error);
        return null;
    }

    const { tokenId } = parsed;
    console.log(`Token ${tokenId} successfully nested`, parsed);
    return tokenId;
};

export const unNestTokens = async (account, nestArgs) => {
    const { parentCollection, parentId, childCollection, childId } = nestArgs;
    const { sdk, address } = getWalletClient(account);

    const args = {
        address,
        parent: {
            collectionId: parentCollection,
            tokenId: parentId,
        },
        nested: {
            collectionId: childCollection,
            tokenId: childId,
        },
    };

    console.log("unnesting...");
    const { error, parsed } = await sdk.token.unnest.submitWaitResult(args, {signer: account});

    if (error) {
        console.log("Error occurred with unnesting", error);
        return null;
    }

    const { collectionId, tokenId } = parsed;
    console.log(`Token ${tokenId} successfully unnested`, parsed);
    return tokenId;
};

export const checkAllowList = async (account, _collectionId) => {
    const { sdk, address:ownerAddress } = await getSeedClient();
    const { addresses } = await sdk.collection.allowList({ collectionId: _collectionId });
    
    const userAddress = `${account.address}`;
    const isAllowed = addresses.findIndex(addr => addr === userAddress) !== -1;


    if (!isAllowed) {
        const { error, parsed } = await sdk.collection.addToAllowList.submitWaitResult({
            address: ownerAddress,
            collectionId: _collectionId,
            newAdminId: userAddress,
        });

        if (error) {
            console.log("Error occurred", error);
            return null;
        }
          
        const { address, collectionId } = parsed;
        console.log(`User ${address} successfully allowed`, collectionId);
        return address;
    }
    
    console.log("User already allowed", isAllowed);
    return null
}

export const checkAdminList = async (account, _collectionId) => {
    const { sdk, address:ownerAddress } = await getSeedClient();
    const { admins } = await sdk.collection.admins({ collectionId: _collectionId });
    
    const userAddress = `${account.address}`;
    const isAllowed = admins.findIndex(addr => addr === userAddress) !== -1;


    if (!isAllowed) {
        const { error, parsed } = await sdk.collection.addAdmin.submitWaitResult({
            address: ownerAddress,
            collectionId: _collectionId,
            newAdmin: userAddress,
        });

        if (error) {
            console.log("Error occurred", error);
            return null;
        }
          
        const { newAdmin, collectionId } = parsed;
        console.log(`User ${newAdmin} successfully allowed`, collectionId);
        return newAdmin;
    }
    
    console.log("User already allowed", isAllowed);
    return null
}

export const sendAirdrop = async (dest) => {
    const { sdk, address } = await getSeedClient();
    const transferArgs = {
        address: address,
        destination: dest,
        amount: 30,
    };
    const transferResult = await sdk.balance.transfer.submitWaitResult(transferArgs);
    return transferResult.parsed;
}

export const uploadFile = async (file) => {
    const client = new Sdk({ baseUrl: 'https://rest.unique.network/opal/v1' });
    const { fullUrl, cid } = await client.ipfs.uploadFile({ file });
    console.log({ fullUrl, cid })
    return { fullUrl, cid };
}

export const uploadJSONFile = async (jsonContent) => {
    const json = JSON.stringify(jsonContent);
	const blob = new Blob([json], { type: 'application/json' });
	const file = new File([ blob ], 'file.json', { type: 'application/json' });

    const rootCid = await storageClient.put([file]);
	console.log(rootCid);
    return rootCid;
}

export const getJSONContent = async (cid) => {
    const _cid = "bafybeif4cdvelodl5ioaqtgmvrsoq7ot4bguyjrgbscua3eepcwgjmjixa";
    const res = await storageClient.get(cid);
    const files = await res.files();
    const textData = await files[0].text();
    return JSON.parse(textData);
}
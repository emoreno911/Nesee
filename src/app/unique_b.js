import Sdk from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";
import {SchemaTools} from '@unique-nft/schemas';
import { baseNetworkURL } from "./utils";

export const getWalletClient = (account) => {
    //const account = accounts[currentAccountIndex];
    const address = account.address;
    const sdk = new Sdk({
        baseUrl: baseNetworkURL,
        signer: account.uniqueSdkSigner,
    });

    return { sdk, address };
}

export const getTokenDetailInfo = async (account, collectionId, tokenId) => {
    const { sdk, address } = getWalletClient(account);

    const tokenDetail = await sdk.token.get({ collectionId, tokenId });
    const bundleInfo = await sdk.token.getBundle({
        collectionId,
        tokenId,
    });

    return { tokenDetail, bundleInfo };
}

export const getBundleInfo = async (account, collectionId, tokenId) => {
    const { sdk, address } = getWalletClient(account);

    const bundleInfo = await sdk.token.getBundle({
        collectionId,
        tokenId,
    });

    return bundleInfo;
}

const collectionSchema = {
    schemaName: 'unique',
    schemaVersion: '1.0.0',
  
    image: { urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}' },
    coverPicture: {
        ipfsCid: 'QmQCYzPwa5N4T4GGY4r5P7ybAPsiZ5YeNpzX6ikw8JAjfW',
    },
  
    attributesSchemaVersion: '1.0.0',
    attributesSchema: {
        0: {
            name: {_: 'type'},
            type: "string",
            optional: false,
            isArray: false,
            enumValues: {
                0: {_: 'background'},
                1: {_: 'none'}
            }
        },
        1: {
            name: {_: 'name'},
            type: "string",
            optional: true,
            isArray: false,
        },
        2: {
            name: {_: 'composition'},
            type: "string",
            optional: true,
            isArray: false,
        } 
    },
}

export const createDynamicCollection = async (account) => {
    const { sdk, address } = getWalletClient(account);
    const propertyPermissions = {
        tokenOwner: true,
        collectionAdmin: true,
        mutable: true,
    }

    const [name, description, tokenPrefix] = ["Live Token", "Updateable collection", "LIV2"];
    console.log("creating dynamic collection...");
    
    const { error, parsed } = await sdk.collection.create.submitWaitResult({
        address,
        name,
        description,
        tokenPrefix,
        schema: collectionSchema,
        permissions: {
            mintMode: true,
            nesting: {
                tokenOwner: true,
                collectionAdmin: true,
            },
        },
        tokenPropertyPermissions: [
            {
              key: 'a.0',
              permission: propertyPermissions,
            },
            {
              key: 'a.1',
              permission: propertyPermissions,
            },
            {
                key: 'a.2',
                permission: propertyPermissions,
            },
            {
                key: 'i.c',
                permission: propertyPermissions,
            }
        ]
    },
    {  
        signer: account 
    });

    if (error) {
        console.log("Error occurred while creating a collection. ", error);
        return null;
    }
    
    const { collectionId } = parsed;
    console.log("new collection", collectionId);

    return collectionId;
}

export const mintDynamicNFT = async (account, collectionId, ipfsCid, props) => {
    // const client = new Sdk({ baseUrl: 'https://rest.unique.network/opal/v1' });
    // const file = fs.readFileSync(`./your_picture.png`);
    // const { fullUrl, cid } = await client.ipfs.uploadFile({ file });

    console.log('minting live nft...')
    const { sdk, address } = getWalletClient(account);

    const tokenProperties = SchemaTools.encodeUnique.token({
        image: { ipfsCid },
        encodedAttributes: { //props
          0: 1,
          1: {_: 'test name'},
        }
      }, 
      collectionSchema
    )

    const { error, parsed } = await sdk.token.create.submitWaitResult(
        {
            address,
            collectionId,
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
}

export const setNftProperties = async (account, collectionId, tokenId, props) => {
    const { sdk, address } = getWalletClient(account);
    const options = {
        address,
        collectionId,
        tokenId,
        properties: [
            ...props,
            //{ key: "a.0", value: "0"},
            //{ key: "a.1", value: '{"_":"Day BG"}' }
            //{ key: "i.c", value: 'QmSwfJJnhmAseGTaki1Z8ao6jG8k9pp9nSyXkeHaYqYGMM' }
        ]
    }

    const { error, parsed } = await sdk.token.setProperties.submitWaitResult(
        options, 
        { signer: account }
    );

    if (error) {
        console.log("Error occurred while minting. ", error);
        return null;
    } 

    const { properties } = parsed;
    console.log("props updated", properties);
    return properties;
}

export const nestTokens = async (
    account,
    { parentCollection, parentToken, childCollection, childToken }
) => {
    const { sdk, address } = getWalletClient(account);

    const args = {
        address,
        parent: {
            collectionId: parentCollection,
            tokenId: parentToken,
        },
        nested: {
            collectionId: childCollection,
            tokenId: childToken,
        }
    };

    console.log("nesting...");
    const { error, parsed } = await sdk.token.nest.submitWaitResult(args);

    if (error) {
        console.log("Error occurred while nesting", error);
        return null;
    }

    const { tokenId } = parsed;
    console.log(`Token ${tokenId} successfully nested`);
    return tokenId;
};
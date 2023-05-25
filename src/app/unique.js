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

    return { sdk, address, seed };
};

export const createCollection = async (account) => {
    const { sdk, address } = getWalletClient(account);

    console.log("creating collection...");
    const { parsed, error } = await sdk.collections.creation.submitWaitResult({
        address,
        name: "HONX Items",
        description: "Test collection",
        tokenPrefix: "HONX",
        //schema: collectionSchema,
        permissions: {
            mintMode: true,
            nesting: {
                tokenOwner: true,
                collectionAdmin: true,
            },
        },
    });

    if (error || !parsed) {
        console.log("Error occurred while creating a collection. ", error);
        return null;
    }

    const { collectionId } = parsed;

    const collection = await sdk.collections.get({ collectionId });
    console.log("new collection", collection);
    return collectionId;
};

export const mintNewBundle = async (account, attrs, _collectionId, ipfsCid) => {
    // const client = new Sdk({ baseUrl: 'https://rest.unique.network/opal/v1' });
    // const file = fs.readFileSync(`./your_picture.png`);
    // const { fullUrl, cid } = await client.ipfs.uploadFile({ file });

    const { sdk, address } = getWalletClient(account);

    const createTokenArgs = {
        address,
        collectionId: _collectionId,
        data: {
            encodedAttributes: attrs,
            image: {
                ipfsCid: ipfsCid,
            },
        },
    };

    const { parsed, error } = await sdk.token.create.submitWaitResult(
        createTokenArgs
    );

    if (error || !parsed) {
        console.log("Error occurred while minting. ", error);
        return null;
    }

    const { collectionId, tokenId } = parsed;
    const token = await sdk.token.get({ collectionId, tokenId });
    console.log("new token", token);
    return tokenId;
};

export const createRftCollection = async (account) => {
    const { sdk, address } = getWalletClient(account);

    const { parsed, error } =
        await sdk.refungible.createCollection.submitWaitResult({
            address,
            name: "Test RFT collection",
            description: "My test RFT collection",
            tokenPrefix: "TSTR",
        });

    if (error || !parsed) {
        console.log("Error occurred while creating a collection. ", error);
        return null;
    }

    const { collectionId } = parsed;
    const rft_collection = await sdk.collections.get({ collectionId });
    console.log("new rft collection", rft_collection);
    return rft_collection;
};

export const mintRefungibleToken = async (account) => {
    const { sdk, address } = getWalletClient(account);

    const createArgs = {
        collectionId: 523,
        data: {
            image: {},
        },
        amount: 20,
    };

    const { parsed, error } = await sdk.refungible.createToken.submitWaitResult(
        {
            address,
            ...createArgs,
        }
    );

    if (error || !parsed) {
        console.log("Error occurred while creating a token");
        return null;
    }

    const { collectionId, tokenId } = parsed;
    const rft_token = await sdk.token.get({ collectionId, tokenId });
    console.log("new rft token", rft_token);
    return tokenId;
};

export const getTokenDetailInfo = async (account, collectionId, tokenId) => {
    const { sdk, address } = getWalletClient(account);

    const tokenDetail = await sdk.token.get({ collectionId, tokenId });

    const bundleInfo = await sdk.token.getBundle({
        collectionId,
        tokenId,
    });
    console.log("bundle", bundleInfo);

    return { tokenDetail, bundleInfo };
};

export const getBundleInfo = async (account, collectionId, tokenId) => {
    const { sdk, address } = getWalletClient(account);

    const bundleInfo = await sdk.token.getBundle({
        collectionId,
        tokenId,
    });

    return bundleInfo;
}

// nest nfts

export const nestRftTokens = async (
    account,
    { parentCollection, parentToken, childCollection, childToken, fragments }
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
        },
        value: fragments,
    };

    console.log("nesting...");
    const result = await sdk.token.nest.submitWaitResult(args);

    if (!result || !result.parsed) {
        console.log("Error occurred while nest");
        return null;
    }

    const { tokenId } = result.parsed;
    console.log(`Token ${tokenId} successfully nested`);
    return tokenId;
};

export const getPiecesCount = async (account, collectionId, tokenId, rftCollection, rftId) => {
    const { sdk, address } = getWalletClient(account);
    const addr = tokenIdToAddress(collectionId, tokenId);
    const amount = await sdk.refungible.getBalance({
        address: addr,
        collectionId: rftCollection,
        tokenId: rftId,
    });

    console.log(addr, rftId, amount)
    return amount.amount;
}

function tokenIdToAddress(collectionId, tokenId) {
    return `0xf8238ccfff8ed887463fd5e0${collectionId.toString(16).padStart(8, '0')}${tokenId.toString(16).padStart(8, '0')}`;
}

export const setPermissions = async (account) => {
    //const { sdk, address } = getSeedClient();
    const { sdk, address } = getWalletClient(account);

    const opts = {
        address: address,
        collectionId: 523,
        permissions: {
          mintMode: true,
          nesting: {
            collectionAdmin: true,
            tokenOwner: true,
          },
        },
      };
      
      const result = await sdk.collections.setPermissions.submitWaitResult(opts);
      
      console.log(
        `Collection #${result.parsed.collectionId} permissions successfully updated`,
      );
}

export const sendAirdrop = async (dest) => {
        const { sdk, address } = await getSeedClient();
        const transferArgs = {
            address: address,
            destination: dest,
            amount: 50,
        };
        const transferResult = await sdk.balance.transfer.submitWaitResult(transferArgs);
        return transferResult.parsed;
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

export const createLiveCollection = async (account) => {
    const { sdk, address } = getWalletClient(account);

    console.log("creating live collection...");
    
    const result = await sdk.collection.create.submitWaitResult({
        address,
        name: "Live Caspers 4",
        description: "Updateable collection",
        tokenPrefix: "CAS4",
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
              permission: {
                tokenOwner: true,
                collectionAdmin: true,
                mutable: true,
              },
            },
            {
              key: 'a.1',
              permission: {
                tokenOwner: true,
                collectionAdmin: true,
                mutable: true,
              },
            },
            {
                key: 'a.2',
                permission: {
                  tokenOwner: true,
                  collectionAdmin: true,
                  mutable: true,
                },
            },
            {
                key: 'i.c',
                permission: {
                  tokenOwner: true,
                  collectionAdmin: true,
                  mutable: true,
                },
            }
        ]
    },
    { signer: account }
    );

    if (result.error) {
        console.log("Error occurred while creating a collection. ", result.error);
        return null;
    }

    console.log(result)
    
    /*const { collectionId } = parsed;

    const collection = await sdk.collections.get({ collectionId });
    console.log("new collection", collection);
    return collectionId;*/
};

export const mintLiveNFT = async (account, attrs, _collectionId, ipfsCid) => {
    // const client = new Sdk({ baseUrl: 'https://rest.unique.network/opal/v1' });
    // const file = fs.readFileSync(`./your_picture.png`);
    // const { fullUrl, cid } = await client.ipfs.uploadFile({ file });

    console.log('minting live nft...')
    const { sdk, address } = getWalletClient(account);

    // const createTokenArgs = {
    //     address,
    //     collectionId: _collectionId,
    //     data: {
    //         encodedAttributes: attrs,
    //         image: {
    //             ipfsCid: ipfsCid,
    //         },
    //     },
    // };

    const tokenProperties = SchemaTools.encodeUnique.token({
        image: {
            ipfsCid: 'QmQCYzPwa5N4T4GGY4r5P7ybAPsiZ5YeNpzX6ikw8JAjfW',
        },
        encodedAttributes: {
          0: 1,
          1: {_: 'test name'},
        }
      }, collectionSchema)

    const result = await sdk.token.create.submitWaitResult(
        {
            address,
            collectionId: 1589,
            properties: tokenProperties,
        }, 
        {signer: account}
    );

    if (result.error) {
        console.log("Error occurred while minting. ", result.error);
        return null;
    }
    else {
        console.log(result)
    }
    

    // const { collectionId, tokenId } = parsed;
    // const token = await sdk.token.get({ collectionId, tokenId });
    // console.log("new token", token);
    // return tokenId;
};

export const setProperties = async (account) => {
    const { sdk, address } = getWalletClient(account);
    const opts = {
        address,
        collectionId: 1589,
        tokenId: 1,
        properties: [
            //{ key: "a.0", value: "0"},
            //{ key: "a.1", value: '{"_":"Day BG"}' }
            { key: "i.c", value: 'QmSwfJJnhmAseGTaki1Z8ao6jG8k9pp9nSyXkeHaYqYGMM' }
        ]
    }

    const result = await sdk.token.setProperties.submitWaitResult(opts, { signer: account });

    console.log(result);
}
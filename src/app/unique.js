import Sdk from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";
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

    console.log(sdk)
    const tokenDetail = await sdk.token.get({ collectionId, tokenId });

    const bundleInfo = await sdk.token.getBundle({
        collectionId,
        tokenId,
    });
    console.log("bundle", bundleInfo);

    return { tokenDetail, bundleInfo };
};

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
  
    image: {
      urlTemplate: 'https://gateway.pinata.cloud/ipfs/{infix}'
    },
  
    coverPicture: {
      ipfsCid: 'QmNiBHiAhsjBXj5cXShDUc5q1dX23CJYrqGGPBNjQCCSXQ'
    },
  
    attributesSchemaVersion: '1.0.0',
    attributesSchema: {
      0: {
        name: {_: 'cid'},
        type: "string",
        optional: true,
        isArray: false,
      },
      1: {
        name: {_: 'type'},
        type: "string",
        optional: false,
        isArray: false,
        enumValues: {
          0: {_: 'node'},
          1: {_: 'campaign'},
          2: {_: 'customer'},
        }
      }
    },
  }
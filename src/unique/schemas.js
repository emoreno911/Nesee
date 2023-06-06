export const tokenPermissions = {
    mintMode: true,
    nesting: {
        tokenOwner: true,
        collectionAdmin: true,
    },
};

export const staticCollectionSchema = {
    schemaName: "unique",
    schemaVersion: "1.0.0",

    image: { urlTemplate: "https://ipfs.unique.network/ipfs/{infix}" },
    coverPicture: {
        ipfsCid: "QmerWjmVQxmSfmwT5yunqGqjzXQPizL2fMW8THopGJiTSj",
    },

    attributesSchemaVersion: "1.0.0",
    attributesSchema: {
        0: {
            name: { _: "type" },
            type: "string",
            optional: false,
            isArray: false,
            enumValues: {
                0: { _: "body" },
                1: { _: "eyes" },
                2: { _: "mouth" },
                3: { _: "hat" },
            },
        },
        1: {
            name: { _: "name" },
            type: "string",
            optional: true,
            isArray: false,
        },
    },
};

export const composableCollectionSchema = {
    schemaName: "unique",
    schemaVersion: "1.0.0",

    image: { urlTemplate: "https://ipfs.unique.network/ipfs/{infix}" },
    coverPicture: {
        ipfsCid: "QmSwQBC1VRXgRf4Lt3U12edd9d9dLH8gAyuniwHfDtfA6a",
    },

    attributesSchemaVersion: "1.0.0",
    attributesSchema: {
        0: {
            name: { _: "type" },
            type: "string",
            optional: false,
            isArray: false,
            enumValues: {
                0: { _: "root" },
                1: { _: "background" },
                2: { _: "body" },
                3: { _: "eyes" },
                4: { _: "mouth" },
                5: { _: "hat" }
            },
        },
        1: {
            name: { _: "name" },
            type: "string",
            optional: true,
            isArray: false,
        },
        2: {
            name: { _: "composition" },
            type: "string",
            optional: true,
            isArray: false,
        },
    },
};

export const composablePropertyPermissions = [
    {
        key: "a.0",
        permission: {
            tokenOwner: true,
            collectionAdmin: true,
            mutable: true,
        },
    },
    {
        key: "a.1",
        permission: {
            tokenOwner: true,
            collectionAdmin: true,
            mutable: true,
        },
    },
    {
        key: "a.2",
        permission: {
            tokenOwner: true,
            collectionAdmin: true,
            mutable: true,
        },
    },
    {
        key: "i.c",
        permission: {
            tokenOwner: true,
            collectionAdmin: true,
            mutable: true,
        },
    },
];

export const buildComposableCollectionSchema = (coverIpfs, types = []) => {
    let typeValues = {};
    types.forEach((value, index) => { typeValues[index] = {_: value} });

    return {
        schemaName: "unique",
        schemaVersion: "1.0.0",
    
        image: { urlTemplate: "https://ipfs.unique.network/ipfs/{infix}" },
        coverPicture: {
            ipfsCid: coverIpfs,
        },
    
        attributesSchemaVersion: "1.0.0",
        attributesSchema: {
            0: {
                name: { _: "type" },
                type: "string",
                optional: false,
                isArray: false,
                enumValues: typeValues,
            },
            1: {
                name: { _: "name" },
                type: "string",
                optional: true,
                isArray: false,
            },
            2: {
                name: { _: "composition" },
                type: "string",
                optional: true,
                isArray: false,
            },
        },
    }
}
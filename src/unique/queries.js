export const graphqlEndpoint = "https://api-opal.uniquescan.io/v1/graphql";

export const collectionsQuery = (owner) =>
    `query {
        collections(
          where: {
            _or: [
              {owner_normalized: {_eq: "${owner}"}},
                {tokens: {owner_normalized: {_eq: "${owner}"}}},
            ]
          },
          order_by: {collection_id: asc}
          offset: 0
          limit: 10
        ) {
          count
          timestamp
          data {
            collection_id
            type
            token_prefix
            name
            collection_cover
            description
          }
        }
      }
    `;

export const collectionsFilterQuery = (filter) =>
    `query {
        collections(
          where: {
            collection_id: {_in: ${JSON.stringify(filter)}}
          },
          order_by: {collection_id: asc}
          offset: 0
          limit: 10
        ) {
          count
          timestamp
          data {
            collection_id
            token_prefix
            name
            collection_cover
          }
        }
      }
    `;


export const tokensQuery = (owner = null, c_filter = null) => {
	const owner_filter = owner === null ? "" : `owner_normalized: {_eq: "${owner}"}`;
	const collection_filter = c_filter === null ? "" : `collection_id: {_in: ${JSON.stringify(c_filter)}}`;
	const has_comma = owner !== null && c_filter !== null ? "," : "";

    return `query {
        tokens(
            where: {
              ${owner_filter}${has_comma}
              ${collection_filter}
            },
            order_by: {collection_id: desc, token_id: asc}
            offset: 0
            limit: 50
          ) {
            count
            timestamp
            data {
              attributes
              collection_id
			        collection_name
              token_id
              token_name
              image
			        children_count
			        type
            }
          }
    }`;
}
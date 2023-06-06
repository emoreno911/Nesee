import axios from "axios";
import { useQuery } from "react-query";
import { graphqlEndpoint, tokensQuery } from "../../unique/queries";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import TokenCard from "./TokenCard";

function Tokens({ owner, collectionIds }) {
    const { data, isLoading, error } = useQuery("tokens", () => {
        return axios({
            url: graphqlEndpoint,
            method: "POST",
            data: {
                query: tokensQuery(owner, collectionIds),
            },
        }).then((response) => response.data.data);
    });

    if (isLoading) return <Loader />;
    if (error) return <EmptyState style="mx-5" message={error.message} />;

    const count = data ? data.tokens.count : 0;
    const tokens = data ? data.tokens.data : [];

    return (
        <div className="flex flex-wrap -mx-4">
            <EmptyState
                style="mx-5"
                message="No Tokens available!"
                condition={count === 0}
            />
            {tokens.map((obj) => (
                <TokenCard key={obj.token_name} data={obj} />
            ))}
        </div>
    );
}

export default Tokens;

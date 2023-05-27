import axios from "axios";
import { useQuery } from "react-query";
import { graphqlEndpoint, collectionsQuery } from "../../unique/queries";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import CollectionCard from "./CollectionCard";

function Collections({ owner }) {
    console.log(owner, Date.now());
    const { data, isLoading, error } = useQuery("collections", () => {
        return axios({
            url: graphqlEndpoint,
            method: "POST",
            data: {
                query: collectionsQuery(owner),
            },
        }).then((response) => response.data.data);
    });

    if (isLoading) return <Loader />;
    if (error) return <EmptyState style="mx-8" message={error.message} />;

    return (
        <div className="flex flex-wrap -mx-4">
            <EmptyState
                style="mx-8"
                message="No Collections available!"
                condition={data.collections.count === 0}
            />
            {data.collections.data.map((obj) => (
                <CollectionCard key={obj.collection_id} data={obj} />
            ))}
        </div>
    );
}

export default Collections;

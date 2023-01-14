import naturalSort from "natural-sort";

export default (arr, sortBy, sortOrder = "desc") => {
    return arr
        ?.map((field) => ({...field, Admins: field.Admins || 0}))
        ?.sort((a, b) =>
            naturalSort({ direction: sortOrder })(a[sortBy], b[sortBy])
        );
};

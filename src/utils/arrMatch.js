export default (arr, filter, reverse = false) => {
    const match =
        reverse ^
        arr.some((word) =>
            Boolean(filter.Name.toLowerCase().match(new RegExp(word)))
        );
    return arr.length == 0 ? true : match;
};

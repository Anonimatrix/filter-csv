export default (arr, filter, column = "Name", reverse = false) => {
    const match =
        reverse ^
        arr.some((word) =>
            Boolean(filter[column].toLowerCase().match(new RegExp(word)))
        );
    return arr.length == 0 ? true : match;
};

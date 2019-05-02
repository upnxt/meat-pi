export default (values, history) => {
    values = history;

    if (values.length > 40) {
        values = values.slice(values.length - 40);
    }

    return values;
};

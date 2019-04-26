export default (values, history) => {
    if (!values || values.length <= 0)
        values = history;
    else 
    {
        const l = history.length - values.length;
        if (l > 0)
            values.concat(history.splice(l));
    }

    if (values.length > 30) {
        values = values.slice(values.length - 30);
    }

    return values;
}
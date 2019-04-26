export default (state) => {
    if (state < 0) {
        return "disabled";
    } else {
        return state == 0 ? "off" : "on";
    }
}
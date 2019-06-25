export default (JSOBJ, fileName) => {
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSOBJ, 0, 4));
    var link = document.createElement("a");
    link.setAttribute("href", `data:${data}`);
    link.setAttribute("download", fileName.split(".")[0] + ".json");
    link.click();
}
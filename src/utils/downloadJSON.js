export default (JSOBJ) => {
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSOBJ, 0, 4));
    var link = document.createElement("a"),
        timeStamp = ((new Date()).toLocaleTimeString()).split(" ").join("-").split(":").join("-");
        console.log(timeStamp);
    link.setAttribute("href", `data:${data}`);
    link.setAttribute("download", 'schematic-data-' + timeStamp + ".json");
    link.click();
}
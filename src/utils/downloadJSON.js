export default (JSOBJ, fileName) => {
    var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSOBJ, 0, 4));
    var fileName = fileName.split(".")[0] + ".json";
    var MIMEType = 'application/json'
    require("downloadjs")(data, fileName, MIMEType); 
}
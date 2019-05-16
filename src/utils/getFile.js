/*global $ */
export default (fileID) => {
    // getting the zeorth element means we only process a single file ,
    // even if multiple files have been uploaded , not the best way but solves our purpose
    const file = document.getElementById(fileID).files[0];

    return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        }
        reader.onerror = () => {
            reject();
        }
        if (file) {
            reader.readAsArrayBuffer(file);
        } else {
            reject();
        }
    });
}
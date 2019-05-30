export default function(dataString) {

    let dataByLine = dataString.split("\n"),
        dataList = [];

    _.map(dataByLine, (d, i) => {
        if (i == 0) {
            d = d.slice(1);
        } else if (i == (dataByLine.length - 1)) {
            d = d.slice(0, -1)
        }
        // cast to a number and round to 3 digits
        d = _.map(_.filter(d.split(/\s+/), (d) => d.length > 0),
            (datapoint) => (Math.round(Number(datapoint) * 1000) / 1000));

        dataList = dataList.concat(d);
    });

    return dataList;
}
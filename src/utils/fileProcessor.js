export default function(dataString) {

    var dataByLine = dataString.split("\n");

    _.map(dataByLine, (d, i) => {

        if (i == 0) {
            d = d.slice(1);
        } else if (i == (dataByLine.length - 1)) {
            d = d.slice(0, -1)
        }

        d = _.map(_.filter(d.split(/\s+/), (d) => d.length > 0), (d) => Number(d));

        debugger;
        dataList = dataList.concat(d.split(/\s+/));
    })
    return _.map(dataList, (d) => Number(d));
}
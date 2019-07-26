export default function(dataList, name, threshold) {

    // weird javascript magic here as we store data to the window 
    // but will eventually move it to redux 
    let previousData = window.gwf || false;

    // start processing only if there are records
    if (dataList.length > 0) {

        // summerFlow is simply the average value of all the records that fall in the summer months
        // which are June,July and August 
        let summerFlows = _.filter(dataList, (d) => {
            const month = Number(d.timestamp.split("/")[0]);
            return (month == 6 || month == 7 || month == 8);
        });
        let summerMajor = Math.round(_.mean(_.map(summerFlows, (d) => d.flow)));

        // winter is simply the average value of all the records that fall in the winter months
        // which are December,January and February 
        let winterFlows = _.filter(dataList, (d) => {
            const month = Number(d.timestamp.split("/")[0]);
            return (month == 1 || month == 2 || month == 12);
        });
        let winterMajor = Math.round(_.mean(_.map(winterFlows, (d) => d.flow)));

        // filter out flow data for june and july when sturgeon spawning is active
        let spawnData = _.filter(dataList, (d) => {
            const month = Number(d.timestamp.split("/")[0]);
            return month == 6 || month == 7;
        })

        // find out the years in which the flow goes below the threshold of 30,000 or 1000 daily flow
        let spawnPostiveYears = _.filter(spawnData, (d) => d.flow > 30000);

        // spawning rate is the number of months when spawning was feasible to total no of months
        let spawningMajor = Math.round((spawnPostiveYears.length / spawnData.length) * 100);

        let summerMinor = '',
            winterMinor = '',
            spawningMinor = '';

        // if there is previous data and it is for the same node 
        // and the previous threshold was base and the current one is five or then
        if (previousData && (name == previousData.name) && previousData.threshold == 'base' && (threshold == 'five' || threshold == 'ten')) {
            summerMinor = -1 * Math.round(((previousData.summerFlow.major - summerMajor) / (previousData.summerFlow.major)) * 100);
            winterMinor = -1 * Math.round(((previousData.winterFlow.major - winterMajor) / (previousData.winterFlow.major)) * 100);
            spawningMinor = -1 * Math.round(((previousData.spawningRate.major - spawningMajor) / (previousData.spawningRate.major)) * 100);
        }

        let metrics = {
            summerFlow: { major: summerMajor, minor: summerMinor },
            winterFlow: { major: winterMajor, minor: winterMinor },
            spawningRate: { major: spawningMajor, minor: spawningMinor },
            threshold,
            name
        };

        // when threshold is five dont set any values
        if (threshold == 'base') {
            window.gwf = {...metrics };
        }

        return metrics;

    }

    return {};
}
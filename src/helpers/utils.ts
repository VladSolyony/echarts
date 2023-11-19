import {TSankey, TSankeyData, TSankeyLinks, TTable} from "../types";

export const isEven = (dataIndex: number) => {
    return dataIndex % 2 === 0;
};

export const getNormalizedSankeyData = (rawTableData: TTable): TSankey => {
    const data: TSankeyData = [];
    const uniqueValues: string[] = [];
    const links: TSankeyLinks = [];

    rawTableData.forEach(
        row => {
            links.push({
                source: row[0].toString(),
                target: row[1].toString(),
                value: +row[3],
            });
            links.push({
                source: row[1].toString(),
                target: row[2].toString(),
                value: +row[3],
            });

            row.forEach((rowItem, index) => {
                if (index !== 3 && !uniqueValues.includes(rowItem.toString())) {
                    uniqueValues.push(rowItem.toString());
                    data.push({name: rowItem.toString()});
                }
            })
        })

    return {data, links};
};

export const getCitiesFromXlsx = (xlsx: TTable): string[] => {
    const cities = xlsx.map(row => row[1]) as string[];
    const uniqueCities = new Set(cities);

    return Array.from(uniqueCities);
}
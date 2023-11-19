type TTableRowItem = string | number;

export type TTableRow = TTableRowItem[];

export type TRawTableRow = {
    [key: string]: string | number;
};

export type TTable = TTableRow[];

export type TSankeyData = { name: string }[];


export type TSankeyLinks = {
        source: string,
        target: string,
        value: number,
    }[];

export type TSankey = {
    data: TSankeyData,
    links: TSankeyLinks,
}

export type handleUpdateChart = {
    updateChart: (selectedCity: string | null) => void,
}

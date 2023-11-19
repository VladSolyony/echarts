import React, {FC, useMemo} from 'react';
import {ColDef} from 'ag-grid-community';
import {AgGridReact} from 'ag-grid-react';
import {TRawTableRow, TTable} from "../types";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import '../styles/Table.scss';

type TTableProps = {
    rawHeadersData: string[],
    rawTableData: TTable,
}

const Table: FC<TTableProps> = ({rawHeadersData, rawTableData}) => {
    const getNormalizedTableHeaders = (rawHeadersData: string[]): ColDef[] => {
        return rawHeadersData.map((header, headerIndex) => ({
            field: header,
            headerName: header,
            rowGroup: headerIndex === 1 || headerIndex === 2 ? true : undefined,
            hide: headerIndex === 1 || headerIndex === 2 ? true : undefined,
            aggFunc: headerIndex === 3 ? 'sum' : undefined,
        }));
    }

    const getNormalizedTableData = (rawTableData: TTable): TRawTableRow[] => rawTableData.map(
        row => row.reduce<TRawTableRow>((rowAcc, rowItem, rowItemIndex) => {
            rowAcc[rawHeadersData[rowItemIndex]] = rowItem;

            return rowAcc;
        }, {}))

    const rowData = useMemo(() => getNormalizedTableData(rawTableData), [rawTableData]);

    const autoGroupColumnDef = useMemo(() => {
        return {
            headerName: rawHeadersData[1],
        };
    }, []);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            sortable: true,
            resizable: true
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <div style={{ height: '100%', width: '100%' }} className="ag-theme-alpine">
                <AgGridReact
                    animateRows
                    rowGroupPanelShow={'always'}
                    defaultColDef={defaultColDef}
                    rowData={rowData}
                    autoGroupColumnDef={autoGroupColumnDef}
                    columnDefs={getNormalizedTableHeaders(rawHeadersData)}
                />
            </div>
        </div>
    );
};

export default Table;
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Sankey from "./components/Sankey";
import Table from "./components/Table";
import * as XLSX from 'xlsx';
import {handleUpdateChart, TTable} from "./types";
import Dropdown from "./components/Dropdown";
import {SelectIcon} from "./components/icons/SelectIcon";
import {CancelIcon} from "./components/icons/CancelIcon";
import FileInput from "./components/FileInput";
import {getCitiesFromXlsx, getNormalizedSankeyData} from "./helpers/utils";
import {ALL} from "./helpers/constants";
import './index.scss';

const App: FC = () => {
    const [parsedXlsx, setParsedXlsx] = useState<TTable | null>(null);
    const [cities, setCities] = useState<string[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedSankeyCity, setSelectedSankeyCity] = useState<string | null>(null);
    const [immutableXlsx, setImmutableXlsx] = useState<TTable | null>(null);
    const childRef = useRef<handleUpdateChart>(null);

    useEffect(() => {
        if (!selectedCity) return;
        if (selectedCity === ALL) {
            setParsedXlsx(immutableXlsx);
            return;
        }

        const clone: TTable = JSON.parse(JSON.stringify(immutableXlsx));
        const filteredXlsx = clone?.filter((item) => item[1] === selectedCity);
        if (filteredXlsx) setParsedXlsx(filteredXlsx);
    }, [selectedCity]);

    const handleFile = async (e: React.FormEvent<HTMLInputElement>): Promise<void> => {
        const files = (e.target as HTMLInputElement).files;

        if (!files) return;
        const data = await files[0].arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: TTable = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
        });

        const [tableHeaders, ...rest] = jsonData;
        setHeaders(tableHeaders as string[]);
        setCities(getCitiesFromXlsx(rest));
        setParsedXlsx(rest);
        setImmutableXlsx(rest);
    };

    const handleSelectNode = useCallback((city: string): void => {
        setSelectedSankeyCity(city);
    }, []);

    const handleSelectCityFromSankey = (): void => {
       setSelectedCity(selectedSankeyCity);
    };

    const handleCancelCityFromSankey = (): void => {
        setSelectedSankeyCity(null);
        childRef.current?.updateChart(null);
    };

    const sankeyData = useMemo(() => {
        if (immutableXlsx) {
            return getNormalizedSankeyData(immutableXlsx);
        }
    }, [immutableXlsx]);

    const handleReset = (): void => {
        setSelectedSankeyCity(null);
        if (selectedCity === null || selectedCity === ALL) return;
        setSelectedCity(null);
        setParsedXlsx(immutableXlsx);
        childRef.current?.updateChart(null);
    };

    const handleSelectedCity = (city: string | null): void => {
        setSelectedCity(city);
        setSelectedSankeyCity(city);
        childRef.current?.updateChart(city);
    };

    return (
        <>
            {parsedXlsx && sankeyData ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <div style={{ display: 'flex', gap: '20px', padding: '10px' }}>
                        <Dropdown
                            value={selectedCity}
                            options={cities}
                            onSelect={handleSelectedCity}
                        />
                        <button
                            className='reset-button'
                            onClick={handleReset}
                            disabled={selectedCity === null || selectedCity === ALL}
                        >
                            Очистить фильтр
                        </button>
                        <div style={{marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center'}}>
                            {(selectedSankeyCity && selectedSankeyCity !== selectedCity)
                                && <span>{`Выбрать "${selectedSankeyCity}"?`}</span>}
                            <button
                                disabled={!selectedSankeyCity}
                                className='select-button'
                                onClick={handleSelectCityFromSankey}
                            >
                                <SelectIcon />
                            </button>
                            <button
                                disabled={!selectedSankeyCity}
                                className='cancel-button'
                                onClick={handleCancelCityFromSankey}
                            >
                                <CancelIcon />
                            </button>
                        </div>
                    </div>
                    <Sankey
                        selectedCity={selectedSankeyCity}
                        ref={childRef}
                        rawHeadersData={headers}
                        sankeyData={sankeyData}
                        onSelect={handleSelectNode}
                    />
                    <FileInput text={'Выбрать другой файл'} onInput={handleFile} />
                    <Table
                        rawHeadersData={headers}
                        rawTableData={parsedXlsx}
                    />
                </div>
            ) : (
                <div className='input-file__wrapper'>
                    <FileInput onInput={handleFile} />
                </div>
            )
            }
        </>
    );
}

export default App;

import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react";
import type {ECharts} from "echarts";
import {getInstanceByDom, init} from "echarts";
import {OptionDataItem} from "echarts/types/src/util/types";
import {handleUpdateChart, TSankey} from "../types";
import {isEven} from "../helpers/utils";

type TSankeyProps = {
    rawHeadersData: string[],
    selectedCity: string | null,
    sankeyData: TSankey,
    onSelect: (city: string) => void,
}

const Sankey: React.ForwardRefRenderFunction<handleUpdateChart, TSankeyProps> = ({
                                                                                     selectedCity,
                                                                                     rawHeadersData,
                                                                                     sankeyData,
                                                                                     onSelect,
                                                                                 }, ref) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const {data, links} = sankeyData;

    const lineStyle = {
        color: 'blue',
        opacity: 0.6,
        width: 10,
    };

    const option = {
        graphic: [
            {
                type: 'text',
                left: '5%', // Позиция над первой колонкой
                top: 'top',
                style: {
                    text: rawHeadersData[0],
                    textAlign: 'center',
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                left: '45%', // Позиция над второй колонкой
                top: 'top',
                style: {
                    text: rawHeadersData[1],
                    textAlign: 'center',
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                left: '80%', // Позиция над третьей колонкой
                top: 'top',
                style: {
                    text: rawHeadersData[2],
                    textAlign: 'center',
                    fontWeight: 'bold'
                }
            }
        ],
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: function (params: any) {
                if (!params.data.value) return;

                return `${params.data.value} ₽`;
            }
        },
        series: {
            type: 'sankey',
            layout: 'none',
            emphasis: {
                focus: 'adjacency',
            },
            data,
            links,
        }
    };

    useImperativeHandle(ref, () => ({
        updateChart(selectedCity: string | null) {
            if (chartRef.current === null) return;
            const chart = getInstanceByDom(chartRef.current);

            const highlightedLinks = links.map(function (link, index) {

                const city = isEven(index) ? link.target : link.source;

                if (city === selectedCity) {
                    return {
                        ...link,
                        lineStyle,
                    }
                } else {
                    return link;
                }
            });

            chart?.setOption({
                series: [
                    {
                        emphasis: {
                            focus: 'line',
                            blurScope: 'coordinateSystem',
                            lineStyle,
                        },
                        data,
                        links: highlightedLinks,
                    },
                ],
            });
        },
    }));

    useEffect(() => {
        let chart: ECharts | undefined;
        if (chartRef.current !== null) {
            chart = init(chartRef.current);
        }

        function resizeChart() {
            chart?.resize();
        }

        window.addEventListener("resize", resizeChart);

        return () => {
            chart?.dispose();
            window.removeEventListener("resize", resizeChart);
        };
    }, []);

    useEffect(() => {
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);

            chart?.setOption(option);
            chart?.on('click', function (params) {
                if (params.dataType === 'edge') {
                    chart.setOption({
                        series: [
                            {
                                emphasis: {
                                    focus: 'line',
                                    blurScope: 'coordinateSystem',
                                    lineStyle,
                                },
                                data,
                                links: option.series.links.map(function (link, index) {
                                    return index === params.dataIndex ? {
                                        ...link,
                                        lineStyle,
                                    } : link;
                                }),
                            },
                        ],
                    });

                    if (params?.event?.offsetX) {
                        const city = isEven(params.dataIndex)
                            ? (params.data as OptionDataItem & { target: string })?.target
                            : (params.data as OptionDataItem & { source: string })?.source;

                        onSelect(city);
                    }
                } else if (params.dataType === 'node') {
                    const cityFromNode = params.name;
                    chart.setOption({
                        series: [
                            {
                                emphasis: {
                                    focus: 'adjacency',
                                },
                                links: links.map(function (link, index) {

                                    const city = isEven(index) ? link.target : link.source;

                                    if (city === cityFromNode) {
                                        return {
                                            ...link,
                                            lineStyle,
                                        }
                                    } else {
                                        return link;
                                    }
                                }),
                            },
                        ],
                    });

                    onSelect(cityFromNode);
                }
            });
        }
    }, []);

    return (
        <div ref={chartRef} style={{width: "100%", height: "100%"}}/>
    );
};

export default forwardRef(Sankey);
import { useState, useEffect, useMemo } from 'react';
import DashboardBox from '@/Components/DashboardBox';
import axios from 'axios';
import { GetKpisResponse, GetProductsResponse } from '@/state/types';
import { Box, Typography, useTheme } from '@mui/material';
import BoxHeader from '@/Components/BoxHeader';
import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
} from 'recharts';
import FlexBetween from '@/Components/FlexBetween';

const pieData = [
    {
        name: "Group A", value: 600
    },
    {
        name: "Group B", value: 400
    }
]

const Row2 = () => {
    const { palette } = useTheme();
    const pieColors = [palette.primary[800], palette.primary[300]];
    const [kpiData, setKpiData] = useState<GetKpisResponse[]>([]);
    const [productData, setProductData] = useState<GetProductsResponse[]>([]);

    const getData = async () => {
        const kpi = await axios.get('https://dashboard-server-34ph.onrender.com/kpi/kpis');
        const product = await axios.get('https://dashboard-server-34ph.onrender.com/product/products');
        setKpiData(kpi.data);
        setProductData(product.data);
    };

    const operationalVsNonOperational = useMemo(() => {
        if (!kpiData.length) return []; // Return empty array if data is not available
        return kpiData[0].monthlyData.map(
            ({ month, operationalExpenses, nonOperationalExpenses }) => ({
                name: month.substring(0, 3),
                'Operational Expenses': operationalExpenses,
                'Non Operational Expenses': nonOperationalExpenses,
            })
        );
    }, [kpiData]);

    const productExpenseData = useMemo(() => {
        if (!productData.length) return []; // Return empty array if data is not available
        return productData.map(
            ({ _id, price, expense }) => ({
                id: _id,
                price: price,
                expense: expense,
            })
        );
    }, [productData]);

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <DashboardBox gridArea='d'>
                <BoxHeader
                    title='Operational VS Non-operational expenses'
                    sideText='+7%'
                />
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                        data={operationalVsNonOperational}
                        margin={{
                            top: 20,
                            right: 0,
                            left: -10,
                            bottom: 45,
                        }}
                    >
                        <defs>
                            <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                                <stop
                                    offset='5%'
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0.5}
                                />
                                <stop
                                    offset='95%'
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient id='colorExpenses' x1='0' y1='0' x2='0' y2='1'>
                                <stop
                                    offset='5%'
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0.5}
                                />
                                <stop
                                    offset='95%'
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke={palette.grey[800]} />
                        <XAxis dataKey='name' tickLine={false} style={{ fontSize: '10px' }} />
                        <YAxis
                            yAxisId={'left'}
                            orientation='left'
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                        />
                        <YAxis
                            yAxisId={'right'}
                            orientation='right'
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                        />
                        <Tooltip />
                        <Legend
                            height={20}
                            wrapperStyle={{
                                margin: '10px 0 10px 0',
                            }}
                        />
                        <Line
                            yAxisId={'left'}
                            type='monotone'
                            dataKey='Non Operational Expenses'
                            stroke={palette.tertiary[500]}
                        />
                        <Line
                            yAxisId={'right'}
                            type='monotone'
                            dataKey='Operational Expenses'
                            stroke={palette.primary.main}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>
            <DashboardBox gridArea='e'>
                <BoxHeader title="Campaigns and Targets" sideText="+4%" />
                <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
                    <PieChart
                        width={110}
                        height={100}
                        margin={{
                            top: 0,
                            right: -10,
                            left: 10,
                            bottom: 0,
                        }}
                    >
                        <Pie
                            stroke="none"
                            data={pieData}
                            innerRadius={18}
                            outerRadius={38}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index]} />
                            ))}
                        </Pie>
                    </PieChart>
                    <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
                        <Typography variant="h5">Target Sales</Typography>
                        <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
                            83
                        </Typography>
                        <Typography variant="h6">
                            Finance goals of the campaign that is desired
                        </Typography>
                    </Box>
                    <Box flexBasis="40%">
                        <Typography variant="h5">Losses in Revenue</Typography>
                        <Typography variant="h6">Losses are down 25%</Typography>
                        <Typography mt="0.4rem" variant="h5">
                            Profit Margins
                        </Typography>
                        <Typography variant="h6">
                            Margins are up by 30% from last month.
                        </Typography>
                    </Box>
                </FlexBetween>

            </DashboardBox>
            <DashboardBox gridArea='f'>
                <BoxHeader title="Product Prices vs Expenses" sideText='+8%' />
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 25,
                            bottom: 40,
                            left: 0,
                        }}
                    >
                        <CartesianGrid stroke={palette.grey[800]} />
                        <XAxis
                            type="number"
                            dataKey="price"
                            name="price"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                            tickFormatter={(v) => `$${v}`}
                        />
                        <YAxis
                            type="number"
                            dataKey="expense"
                            name="expense"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                            tickFormatter={(v) => `$${v}`}
                        />
                        <ZAxis type='number' range={[20]} />
                        <Tooltip formatter={(v) => `$${v}`} />
                        <Scatter name="Product Expense Ratio" data={productExpenseData} fill={palette.tertiary[500]} />
                    </ScatterChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
};

export default Row2;

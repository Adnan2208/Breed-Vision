import React, { useState, useEffect } from 'react';
import {
    Camera,
    Target,
    Percent,
    Award,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    Loader2,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { AppLayout } from '../components/layout';
import { Card, Badge, Button } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const COLORS = {
    primary: '#0F766E',
    secondary: '#FB7185',
    accent: '#FBBF24',
    primaryLight: '#14B8A6',
    chart1: '#0F766E',
    chart2: '#FB7185',
    chart3: '#FBBF24',
    chart4: '#8B5CF6',
    chart5: '#10B981',
    chart6: '#F59E0B'
};

const AnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/analytics`);
            const result = await response.json();
            
            if (result.success) {
                setAnalyticsData(result.data);
            } else {
                setError(result.message || 'Failed to fetch analytics data');
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    // Extract data with defaults
    const kpis = analyticsData?.kpis || {
        totalImagesProcessed: 0,
        mostDetectedBreed: 'N/A',
        mostDetectedBreedCount: 0,
        avgConfidence: 0,
        modelAccuracy: 0
    };
    const breedDistribution = analyticsData?.breedDistribution || [];
    const accuracyOverTime = analyticsData?.accuracyOverTime || [];
    const regionalData = analyticsData?.regionalData || [];
    const monthlyDetections = analyticsData?.monthlyDetections || [];

    // KPI Cards data
    const kpiCards = [
        {
            title: 'Total Images Processed',
            value: kpis.totalImagesProcessed.toLocaleString(),
            icon: Camera,
            color: 'primary'
        },
        {
            title: 'Most Detected Breed',
            value: kpis.mostDetectedBreed,
            subtitle: `${kpis.mostDetectedBreedCount.toLocaleString()} detections`,
            icon: Target,
            color: 'secondary'
        },
        {
            title: 'Average Confidence',
            value: `${kpis.avgConfidence}%`,
            icon: Percent,
            color: 'accent'
        },
        {
            title: 'Model Accuracy',
            value: `${kpis.modelAccuracy}%`,
            icon: Award,
            color: 'primary'
        }
    ];

    // Pie chart colors
    const pieColors = [COLORS.chart1, COLORS.chart2, COLORS.chart3, COLORS.chart4, COLORS.chart5, COLORS.chart6];

    // Get unique breeds from regional data for the legend
    const getRegionalBreeds = () => {
        if (regionalData.length === 0) return [];
        const firstRegion = regionalData[0];
        return Object.keys(firstRegion).filter(key => key !== 'region').slice(0, 3);
    };

    const regionalBreeds = getRegionalBreeds();

    if (loading) {
        return (
            <AppLayout>
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-text-secondary">Loading analytics data...</p>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-red-50 rounded-2xl p-8 text-center max-w-md">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Load Data</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button variant="primary" onClick={fetchAnalyticsData} icon={RefreshCw}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const hasNoData = kpis.totalImagesProcessed === 0 && breedDistribution.length === 0;

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h2 className="text-sm text-text-muted uppercase tracking-wide mb-2">
                            Performance Metrics
                        </h2>
                        <p className="text-text-secondary max-w-2xl">
                            Track breed detection statistics, model performance, and regional distribution
                            across all processed images.
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchAnalyticsData}
                        icon={RefreshCw}
                    >
                        Refresh
                    </Button>
                </div>

                {hasNoData ? (
                    <Card padding="lg" className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <Camera className="w-10 h-10 text-text-muted" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">No Data Yet</h3>
                        <p className="text-text-secondary max-w-md mx-auto mb-6">
                            Start analyzing cattle images and adding cattle data to see analytics here.
                            Use the Analyze page to upload images and record cattle information.
                        </p>
                        <Button variant="primary" onClick={() => window.location.href = '/analyze'}>
                            Go to Analyze Page
                        </Button>
                    </Card>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {kpiCards.map((kpi, index) => (
                                <Card
                                    key={index}
                                    padding="lg"
                                    className="relative overflow-hidden group"
                                >
                                    <div className={`
                                        absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10
                                        ${kpi.color === 'primary' ? 'bg-primary' : ''}
                                        ${kpi.color === 'secondary' ? 'bg-secondary' : ''}
                                        ${kpi.color === 'accent' ? 'bg-accent' : ''}
                                    `} />

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`
                                                w-12 h-12 rounded-xl flex items-center justify-center
                                                ${kpi.color === 'primary' ? 'bg-primary/10' : ''}
                                                ${kpi.color === 'secondary' ? 'bg-secondary/10' : ''}
                                                ${kpi.color === 'accent' ? 'bg-accent/20' : ''}
                                            `}>
                                                <kpi.icon className={`
                                                    w-6 h-6
                                                    ${kpi.color === 'primary' ? 'text-primary' : ''}
                                                    ${kpi.color === 'secondary' ? 'text-secondary' : ''}
                                                    ${kpi.color === 'accent' ? 'text-accent-dark' : ''}
                                                `} />
                                            </div>
                                        </div>

                                        <p className="text-sm text-text-muted mb-1">{kpi.title}</p>
                                        <p className="text-2xl font-bold text-text">{kpi.value}</p>
                                        {kpi.subtitle && (
                                            <p className="text-sm text-text-secondary mt-1">{kpi.subtitle}</p>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid lg:grid-cols-2 gap-6 mb-8">
                            {/* Breed Distribution Bar Chart */}
                            <Card padding="lg">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text">Breed-wise Detection</h3>
                                        <p className="text-sm text-text-muted">Number of detections per breed</p>
                                    </div>
                                    <Badge variant="primary">Last 6 months</Badge>
                                </div>
                                <div className="h-80">
                                    {breedDistribution.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={breedDistribution} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis type="number" tick={{ fill: '#57534E', fontSize: 12 }} />
                                                <YAxis
                                                    dataKey="breed"
                                                    type="category"
                                                    width={80}
                                                    tick={{ fill: '#57534E', fontSize: 12 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    fill={COLORS.primary}
                                                    radius={[0, 8, 8, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-text-muted">
                                            No breed data available
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Accuracy Over Time Line Chart */}
                            <Card padding="lg">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text">Model Accuracy Trend</h3>
                                        <p className="text-sm text-text-muted">Performance over time</p>
                                    </div>
                                    {accuracyOverTime.length >= 2 && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                                            <span className="text-green-600 font-medium">
                                                +{(accuracyOverTime[accuracyOverTime.length - 1]?.accuracy - accuracyOverTime[0]?.accuracy).toFixed(1)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="h-80">
                                    {accuracyOverTime.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={accuracyOverTime}>
                                                <defs>
                                                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fill: '#57534E', fontSize: 12 }}
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{ fill: '#57534E', fontSize: 12 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                    }}
                                                    formatter={(value) => [`${value}%`, 'Accuracy']}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="accuracy"
                                                    stroke={COLORS.primary}
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorAccuracy)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-text-muted">
                                            No accuracy data available
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Charts Row 2 */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Breed Distribution Pie Chart */}
                            <Card padding="lg">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-text">Breed Distribution</h3>
                                    <p className="text-sm text-text-muted">Percentage breakdown</p>
                                </div>
                                <div className="h-64">
                                    {breedDistribution.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={breedDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    paddingAngle={2}
                                                    dataKey="count"
                                                >
                                                    {breedDistribution.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={pieColors[index % pieColors.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                    }}
                                                    formatter={(value, name, props) => [value, props.payload.breed]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-text-muted">
                                            No data available
                                        </div>
                                    )}
                                </div>
                                {/* Legend */}
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {breedDistribution.slice(0, 4).map((item, index) => (
                                        <div key={item.breed} className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: pieColors[index] }}
                                            />
                                            <span className="text-sm text-text-secondary truncate">
                                                {item.breed}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Monthly Detections */}
                            <Card padding="lg" className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text">Monthly Detections</h3>
                                        <p className="text-sm text-text-muted">Detection volume trend</p>
                                    </div>
                                    {monthlyDetections.length >= 2 && (
                                        <Badge variant="accent">
                                            Growth: +{Math.round(
                                                ((monthlyDetections[monthlyDetections.length - 1]?.detections - monthlyDetections[0]?.detections) /
                                                (monthlyDetections[0]?.detections || 1)) * 100
                                            )}%
                                        </Badge>
                                    )}
                                </div>
                                <div className="h-64">
                                    {monthlyDetections.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyDetections}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fill: '#57534E', fontSize: 12 }}
                                                />
                                                <YAxis
                                                    tick={{ fill: '#57534E', fontSize: 12 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="detections"
                                                    fill={COLORS.secondary}
                                                    radius={[8, 8, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-text-muted">
                                            No monthly data available
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Regional Comparison */}
                        {regionalData.length > 0 && (
                            <Card padding="lg" className="mt-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text">Regional Breed Comparison</h3>
                                        <p className="text-sm text-text-muted">Breed detection by state</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {regionalBreeds.map((breed, index) => (
                                            <div key={breed} className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: [COLORS.chart1, COLORS.chart2, COLORS.chart3][index] }}
                                                />
                                                <span className="text-sm text-text-secondary capitalize">
                                                    {breed.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={regionalData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis
                                                dataKey="region"
                                                tick={{ fill: '#57534E', fontSize: 12 }}
                                            />
                                            <YAxis
                                                tick={{ fill: '#57534E', fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Legend />
                                            {regionalBreeds.map((breed, index) => (
                                                <Bar
                                                    key={breed}
                                                    dataKey={breed}
                                                    name={breed.replace(/_/g, ' ')}
                                                    fill={[COLORS.chart1, COLORS.chart2, COLORS.chart3][index]}
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default AnalyticsPage;
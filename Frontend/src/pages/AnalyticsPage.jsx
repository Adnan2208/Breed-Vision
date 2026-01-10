import React from 'react';
import {
    Camera,
    Target,
    Percent,
    Award,
    TrendingUp,
    TrendingDown,
    ArrowUpRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
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
import { Card, Badge } from '../components/ui';
import { analyticsData } from '../data/mockData';

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
    const { kpis, breedDistribution, accuracyOverTime, regionalData, monthlyDetections } = analyticsData;

    // KPI Cards data
    const kpiCards = [
        {
            title: 'Total Images Processed',
            value: kpis.totalImagesProcessed.toLocaleString(),
            change: '+12.5%',
            trend: 'up',
            icon: Camera,
            color: 'primary'
        },
        {
            title: 'Most Detected Breed',
            value: kpis.mostDetectedBreed,
            subtitle: '4,520 detections',
            icon: Target,
            color: 'secondary'
        },
        {
            title: 'Average Confidence',
            value: `${kpis.avgConfidence}%`,
            change: '+2.3%',
            trend: 'up',
            icon: Percent,
            color: 'accent'
        },
        {
            title: 'Model Accuracy',
            value: `${kpis.modelAccuracy}%`,
            change: '+1.2%',
            trend: 'up',
            icon: Award,
            color: 'primary'
        }
    ];

    // Pie chart colors
    const pieColors = [COLORS.chart1, COLORS.chart2, COLORS.chart3, COLORS.chart4, COLORS.chart5, COLORS.chart6];

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-sm text-text-muted uppercase tracking-wide mb-2">
                        Performance Metrics
                    </h2>
                    <p className="text-text-secondary max-w-2xl">
                        Track breed detection statistics, model performance, and regional distribution
                        across all processed images.
                    </p>
                </div>

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
                                    {kpi.change && (
                                        <Badge
                                            variant={kpi.trend === 'up' ? 'success' : 'error'}
                                            size="sm"
                                        >
                                            {kpi.trend === 'up' ? (
                                                <TrendingUp className="w-3 h-3 mr-1" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3 mr-1" />
                                            )}
                                            {kpi.change}
                                        </Badge>
                                    )}
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
                        </div>
                    </Card>

                    {/* Accuracy Over Time Line Chart */}
                    <Card padding="lg">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-text">Model Accuracy Trend</h3>
                                <p className="text-sm text-text-muted">Performance over time</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 font-medium">+6.0%</span>
                            </div>
                        </div>
                        <div className="h-80">
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
                                        domain={[85, 100]}
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
                                    />
                                </PieChart>
                            </ResponsiveContainer>
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
                            <Badge variant="accent">Growth: +56%</Badge>
                        </div>
                        <div className="h-64">
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
                        </div>
                    </Card>
                </div>

                {/* Regional Comparison */}
                <Card padding="lg" className="mt-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-text">Regional Breed Comparison</h3>
                            <p className="text-sm text-text-muted">Breed detection by state</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {['Gir', 'Sahiwal', 'Kankrej'].map((breed, index) => (
                                <div key={breed} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: [COLORS.chart1, COLORS.chart2, COLORS.chart3][index] }}
                                    />
                                    <span className="text-sm text-text-secondary">{breed}</span>
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
                                <Bar dataKey="gir" name="Gir" fill={COLORS.chart1} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="sahiwal" name="Sahiwal" fill={COLORS.chart2} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="kankrej" name="Kankrej" fill={COLORS.chart3} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
};

export default AnalyticsPage;

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Share2,
  Calendar as CalendarIcon,
  Filter,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

const mockData = {
  overview: {
    totalUsers: 45231,
    newUsers: 2340,
    pageViews: 128943,
    sessionDuration: "4m 32s",
    bounceRate: 34.2,
    conversionRate: 3.24
  },
  timeSeries: [
    { date: '2024-01-01', users: 2400, sessions: 1800, pageViews: 4800, revenue: 2400 },
    { date: '2024-01-02', users: 1398, sessions: 1200, pageViews: 3200, revenue: 1398 },
    { date: '2024-01-03', users: 9800, sessions: 7200, pageViews: 19200, revenue: 9800 },
    { date: '2024-01-04', users: 3908, sessions: 2800, pageViews: 7600, revenue: 3908 },
    { date: '2024-01-05', users: 4800, sessions: 3600, pageViews: 9600, revenue: 4800 },
    { date: '2024-01-06', users: 3800, sessions: 2900, pageViews: 8200, revenue: 3800 },
    { date: '2024-01-07', users: 4300, sessions: 3200, pageViews: 8800, revenue: 4300 },
  ],
  deviceData: [
    { name: 'Desktop', value: 45, count: 20456 },
    { name: 'Mobile', value: 35, count: 15886 },
    { name: 'Tablet', value: 20, count: 9074 }
  ],
  trafficSources: [
    { source: 'Organic Search', visitors: 15420, percentage: 34 },
    { source: 'Direct', visitors: 12340, percentage: 27 },
    { source: 'Social Media', visitors: 8920, percentage: 20 },
    { source: 'Email', visitors: 6540, percentage: 14 },
    { source: 'Paid Ads', visitors: 2011, percentage: 5 }
  ],
  topPages: [
    { page: '/dashboard', views: 15420, bounceRate: 23.4, avgTime: '3:24' },
    { page: '/products', views: 12340, bounceRate: 34.2, avgTime: '2:45' },
    { page: '/about', views: 8920, bounceRate: 45.6, avgTime: '1:32' },
    { page: '/contact', views: 6540, bounceRate: 67.8, avgTime: '0:58' },
    { page: '/pricing', views: 4320, bounceRate: 23.1, avgTime: '2:12' }
  ],
  realtime: {
    activeUsers: 1247,
    currentPageViews: 89,
    topPagesRealtime: [
      { page: '/dashboard', users: 234 },
      { page: '/products', users: 189 },
      { page: '/about', users: 145 },
      { page: '/pricing', users: 98 }
    ]
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("7d");
  const [selectedDate, setSelectedDate] = useState<Date>();

  const MetricCard = ({ title, value, change, changeType, icon: Icon }: {
    title: string;
    value: string | number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: any;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            <div className={`flex items-center text-sm mt-1 ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {changeType === 'positive' ? <TrendingUp className="w-4 h-4 mr-1" /> :
               changeType === 'negative' ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
              {change}
            </div>
          </div>
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your website performance and user behavior</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Today</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-32 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={mockData.overview.totalUsers}
            change="+12.5%"
            changeType="positive"
            icon={Users}
          />
          <MetricCard
            title="New Users"
            value={mockData.overview.newUsers}
            change="+8.2%"
            changeType="positive"
            icon={TrendingUp}
          />
          <MetricCard
            title="Page Views"
            value={mockData.overview.pageViews}
            change="+15.3%"
            changeType="positive"
            icon={Eye}
          />
          <MetricCard
            title="Avg. Session"
            value={mockData.overview.sessionDuration}
            change="+2.1%"
            changeType="positive"
            icon={Clock}
          />
          <MetricCard
            title="Bounce Rate"
            value={`${mockData.overview.bounceRate}%`}
            change="-3.4%"
            changeType="positive"
            icon={MousePointer}
          />
          <MetricCard
            title="Conversion"
            value={`${mockData.overview.conversionRate}%`}
            change="+0.8%"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Real-time Activity
              </CardTitle>
              <CardDescription>Live user activity on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{mockData.realtime.activeUsers}</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{mockData.realtime.currentPageViews}</div>
                  <div className="text-sm text-muted-foreground">Current Page Views</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {mockData.realtime.topPagesRealtime.map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{page.page}</span>
                    <Badge variant="secondary">{page.users} users</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>User distribution by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mockData.deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockData.deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.trafficSources.slice(0, 3).map((source, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{source.source}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold">{source.visitors.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth Trend</CardTitle>
                  <CardDescription>Daily active users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockData.timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Analytics</CardTitle>
                  <CardDescription>Sessions and page views comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockData.timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#82ca9d" />
                      <Bar dataKey="pageViews" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-muted-foreground w-8">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{page.page}</div>
                          <div className="text-sm text-muted-foreground">
                            {page.views.toLocaleString()} views
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{page.avgTime}</span>
                          <span className="text-muted-foreground"> avg time</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{page.bounceRate}%</span>
                          <span className="text-muted-foreground"> bounce rate</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">United States</span>
                      <span className="font-medium">34.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">United Kingdom</span>
                      <span className="font-medium">18.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Germany</span>
                      <span className="font-medium">12.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Canada</span>
                      <span className="font-medium">8.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Others</span>
                      <span className="font-medium">25.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={mockData.deviceData}>
                      <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>18-24</span>
                        <span>23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '23%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>25-34</span>
                        <span>41%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '41%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>35-44</span>
                        <span>24%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '24%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>45+</span>
                        <span>12%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '12%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Flow</CardTitle>
                  <CardDescription>How users navigate through your site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <div className="font-medium">Homepage</div>
                        <div className="text-sm text-muted-foreground">Entry point</div>
                      </div>
                      <div className="ml-auto text-sm font-medium">100%</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200 ml-4"></div>
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">2</span>
                      </div>
                      <div>
                        <div className="font-medium">Product Page</div>
                        <div className="text-sm text-muted-foreground">75% continue here</div>
                      </div>
                      <div className="ml-auto text-sm font-medium">75%</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200 ml-4"></div>
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">3</span>
                      </div>
                      <div>
                        <div className="font-medium">Checkout</div>
                        <div className="text-sm text-muted-foreground">45% complete purchase</div>
                      </div>
                      <div className="ml-auto text-sm font-medium">45%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Tracking</CardTitle>
                  <CardDescription>User interactions and conversions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Button Clicks</span>
                      <span className="font-medium">12,543</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Form Submissions</span>
                      <span className="font-medium">3,421</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Downloads</span>
                      <span className="font-medium">987</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Video Plays</span>
                      <span className="font-medium">2,345</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Social Shares</span>
                      <span className="font-medium">567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Page Performance</CardTitle>
                <CardDescription>Loading times and user experience metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Page</th>
                        <th className="text-right p-2">Load Time</th>
                        <th className="text-right p-2">First Paint</th>
                        <th className="text-right p-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Homepage</td>
                        <td className="text-right p-2">1.2s</td>
                        <td className="text-right p-2">0.8s</td>
                        <td className="text-right p-2">
                          <Badge className="bg-green-100 text-green-800">Good</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Product Page</td>
                        <td className="text-right p-2">2.1s</td>
                        <td className="text-right p-2">1.4s</td>
                        <td className="text-right p-2">
                          <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Checkout</td>
                        <td className="text-right p-2">3.2s</td>
                        <td className="text-right p-2">2.1s</td>
                        <td className="text-right p-2">
                          <Badge variant="destructive">Poor</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">3.24%</div>
                  <p className="text-sm text-muted-foreground">+0.8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Goal Completions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,247</div>
                  <p className="text-sm text-muted-foreground">+12.3% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue per User</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$34.50</div>
                  <p className="text-sm text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer LTV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$127.80</div>
                  <p className="text-sm text-muted-foreground">+8.7% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Track user journey from awareness to conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">Awareness</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div className="bg-blue-600 h-8 rounded-full" style={{width: '100%'}}></div>
                      <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                        100,000 visitors
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">Interest</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div className="bg-blue-600 h-8 rounded-full" style={{width: '60%'}}></div>
                      <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                        60,000 engaged
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">Consideration</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div className="bg-blue-600 h-8 rounded-full" style={{width: '25%'}}></div>
                      <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                        25,000 considering
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">Purchase</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div className="bg-blue-600 h-8 rounded-full" style={{width: '5%'}}></div>
                      <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                        5,000 converted
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

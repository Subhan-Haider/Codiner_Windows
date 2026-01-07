import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Download,
  Share2,
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Mail,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";

const mockReports = [
  {
    id: 1,
    name: "Monthly User Growth Report",
    description: "Comprehensive analysis of user acquisition and retention metrics",
    type: "growth",
    status: "completed",
    createdAt: "2024-01-15",
    lastRun: "2024-01-15",
    schedule: "Monthly",
    recipients: 3,
    downloads: 24
  },
  {
    id: 2,
    name: "Revenue Analytics Q4 2023",
    description: "Quarterly revenue breakdown and forecasting",
    type: "revenue",
    status: "completed",
    createdAt: "2024-01-01",
    lastRun: "2024-01-01",
    schedule: "Quarterly",
    recipients: 5,
    downloads: 67
  },
  {
    id: 3,
    name: "Product Performance Dashboard",
    description: "Real-time product usage and engagement metrics",
    type: "product",
    status: "running",
    createdAt: "2024-01-10",
    lastRun: "2024-01-14",
    schedule: "Daily",
    recipients: 2,
    downloads: 12
  },
  {
    id: 4,
    name: "Customer Satisfaction Survey",
    description: "Monthly customer feedback and NPS analysis",
    type: "feedback",
    status: "scheduled",
    createdAt: "2024-01-12",
    lastRun: null,
    schedule: "Weekly",
    recipients: 1,
    downloads: 8
  }
];

const reportTemplates = [
  {
    id: "user-growth",
    name: "User Growth Analysis",
    description: "Track user acquisition, retention, and churn metrics",
    icon: Users,
    metrics: ["New Users", "Active Users", "Retention Rate", "Churn Rate"]
  },
  {
    id: "revenue",
    name: "Revenue Analytics",
    description: "Comprehensive revenue tracking and forecasting",
    icon: DollarSign,
    metrics: ["MRR", "ARR", "LTV", "CAC", "Conversion Rate"]
  },
  {
    id: "product-usage",
    name: "Product Usage",
    description: "Feature adoption and product engagement metrics",
    icon: BarChart3,
    metrics: ["Daily Active Users", "Feature Usage", "Session Duration", "Bounce Rate"]
  },
  {
    id: "marketing",
    name: "Marketing Performance",
    description: "Campaign effectiveness and channel analysis",
    icon: TrendingUp,
    metrics: ["Traffic Sources", "Conversion Funnel", "ROI", "Customer Acquisition Cost"]
  }
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("reports");
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState("30d");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [schedule, setSchedule] = useState("weekly");
  const [recipients, setRecipients] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "growth":
        return <Users className="w-4 h-4" />;
      case "revenue":
        return <DollarSign className="w-4 h-4" />;
      case "product":
        return <BarChart3 className="w-4 h-4" />;
      case "feedback":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleCreateReport = () => {
    // Handle report creation
    console.log("Creating report:", {
      name: reportName,
      description: reportDescription,
      metrics: selectedMetrics,
      schedule,
      recipients
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Create, manage, and share comprehensive reports</p>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share Report
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="dateRange">Date Range:</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Label>Report Type:</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="growth">User Growth</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="product">Product Usage</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Label>Status:</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="create">Create Report</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Library</CardTitle>
                <CardDescription>Manage your existing reports and schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(report.type)}
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-gray-500">{report.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {report.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{report.schedule}</TableCell>
                        <TableCell>{report.lastRun || "Never"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <Icon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 mb-2">Includes metrics:</div>
                        {template.metrics.map((metric, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full mt-4" size="sm">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Report</CardTitle>
                  <CardDescription>Configure your custom report parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reportName">Report Name</Label>
                    <Input
                      id="reportName"
                      placeholder="Enter report name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportDescription">Description</Label>
                    <textarea
                      id="reportDescription"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe what this report will analyze"
                      rows={3}
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Select Metrics</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "User Growth", "Revenue", "Conversion Rate", "Bounce Rate",
                        "Page Views", "Session Duration", "Traffic Sources", "Device Types"
                      ].map((metric) => (
                        <div key={metric} className="flex items-center space-x-2">
                          <Checkbox
                            id={metric}
                            checked={selectedMetrics.includes(metric)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedMetrics([...selectedMetrics, metric]);
                              } else {
                                setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                              }
                            }}
                          />
                          <Label htmlFor={metric} className="text-sm">{metric}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Schedule</Label>
                      <Select value={schedule} onValueChange={setSchedule}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipients">Email Recipients</Label>
                      <Input
                        id="recipients"
                        placeholder="user@example.com"
                        value={recipients}
                        onChange={(e) => setRecipients(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button onClick={handleCreateReport} className="w-full">
                    Create Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>See how your report will look</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium mb-2">
                        {reportName || "Report Title"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {reportDescription || "Report description will appear here"}
                      </p>

                      {selectedMetrics.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Selected Metrics:</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedMetrics.map((metric, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Schedule: {schedule} • Recipients: {recipients || "None specified"}
                        </div>
                      </div>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                      Preview will update as you configure your report
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common report management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <Download className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Export All Reports</div>
                  <div className="text-sm text-gray-600">Download all reports as PDF</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <Mail className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Schedule Digest</div>
                  <div className="text-sm text-gray-600">Set up weekly report summaries</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <Share2 className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Share Dashboard</div>
                  <div className="text-sm text-gray-600">Generate shareable dashboard links</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

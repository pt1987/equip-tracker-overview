
import { useState, useEffect } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getVendorPurchaseReport } from '@/data/reports';
import { formatCurrency } from '@/lib/utils';
import { VendorPurchaseReport as VendorPurchaseReportType } from '@/lib/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export default function VendorPurchaseReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<VendorPurchaseReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportData = await getVendorPurchaseReport();
        setData(reportData);
      } catch (error) {
        console.error("Failed to fetch vendor purchase data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredData = data.filter(item => 
    item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get total assets count and revenue across all vendors
  const totalAssets = data.reduce((sum, vendor) => sum + vendor.assetCount, 0);
  const totalRevenue = data.reduce((sum, vendor) => sum + vendor.revenue, 0);

  const pieChartData = data.map((item, index) => ({
    name: item.vendor,
    value: item.assetCount,
    color: COLORS[index % COLORS.length]
  }));

  const revenueChartData = data.map((item, index) => ({
    name: item.vendor,
    value: item.revenue,
    color: COLORS[index % COLORS.length]
  }));

  // Get manufacturer data for the selected vendor
  const selectedVendorData = selectedVendor 
    ? data.find(v => v.vendor === selectedVendor) 
    : null;

  const manufacturerChartData = selectedVendorData?.manufacturerDistribution.map((item, index) => ({
    name: item.manufacturer,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading data...</div>;
  }

  if (!data.length) {
    return <div className="text-center py-8">No vendor purchase data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Input
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Asset Distribution by Vendor</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} assets`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Revenue Distribution by Vendor</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {revenueChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Asset Count</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Revenue %</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.vendor}>
                <TableCell className="font-medium">{item.vendor}</TableCell>
                <TableCell>{item.assetCount}</TableCell>
                <TableCell>{totalAssets > 0 ? ((item.assetCount / totalAssets) * 100).toFixed(1) : 0}%</TableCell>
                <TableCell>{formatCurrency(item.revenue)}</TableCell>
                <TableCell>{totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(1) : 0}%</TableCell>
                <TableCell>
                  <button 
                    onClick={() => setSelectedVendor(selectedVendor === item.vendor ? null : item.vendor)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {selectedVendor === item.vendor ? 'Hide Details' : 'Show Details'}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedVendor && selectedVendorData && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Manufacturer Distribution for {selectedVendor}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={manufacturerChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {manufacturerChartData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} assets`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedVendorData.manufacturerDistribution.map((item) => (
                      <TableRow key={item.manufacturer}>
                        <TableCell className="font-medium">{item.manufacturer}</TableCell>
                        <TableCell>{item.count}</TableCell>
                        <TableCell>
                          {((item.count / selectedVendorData.assetCount) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

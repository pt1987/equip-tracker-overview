
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, DatabaseIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { migrateAllData, migrateEmployees, migrateAssets, migrateAssetHistory, checkDataExists } from "@/scripts/dataMigration";
import { supabase } from "@/integrations/supabase/client";

export default function DataMigration() {
  const [migrating, setMigrating] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    employees: false,
    assets: false,
    assetHistory: false,
    all: false
  });
  const [dataStatus, setDataStatus] = useState<Record<string, number>>({
    employees: 0,
    assets: 0,
    assetHistory: 0
  });

  // Check current data status
  const checkDataStatus = async () => {
    try {
      // Check employees
      const { count: empCount, error: empError } = await supabase
        .from('employees')
        .select('*', { count: 'exact' });
      
      if (!empError) {
        setDataStatus(prev => ({ ...prev, employees: empCount || 0 }));
        setCompleted(prev => ({ ...prev, employees: (empCount || 0) > 0 }));
      }
      
      // Check assets
      const { count: assetCount, error: assetError } = await supabase
        .from('assets')
        .select('*', { count: 'exact' });
      
      if (!assetError) {
        setDataStatus(prev => ({ ...prev, assets: assetCount || 0 }));
        setCompleted(prev => ({ ...prev, assets: (assetCount || 0) > 0 }));
      }
      
      // Check asset history
      const { count: historyCount, error: historyError } = await supabase
        .from('asset_history')
        .select('*', { count: 'exact' });
      
      if (!historyError) {
        setDataStatus(prev => ({ ...prev, assetHistory: historyCount || 0 }));
        setCompleted(prev => ({ ...prev, assetHistory: (historyCount || 0) > 0 }));
      }
      
      // Set all as completed if all individual items are completed
      if ((empCount || 0) > 0 && (assetCount || 0) > 0 && (historyCount || 0) > 0) {
        setCompleted(prev => ({ ...prev, all: true }));
      }
    } catch (error) {
      console.error("Error checking data status:", error);
    }
  };

  useEffect(() => {
    checkDataStatus();
  }, []);

  const handleMigrate = async (type: 'employees' | 'assets' | 'assetHistory' | 'all') => {
    setMigrating(type);
    try {
      switch (type) {
        case 'employees':
          await migrateEmployees();
          break;
        case 'assets':
          await migrateAssets();
          break;
        case 'assetHistory':
          await migrateAssetHistory();
          break;
        case 'all':
          await migrateAllData();
          setCompleted({
            employees: true,
            assets: true,
            assetHistory: true,
            all: true
          });
          break;
      }
      
      if (type !== 'all') {
        setCompleted(prev => ({ ...prev, [type]: true }));
      }
      
      // Refresh data status after migration
      await checkDataStatus();
      
      toast.success(`${type === 'all' ? 'All data' : type} has been migrated to Supabase.`);
    } catch (error) {
      console.error(`Error migrating ${type}:`, error);
      toast.error(`There was an error migrating ${type}.`);
    } finally {
      setMigrating(null);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Data Migration to Supabase</h1>
        <Button variant="outline" size="sm" onClick={checkDataStatus}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Use this utility to migrate mock data from the frontend to your Supabase database.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Migrate All Data</CardTitle>
            <CardDescription>
              Migrate all employees, assets, and asset history in one go
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4">
              <DatabaseIcon size={48} className="text-primary opacity-80" />
            </div>
            {completed.all && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded-md text-sm text-green-600 dark:text-green-400">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Migration completed successfully</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={() => handleMigrate('all')}
              disabled={migrating !== null}
            >
              {migrating === 'all' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : completed.all ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Migrate Again
                </>
              ) : (
                "Migrate All Data"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Migrate Employees</CardTitle>
            <CardDescription>
              Migrate all employee records to Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4">
              <DatabaseIcon size={48} className="text-blue-500 opacity-80" />
            </div>
            {completed.employees && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded-md text-sm text-green-600 dark:text-green-400">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>{dataStatus.employees} employees in database</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant={completed.employees ? "outline" : "default"}
              onClick={() => handleMigrate('employees')}
              disabled={migrating !== null}
            >
              {migrating === 'employees' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : completed.employees ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Migrate Again
                </>
              ) : (
                "Migrate Employees"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Migrate Assets</CardTitle>
            <CardDescription>
              Migrate all asset records to Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4">
              <DatabaseIcon size={48} className="text-green-500 opacity-80" />
            </div>
            {completed.assets && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded-md text-sm text-green-600 dark:text-green-400">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>{dataStatus.assets} assets in database</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant={completed.assets ? "outline" : "default"}
              onClick={() => handleMigrate('assets')}
              disabled={migrating !== null}
            >
              {migrating === 'assets' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : completed.assets ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Migrate Again
                </>
              ) : (
                "Migrate Assets"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Migrate Asset History</CardTitle>
            <CardDescription>
              Migrate all asset history records to Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4">
              <DatabaseIcon size={48} className="text-purple-500 opacity-80" />
            </div>
            {completed.assetHistory && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded-md text-sm text-green-600 dark:text-green-400">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>{dataStatus.assetHistory} history records in database</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant={completed.assetHistory ? "outline" : "default"}
              onClick={() => handleMigrate('assetHistory')}
              disabled={migrating !== null}
            >
              {migrating === 'assetHistory' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : completed.assetHistory ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Migrate Again
                </>
              ) : (
                "Migrate Asset History"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-900">
        <div className="flex items-start">
          <AlertCircle className="mr-2 h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Important Note</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              This is a one-time utility for migrating data. After successful migration, the application will automatically use Supabase for data storage instead of mock data files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

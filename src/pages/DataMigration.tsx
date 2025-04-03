
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, DatabaseIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { migrateAllData, migrateEmployees, migrateAssets, migrateAssetHistory } from "@/scripts/dataMigration";

export default function DataMigration() {
  const [migrating, setMigrating] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    employees: false,
    assets: false,
    assetHistory: false,
    all: false
  });

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
      
      toast({
        title: "Migration Successful",
        description: `${type === 'all' ? 'All data' : type} has been migrated to Supabase.`
      });
    } catch (error) {
      console.error(`Error migrating ${type}:`, error);
      toast({
        title: "Migration Failed",
        description: `There was an error migrating ${type}.`,
        variant: "destructive"
      });
    } finally {
      setMigrating(null);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Data Migration to Supabase</h1>
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
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={() => handleMigrate('all')}
              disabled={migrating !== null || completed.all}
            >
              {migrating === 'all' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : completed.all ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
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
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleMigrate('employees')}
              disabled={migrating !== null || completed.employees}
            >
              {migrating === 'employees' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : completed.employees ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
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
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleMigrate('assets')}
              disabled={migrating !== null || completed.assets}
            >
              {migrating === 'assets' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : completed.assets ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
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
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleMigrate('assetHistory')}
              disabled={migrating !== null || completed.assetHistory}
            >
              {migrating === 'assetHistory' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : completed.assetHistory ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
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
              This is a one-time utility for migrating data. After successful migration, you should update your application to use the Supabase services directly instead of mock data files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

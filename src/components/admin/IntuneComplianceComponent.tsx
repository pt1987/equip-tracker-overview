
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIntuneCompliancePolicies } from "@/hooks/use-intune";
import { Loader2, Shield, AlertTriangle, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function IntuneComplianceComponent() {
  const { policies, isLoading, error, refetch } = useIntuneCompliancePolicies();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield size={18} />
          <span>Intune Compliance-Richtlinien</span>
        </CardTitle>
        <CardDescription>
          Übersicht der konfigurierten Compliance-Richtlinien in Intune
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : policies.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Keine Richtlinien gefunden</AlertTitle>
            <AlertDescription>
              Es wurden keine Compliance-Richtlinien in Ihrem Intune-Tenant gefunden.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead className="w-24">Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{policy.displayName}</span>
                        <Badge variant="outline">ID: {policy.id.substring(0, 8)}...</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{policy.description || 'Keine Beschreibung'}</TableCell>
                    <TableCell>{policy.version}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={refetch}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Richtlinien aktualisieren
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

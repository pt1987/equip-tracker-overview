
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import SoftwareLicenseReport from '@/components/reports/SoftwareLicenseReport';
import PageTransition from '@/components/layout/PageTransition';

export default function SoftwareLicense() {
  return (
    <PageTransition>
      <div className="container px-4 py-6 lg:py-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Software-Lizenzen Report</h1>
            <p className="text-muted-foreground">
              Analyse und Übersicht der Software-Lizenzen und deren Nutzung
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/license-management">
              <Button className="flex items-center gap-2" size="lg">
                <KeyRound size={18} />
                Zum Lizenzmanagement
              </Button>
            </Link>
          </div>
        </div>

        <SoftwareLicenseReport />
      </div>
    </PageTransition>
  );
}

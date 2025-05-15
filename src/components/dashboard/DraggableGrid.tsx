
import { useState, useEffect, ReactNode } from "react";
import React from "react"; // Import für React.Children Methoden
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Move } from "lucide-react";
import { useDashboardLayout, DashboardLayoutItem } from "@/hooks/useDashboardLayout";
import "react-grid-layout/css/styles.css";
// Remove the problematic import: "react-resizable/css/styles.css"

// Wrappen von Responsive mit dem WidthProvider für automatische Breitenberechnung
const ResponsiveGridLayout = WidthProvider(Responsive);

interface DraggableGridProps {
  children: ReactNode;
  renderWidgetHeader: (id: string) => ReactNode;
}

export default function DraggableGrid({ children, renderWidgetHeader }: DraggableGridProps) {
  const { layouts: savedLayouts, saveLayouts, resetToDefaultLayout, isEditMode, toggleEditMode } = useDashboardLayout();
  const [currentLayouts, setCurrentLayouts] = useState<{[key: string]: Layout[]}>(
    { lg: savedLayouts } // "lg" ist der breakpoint name für große Displays
  );

  // Layout-Änderungen behandeln
  const handleLayoutChange = (_layout: Layout[], allLayouts: {[key: string]: Layout[]}) => {
    // Wir speichern hier nicht direkt, da das bei jedem kleinen Drag zu viel wäre
    setCurrentLayouts(allLayouts);
  };

  // Layout speichern
  const handleSaveLayout = () => {
    // Wir nehmen nur das "lg" Layout für die Einfachheit
    const layoutToSave = currentLayouts.lg as DashboardLayoutItem[];
    saveLayouts(layoutToSave);
  };

  // Child-Elemente mit Wrapper für Drag-Handles versehen
  const childrenWithWrappers = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    // Extrahiere die ID des Widgets aus dessen Props oder aus dem Layout
    const widgetId = savedLayouts[index]?.i;
    
    return (
      <div key={widgetId} className="widget-container h-full">
        <div className={`widget-header flex justify-between items-center p-2 ${isEditMode ? 'bg-primary/10 cursor-move' : ''}`}>
          {renderWidgetHeader(widgetId)}
          {isEditMode && (
            <div className="text-xs text-muted-foreground">
              <Move className="h-4 w-4 inline-block mr-1" /> Ziehen zum Verschieben
            </div>
          )}
        </div>
        <div className="widget-content h-[calc(100%-40px)] overflow-auto">
          {child}
        </div>
      </div>
    );
  });

  return (
    <div className="relative">
      {/* Layout-Steuerungselemente */}
      <div className="flex gap-2 mb-4 justify-end">
        <Button
          size="sm"
          variant={isEditMode ? "default" : "outline"}
          onClick={toggleEditMode}
        >
          {isEditMode ? "Bearbeitung beenden" : "Dashboard anpassen"}
        </Button>
        
        {isEditMode && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={resetToDefaultLayout}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Standard
            </Button>
            <Button
              size="sm"
              onClick={handleSaveLayout}
            >
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </>
        )}
      </div>
      
      {/* Draggable Grid */}
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={50}
        layouts={currentLayouts}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        margin={[16, 16]}
        containerPadding={[0, 0]}
      >
        {childrenWithWrappers}
      </ResponsiveGridLayout>
    </div>
  );
}

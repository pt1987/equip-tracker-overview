
import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { GripVertical } from 'lucide-react';
import MicaCard from './MicaCard';
import 'react-grid-layout/css/styles.css';
import '../dashboard-grid.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardItem {
  id: string;
  content: React.ReactNode;
  defaultSize: { w: number; h: number };
}

interface DraggableGridProps {
  items: DashboardItem[];
}

const DraggableGrid = ({ items }: DraggableGridProps) => {
  const [layout, setLayout] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);

  // Load saved layout from localStorage
  useEffect(() => {
    setMounted(true);
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      try {
        setLayout(JSON.parse(savedLayout));
      } catch (e) {
        console.error('Failed to parse saved layout', e);
      }
    }
  }, []);

  // Generate layout based on items with their default sizes
  const generateLayouts = () => {
    const layouts = {
      lg: [],
      md: [],
      sm: [],
      xs: []
    };

    // Use saved layout positions if available
    items.forEach((item, index) => {
      const savedItemLayout = layout?.lg?.find((l: any) => l.i === item.id);
      
      // Default position calculation if no saved layout
      let y = Math.floor(index / 2) * item.defaultSize.h;
      let x = (index % 2) * item.defaultSize.w;
      
      const baseLayout = {
        i: item.id,
        w: item.defaultSize.w,
        h: item.defaultSize.h,
        x: savedItemLayout?.x ?? x,
        y: savedItemLayout?.y ?? y,
      };

      layouts.lg.push(baseLayout);
      layouts.md.push({ ...baseLayout, w: Math.min(2, baseLayout.w) });
      layouts.sm.push({ ...baseLayout, w: 2, x: 0 });
      layouts.xs.push({ ...baseLayout, w: 1, x: 0 });
    });

    return layouts;
  };

  const handleLayoutChange = (currentLayout: any, allLayouts: any) => {
    // Save the layout to localStorage without showing any toast
    localStorage.setItem('dashboardLayout', JSON.stringify(allLayouts));
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-mica -z-10 rounded-2xl opacity-30" />
      <ResponsiveGridLayout
        className="layout relative z-10"
        layouts={layout.lg ? layout : generateLayouts()}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 2, md: 2, sm: 2, xs: 1 }}
        rowHeight={400}
        containerPadding={[12, 12]}
        margin={[20, 20]}
        onLayoutChange={(layout, allLayouts) => handleLayoutChange(layout, allLayouts)}
        draggableHandle=".dashboard-item-drag-handle"
        isDraggable={true}
        isResizable={false}
      >
        {items.map((item, index) => (
          <div key={item.id} className="dashboard-grid-item">
            <MicaCard 
              className="h-full" 
              variant={index % 3 === 0 ? 'elevated' : index % 5 === 0 ? 'accent' : 'default'}
            >
              <div className="dashboard-item-drag-handle mica-drag-handle" title="Drag to reorder">
                <GripVertical size={14} className="text-muted-foreground/60" />
              </div>
              <div className="relative z-10">
                {item.content}
              </div>
            </MicaCard>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DraggableGrid;

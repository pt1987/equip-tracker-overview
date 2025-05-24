
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

  const generateLayouts = () => {
    const layouts = {
      lg: [],
      md: [],
      sm: [],
      xs: []
    };

    items.forEach((item, index) => {
      const savedItemLayout = layout?.lg?.find((l: any) => l.i === item.id);
      
      // Responsive positioning
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
    localStorage.setItem('dashboardLayout', JSON.stringify(allLayouts));
  };

  return (
    <div className="relative">
      <ResponsiveGridLayout
        className="layout"
        layouts={layout.lg ? layout : generateLayouts()}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 2, md: 2, sm: 2, xs: 1 }}
        rowHeight={400}
        containerPadding={[0, 0]}
        margin={[20, 20]}
        onLayoutChange={(layout, allLayouts) => handleLayoutChange(layout, allLayouts)}
        draggableHandle=".dashboard-item-drag-handle"
        isDraggable={true}
        isResizable={false}
      >
        {items.map((item, index) => (
          <div key={item.id} className="dashboard-grid-item">
            <MicaCard 
              className="h-full relative" 
              variant={index % 3 === 0 ? 'elevated' : index % 5 === 0 ? 'accent' : 'default'}
            >
              <div className="dashboard-item-drag-handle mica-drag-handle" title="Drag to reorder">
                <GripVertical size={14} className="text-muted-foreground/60" />
              </div>
              <div className="h-full">
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

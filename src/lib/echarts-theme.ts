
// ECharts Theme-Konfiguration
import { EChartsOption } from 'echarts/types/dist/shared';

// Farbtöne, die auf Tailwind CSS-Farben basieren
export const colors = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  secondary: '#64748b',
  green: '#22c55e',
  red: '#ef4444',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  cyan: '#0891b2',
  pink: '#ec4899',
};

// Gradient-Definitionen
export const gradients = {
  blue: new Array(2).fill(0).map((_, i) => {
    return {
      offset: i,
      color: i === 0 ? colors.primary : colors.primaryLight,
    };
  }),
  green: new Array(2).fill(0).map((_, i) => {
    return {
      offset: i,
      color: i === 0 ? colors.green : '#4ade80',
    };
  }),
  purple: new Array(2).fill(0).map((_, i) => {
    return {
      offset: i,
      color: i === 0 ? colors.purple : '#a78bfa',
    };
  }),
  amber: new Array(2).fill(0).map((_, i) => {
    return {
      offset: i,
      color: i === 0 ? colors.amber : '#fbbf24',
    };
  }),
  red: new Array(2).fill(0).map((_, i) => {
    return {
      offset: i,
      color: i === 0 ? colors.red : '#f87171',
    };
  }),
};

// Gemeinsame Optionen für alle Charts
export const getCommonOptions = (): Partial<EChartsOption> => ({
  textStyle: {
    fontFamily: 'Inter, sans-serif',
    color: 'var(--foreground)',
  },
  legend: {
    textStyle: {
      color: 'var(--muted-foreground)',
      fontSize: 12,
    },
    icon: 'circle',
    itemHeight: 8,
    itemWidth: 8,
    itemGap: 12,
  },
  tooltip: {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    borderWidth: 1,
    textStyle: {
      color: 'var(--card-foreground)',
      fontSize: 12,
    },
    extraCssText: 'box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); border-radius: 0.5rem; padding: 0.75rem;',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '8%',
    containLabel: true,
  },
  animation: true,
  animationDuration: 800,
  animationEasing: 'cubicOut',
});

// Farboptionen für Charts
export const getColorOptions = (
  colorKeys: Array<keyof typeof colors> = ['primary', 'green', 'purple', 'amber', 'red', 'cyan', 'pink']
): Partial<EChartsOption> => ({
  color: colorKeys.map(key => colors[key]),
});

// Achsenoptionen für kartesische Charts
export const getAxisOptions = (): Partial<EChartsOption> => ({
  xAxis: {
    axisLine: {
      lineStyle: {
        color: 'var(--border)',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: 'var(--muted-foreground)',
      fontSize: 11,
    },
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: 'var(--muted-foreground)',
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: 'var(--border)',
        type: 'dashed',
      },
    },
  },
});

// Formatierungsfunktionen für die Anzeige von Werten
export const formatters = {
  currency: (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  },
  percent: (value: number) => {
    return `${value.toFixed(1)}%`;
  },
};

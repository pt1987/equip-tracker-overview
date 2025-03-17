
import { Asset, AssetHistoryEntry, AssetStatus, AssetType, AssetTypeDistribution, AssetStatusDistribution, DashboardStats, Employee } from "@/lib/types";

// Employee mock data
export const employees: Employee[] = [
  {
    id: "emp001",
    firstName: "Max",
    lastName: "Mustermann",
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    startDate: "2020-01-15",
    cluster: "Engineering",
    position: "Senior Developer",
    budget: 5000,
    usedBudget: 3200,
  },
  {
    id: "emp002",
    firstName: "Anna",
    lastName: "Schmidt",
    imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    startDate: "2021-03-21",
    cluster: "Design",
    position: "UX Designer",
    budget: 4500,
    usedBudget: 2800,
  },
  {
    id: "emp003",
    firstName: "Thomas",
    lastName: "Weber",
    imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    startDate: "2019-07-10",
    cluster: "Product",
    position: "Product Manager",
    budget: 5500,
    usedBudget: 4100,
  },
  {
    id: "emp004",
    firstName: "Laura",
    lastName: "Müller",
    imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    startDate: "2022-01-05",
    cluster: "Marketing",
    position: "Marketing Specialist",
    budget: 4000,
    usedBudget: 1900,
  },
  {
    id: "emp005",
    firstName: "Michael",
    lastName: "Fischer",
    imageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    startDate: "2020-11-18",
    cluster: "Engineering",
    position: "Frontend Developer",
    budget: 4800,
    usedBudget: 3600,
  }
];

// Asset mock data
export const assets: Asset[] = [
  {
    id: "ast001",
    name: "MacBook Pro 16",
    type: "laptop",
    manufacturer: "Apple",
    model: "MacBook Pro 16 M1 Pro",
    purchaseDate: "2022-03-15",
    vendor: "Apple Store",
    price: 2499,
    status: "in_use",
    employeeId: "emp001",
    serialNumber: "C02F134RXXXX",
    inventoryNumber: "PHAT-L-001",
    additionalWarranty: true,
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-select-202110?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1632788574000"
  },
  {
    id: "ast002",
    name: "iPhone 14 Pro",
    type: "smartphone",
    manufacturer: "Apple",
    model: "iPhone 14 Pro",
    purchaseDate: "2022-11-10",
    vendor: "Telekom",
    price: 1299,
    status: "in_use",
    employeeId: "emp001",
    serialNumber: "FVFXC1XXXXXX",
    inventoryNumber: "PHAT-S-001",
    imei: "35123456789012X",
    phoneNumber: "+4915123456789",
    provider: "Telekom",
    contractEndDate: "2024-11-09",
    contractName: "Business Mobile L",
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663703841896"
  },
  {
    id: "ast003",
    name: "Magic Mouse",
    type: "mouse",
    manufacturer: "Apple",
    model: "Magic Mouse 2",
    purchaseDate: "2022-03-15",
    vendor: "Apple Store",
    price: 79,
    status: "in_use",
    employeeId: "emp001",
    inventoryNumber: "PHAT-A-001",
    connectedAssetId: "ast001",
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MK2E3?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1626468075000"
  },
  {
    id: "ast004",
    name: "Dell XPS 15",
    type: "laptop",
    manufacturer: "Dell",
    model: "XPS 15 9510",
    purchaseDate: "2021-08-22",
    vendor: "Dell Online Store",
    price: 1899,
    status: "in_use",
    employeeId: "emp002",
    serialNumber: "JH2F5XX",
    inventoryNumber: "PHAT-L-002",
    additionalWarranty: true,
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9520/media-gallery/black/non-touch/notebook-xps-15-9520-nt-black-gallery-4.psd?fmt=png-alpha&pscan=auto&scl=1&wid=5000&hei=5000&qlt=100,0&resMode=sharp2&size=5000,5000"
  },
  {
    id: "ast005",
    name: "Samsung Galaxy S23",
    type: "smartphone",
    manufacturer: "Samsung",
    model: "Galaxy S23 Ultra",
    purchaseDate: "2023-02-28",
    vendor: "Vodafone",
    price: 1199,
    status: "in_use",
    employeeId: "emp002",
    serialNumber: "R58N70XXXXX",
    inventoryNumber: "PHAT-S-002",
    imei: "35298765432109X",
    phoneNumber: "+4917123456789",
    provider: "Vodafone",
    contractEndDate: "2025-02-27",
    contractName: "Red Business XL",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/de/2302/gallery/de-galaxy-s23-s918-sm-s918bzkcgxx-thumb-534863317"
  },
  {
    id: "ast006",
    name: "iPad Pro 11",
    type: "tablet",
    manufacturer: "Apple",
    model: "iPad Pro 11 M2",
    purchaseDate: "2023-04-15",
    vendor: "Apple Store",
    price: 899,
    status: "in_use",
    employeeId: "emp003",
    serialNumber: "DLXFP2XXXXXX",
    inventoryNumber: "PHAT-T-001",
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-11-select-wifi-spacegray-202210?wid=940&hei=1112&fmt=p-jpg&qlt=95&.v=1664412792014"
  },
  {
    id: "ast007",
    name: "Magic Keyboard",
    type: "keyboard",
    manufacturer: "Apple",
    model: "Magic Keyboard",
    purchaseDate: "2023-04-15",
    vendor: "Apple Store",
    price: 149,
    status: "in_use",
    employeeId: "emp003",
    inventoryNumber: "PHAT-A-002",
    connectedAssetId: "ast006",
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MMMR3?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1645719947833"
  },
  {
    id: "ast008",
    name: "ThinkPad X1 Carbon",
    type: "laptop",
    manufacturer: "Lenovo",
    model: "ThinkPad X1 Carbon Gen 10",
    purchaseDate: "2022-09-01",
    vendor: "Lenovo Online",
    price: 1799,
    status: "in_use",
    employeeId: "emp004",
    serialNumber: "PF3F5XXX",
    inventoryNumber: "PHAT-L-003",
    additionalWarranty: true,
    imageUrl: "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MjM4NTY0fGltYWdlL3BuZ3xoMjMvaGZkLzE0OTMxODkxOTQwMzgyLnBuZ3wxYjdlNjhiZTdjMmM5ZjcwOGEyNzY1ZjY5ZmQ3ZGQxYzhhZmVkOGZkODJiYzE1MjVkYjRjNTZjOTZhMjQ1NDNi/lenovo-laptops-thinkpad-x1-carbon-gen10-14-intel-hero.png"
  },
  {
    id: "ast009",
    name: "Magic Mouse",
    type: "mouse",
    manufacturer: "Apple",
    model: "Magic Mouse 2",
    purchaseDate: "2022-05-10",
    vendor: "Apple Store",
    price: 79,
    status: "pool",
    employeeId: null,
    inventoryNumber: "PHAT-A-003",
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MK2E3?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1626468075000"
  },
  {
    id: "ast010",
    name: "Logitech MX Master 3S",
    type: "mouse",
    manufacturer: "Logitech",
    model: "MX Master 3S",
    purchaseDate: "2023-01-20",
    vendor: "Amazon",
    price: 119,
    status: "in_use",
    employeeId: "emp005",
    inventoryNumber: "PHAT-A-004",
    connectedAssetId: "ast012",
    imageUrl: "https://resource.logitech.com/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png"
  },
  {
    id: "ast011",
    name: "iPad Air",
    type: "tablet",
    manufacturer: "Apple",
    model: "iPad Air 5",
    purchaseDate: "2022-08-10",
    vendor: "Apple Store",
    price: 699,
    status: "repair",
    employeeId: "emp005",
    serialNumber: "GHXCP2XXXXXX",
    inventoryNumber: "PHAT-T-002",
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=940&hei=1112&fmt=png-alpha&.v=1645065732688"
  },
  {
    id: "ast012",
    name: "MacBook Air M2",
    type: "laptop",
    manufacturer: "Apple",
    model: "MacBook Air M2",
    purchaseDate: "2022-07-15",
    vendor: "Apple Store",
    price: 1499,
    status: "in_use",
    employeeId: "emp005",
    serialNumber: "C02G134RXXXX",
    inventoryNumber: "PHAT-L-004",
    additionalWarranty: false,
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665"
  },
  {
    id: "ast013",
    name: "iPhone 13",
    type: "smartphone",
    manufacturer: "Apple",
    model: "iPhone 13",
    purchaseDate: "2021-12-10",
    vendor: "O2",
    price: 899,
    status: "defective",
    employeeId: null,
    serialNumber: "FVDXC1XXXXXX",
    inventoryNumber: "PHAT-S-003",
    imei: "35123456789013X",
    phoneNumber: "+4917923456789",
    provider: "O2",
    contractEndDate: "2023-12-09",
    contractName: "Free Business M",
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-blue-select-2021?wid=940&hei=1112&fmt=png-alpha&.v=1645572386470"
  },
  {
    id: "ast014",
    name: "Dell UltraSharp 27",
    type: "accessory",
    manufacturer: "Dell",
    model: "UltraSharp 27 U2720Q",
    purchaseDate: "2022-03-15",
    vendor: "Dell Online Store",
    price: 599,
    status: "pool",
    employeeId: null,
    inventoryNumber: "PHAT-A-005",
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u2720q/pdp/monitor-u2720q-pdp-5.jpg?fmt=png-alpha&wid=1000&hei=1000"
  },
  {
    id: "ast015",
    name: "Bose QuietComfort 45",
    type: "accessory",
    manufacturer: "Bose",
    model: "QuietComfort 45",
    purchaseDate: "2022-07-28",
    vendor: "Bose Online",
    price: 329,
    status: "ordered",
    employeeId: "emp001",
    inventoryNumber: "PHAT-A-006",
    imageUrl: "https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc45/product_silo_images/QC45_PDP_HERO_Midnight_Blue_1200x1022.png/jcr:content/renditions/cq5dam.web.1280.1280.png"
  }
];

// Asset history mock data
export const assetHistory: AssetHistoryEntry[] = [
  {
    id: "hist001",
    assetId: "ast001",
    date: "2022-03-15",
    action: "purchase",
    employeeId: null,
    notes: "Initial purchase"
  },
  {
    id: "hist002",
    assetId: "ast001",
    date: "2022-03-20",
    action: "assign",
    employeeId: "emp001",
    notes: "Assigned to Max Mustermann"
  },
  {
    id: "hist003",
    assetId: "ast002",
    date: "2022-11-10",
    action: "purchase",
    employeeId: null,
    notes: "Initial purchase"
  },
  {
    id: "hist004",
    assetId: "ast002",
    date: "2022-11-15",
    action: "assign",
    employeeId: "emp001",
    notes: "Assigned to Max Mustermann"
  },
  {
    id: "hist005",
    assetId: "ast013",
    date: "2021-12-10",
    action: "purchase",
    employeeId: null,
    notes: "Initial purchase"
  },
  {
    id: "hist006",
    assetId: "ast013",
    date: "2021-12-15",
    action: "assign",
    employeeId: "emp004",
    notes: "Assigned to Laura Müller"
  },
  {
    id: "hist007",
    assetId: "ast013",
    date: "2023-06-10",
    action: "status_change",
    employeeId: "emp004",
    notes: "Reported as defective - screen cracked"
  },
  {
    id: "hist008",
    assetId: "ast013",
    date: "2023-06-15",
    action: "return",
    employeeId: null,
    notes: "Returned to IT department"
  },
  {
    id: "hist009",
    assetId: "ast011",
    date: "2022-08-10",
    action: "purchase",
    employeeId: null,
    notes: "Initial purchase"
  },
  {
    id: "hist010",
    assetId: "ast011",
    date: "2022-08-15",
    action: "assign",
    employeeId: "emp005",
    notes: "Assigned to Michael Fischer"
  },
  {
    id: "hist011",
    assetId: "ast011",
    date: "2023-07-05",
    action: "status_change",
    employeeId: "emp005",
    notes: "Sent for repair - battery issues"
  }
];

// Dashboard statistics
export const getDashboardStats = (): DashboardStats => {
  const totalAssets = assets.length;
  const assignedAssets = assets.filter(asset => asset.employeeId !== null).length;
  const poolAssets = assets.filter(asset => asset.status === 'pool').length;
  const defectiveAssets = assets.filter(asset => asset.status === 'defective' || asset.status === 'repair').length;
  
  const totalBudget = employees.reduce((sum, emp) => sum + emp.budget, 0);
  const totalBudgetUsed = employees.reduce((sum, emp) => sum + emp.usedBudget, 0);
  
  return {
    totalAssets,
    assignedAssets,
    poolAssets,
    defectiveAssets,
    totalBudget,
    totalBudgetUsed
  };
};

// Asset type distribution
export const getAssetTypeDistribution = (): AssetTypeDistribution[] => {
  const types: AssetType[] = ['laptop', 'smartphone', 'tablet', 'mouse', 'keyboard', 'accessory'];
  return types.map(type => ({
    type,
    count: assets.filter(asset => asset.type === type).length
  }));
};

// Asset status distribution
export const getAssetStatusDistribution = (): AssetStatusDistribution[] => {
  const statuses: AssetStatus[] = ['ordered', 'delivered', 'in_use', 'defective', 'repair', 'pool'];
  return statuses.map(status => ({
    status,
    count: assets.filter(asset => asset.status === status).length
  }));
};

// Helper functions
export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find(employee => employee.id === id);
};

export const getAssetsByEmployeeId = (employeeId: string): Asset[] => {
  return assets.filter(asset => asset.employeeId === employeeId);
};

export const getAssetById = (id: string): Asset | undefined => {
  return assets.find(asset => asset.id === id);
};

export const getAssetHistoryByAssetId = (assetId: string): AssetHistoryEntry[] => {
  return assetHistory.filter(entry => entry.assetId === assetId).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const getEmployeeAssetsSummary = (employeeId: string) => {
  const employeeAssets = getAssetsByEmployeeId(employeeId);
  const totalValue = employeeAssets.reduce((sum, asset) => sum + asset.price, 0);
  const assetsByType: Record<AssetType, Asset[]> = {
    laptop: [],
    smartphone: [],
    tablet: [],
    mouse: [],
    keyboard: [],
    accessory: []
  };
  
  employeeAssets.forEach(asset => {
    assetsByType[asset.type].push(asset);
  });
  
  return {
    totalAssets: employeeAssets.length,
    totalValue,
    assetsByType
  };
};

export const getAssetsByStatus = (status: AssetStatus): Asset[] => {
  return assets.filter(asset => asset.status === status);
};

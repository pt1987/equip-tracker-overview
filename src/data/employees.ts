
import { Employee } from "@/lib/types";
import { getAssetsByEmployeeId } from "./assets";

// Employee mock data
export const employees: Employee[] = [
  {
    id: "emp001",
    firstName: "Max",
    lastName: "Mustermann",
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    startDate: "2020-01-15",
    entryDate: "2020-01-15",
    cluster: "Engineering",
    position: "Senior Developer",
    budget: 5000,
    usedBudget: 3200,
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: "emp002",
    firstName: "Anna",
    lastName: "Schmidt",
    imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    startDate: "2021-03-21",
    entryDate: "2021-03-21",
    cluster: "Design",
    position: "UX Designer",
    budget: 4500,
    usedBudget: 2800,
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: "emp003",
    firstName: "Thomas",
    lastName: "Weber",
    imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    startDate: "2019-07-10",
    entryDate: "2019-07-10",
    cluster: "Product",
    position: "Product Manager",
    budget: 5500,
    usedBudget: 4100,
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: "emp004",
    firstName: "Laura",
    lastName: "Müller",
    imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    startDate: "2022-01-05",
    entryDate: "2022-01-05",
    cluster: "Marketing",
    position: "Marketing Specialist",
    budget: 4000,
    usedBudget: 1900,
    profileImage: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    id: "emp005",
    firstName: "Michael",
    lastName: "Fischer",
    imageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    startDate: "2020-11-18",
    entryDate: "2020-11-18",
    cluster: "Engineering",
    position: "Frontend Developer",
    budget: 4800,
    usedBudget: 3600,
    profileImage: "https://randomuser.me/api/portraits/men/5.jpg"
  }
];

// Employee-related helper functions
export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find(employee => employee.id === id);
};

export const getEmployeeAssetsSummary = (employeeId: string) => {
  const employeeAssets = getAssetsByEmployeeId(employeeId);
  const totalValue = employeeAssets.reduce((sum, asset) => sum + asset.price, 0);
  const assetsByType = {
    laptop: employeeAssets.filter(asset => asset.type === 'laptop'),
    smartphone: employeeAssets.filter(asset => asset.type === 'smartphone'),
    tablet: employeeAssets.filter(asset => asset.type === 'tablet'),
    mouse: employeeAssets.filter(asset => asset.type === 'mouse'),
    keyboard: employeeAssets.filter(asset => asset.type === 'keyboard'),
    accessory: employeeAssets.filter(asset => asset.type === 'accessory')
  };
  
  return {
    totalAssets: employeeAssets.length,
    totalValue,
    assetsByType
  };
};

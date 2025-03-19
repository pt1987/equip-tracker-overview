
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
  },
  // New employees
  {
    id: "emp006",
    firstName: "Julia",
    lastName: "Becker",
    imageUrl: "https://randomuser.me/api/portraits/women/6.jpg",
    startDate: "2021-05-12",
    entryDate: "2021-05-12",
    cluster: "Engineering",
    position: "Backend Developer",
    budget: 5200,
    usedBudget: 3700,
    profileImage: "https://randomuser.me/api/portraits/women/6.jpg"
  },
  {
    id: "emp007",
    firstName: "Markus",
    lastName: "Klein",
    imageUrl: "https://randomuser.me/api/portraits/men/7.jpg",
    startDate: "2022-03-01",
    entryDate: "2022-03-01",
    cluster: "Finance",
    position: "Financial Analyst",
    budget: 4800,
    usedBudget: 2100,
    profileImage: "https://randomuser.me/api/portraits/men/7.jpg"
  },
  {
    id: "emp008",
    firstName: "Sophia",
    lastName: "Wagner",
    imageUrl: "https://randomuser.me/api/portraits/women/8.jpg",
    startDate: "2020-08-15",
    entryDate: "2020-08-15",
    cluster: "Design",
    position: "UI Designer",
    budget: 4600,
    usedBudget: 3200,
    profileImage: "https://randomuser.me/api/portraits/women/8.jpg"
  },
  {
    id: "emp009",
    firstName: "David",
    lastName: "Schulz",
    imageUrl: "https://randomuser.me/api/portraits/men/9.jpg",
    startDate: "2021-09-20",
    entryDate: "2021-09-20",
    cluster: "Engineering",
    position: "DevOps Engineer",
    budget: 5300,
    usedBudget: 4100,
    profileImage: "https://randomuser.me/api/portraits/men/9.jpg"
  },
  {
    id: "emp010",
    firstName: "Elena",
    lastName: "Hoffmann",
    imageUrl: "https://randomuser.me/api/portraits/women/10.jpg",
    startDate: "2022-02-10",
    entryDate: "2022-02-10",
    cluster: "Marketing",
    position: "Content Strategist",
    budget: 4400,
    usedBudget: 2800,
    profileImage: "https://randomuser.me/api/portraits/women/10.jpg"
  },
  {
    id: "emp011",
    firstName: "Felix",
    lastName: "Meyer",
    imageUrl: "https://randomuser.me/api/portraits/men/11.jpg",
    startDate: "2021-11-05",
    entryDate: "2021-11-05",
    cluster: "Product",
    position: "Product Owner",
    budget: 5100,
    usedBudget: 3500,
    profileImage: "https://randomuser.me/api/portraits/men/11.jpg"
  },
  {
    id: "emp012",
    firstName: "Lena",
    lastName: "Schneider",
    imageUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    startDate: "2020-06-15",
    entryDate: "2020-06-15",
    cluster: "HR",
    position: "HR Manager",
    budget: 4700,
    usedBudget: 3100,
    profileImage: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    id: "emp013",
    firstName: "Tim",
    lastName: "Neumann",
    imageUrl: "https://randomuser.me/api/portraits/men/13.jpg",
    startDate: "2022-04-01",
    entryDate: "2022-04-01",
    cluster: "Engineering",
    position: "Mobile Developer",
    budget: 5000,
    usedBudget: 2900,
    profileImage: "https://randomuser.me/api/portraits/men/13.jpg"
  },
  {
    id: "emp014",
    firstName: "Sarah",
    lastName: "Wolf",
    imageUrl: "https://randomuser.me/api/portraits/women/14.jpg",
    startDate: "2021-07-20",
    entryDate: "2021-07-20",
    cluster: "Sales",
    position: "Account Manager",
    budget: 4900,
    usedBudget: 3800,
    profileImage: "https://randomuser.me/api/portraits/women/14.jpg"
  },
  {
    id: "emp015",
    firstName: "Lukas",
    lastName: "Braun",
    imageUrl: "https://randomuser.me/api/portraits/men/15.jpg",
    startDate: "2020-10-10",
    entryDate: "2020-10-10",
    cluster: "Engineering",
    position: "QA Engineer",
    budget: 4800,
    usedBudget: 3400,
    profileImage: "https://randomuser.me/api/portraits/men/15.jpg"
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

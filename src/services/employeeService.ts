
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/lib/types";
import { formatDateString } from "@/lib/utils";
import { getAssetsByEmployeeId } from "./assetService";

// Function to get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('last_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
  
  return transformEmployees(data || []);
};

// Function to get a single employee by ID
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Employee not found
      return null;
    }
    console.error('Error fetching employee:', error);
    throw error;
  }
  
  return transformEmployee(data);
};

// Function to create a new employee
export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const dbEmployee = transformEmployeeForDb(employee);
  
  const { data, error } = await supabase
    .from('employees')
    .insert(dbEmployee)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
  
  return transformEmployee(data);
};

// Function to update an employee
export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee> => {
  const dbEmployee = transformEmployeeForDb(employee);
  
  const { data, error } = await supabase
    .from('employees')
    .update(dbEmployee)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
  
  return transformEmployee(data);
};

// Function to delete an employee
export const deleteEmployee = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

// Function to get employee assets summary
export const getEmployeeAssetsSummary = async (employeeId: string) => {
  const employeeAssets = await getAssetsByEmployeeId(employeeId);
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

// Helper function to transform database employees to the application Employee type
function transformEmployees(dbEmployees: any[]): Employee[] {
  return dbEmployees.map(transformEmployee);
}

// Helper function to transform a single database employee to the application Employee type
function transformEmployee(dbEmployee: any): Employee {
  return {
    id: dbEmployee.id,
    firstName: dbEmployee.first_name,
    lastName: dbEmployee.last_name,
    imageUrl: dbEmployee.image_url || dbEmployee.profile_image || '',
    startDate: formatDateString(dbEmployee.start_date),
    entryDate: dbEmployee.entry_date ? formatDateString(dbEmployee.entry_date) : undefined,
    cluster: dbEmployee.cluster,
    position: dbEmployee.position,
    budget: Number(dbEmployee.budget),
    usedBudget: Number(dbEmployee.used_budget),
    profileImage: dbEmployee.profile_image || dbEmployee.image_url || ''
  };
}

// Helper function to transform an application Employee to the database format
function transformEmployeeForDb(employee: Partial<Employee>): any {
  const dbEmployee: any = {};
  
  if (employee.firstName !== undefined) dbEmployee.first_name = employee.firstName;
  if (employee.lastName !== undefined) dbEmployee.last_name = employee.lastName;
  if (employee.imageUrl !== undefined) dbEmployee.image_url = employee.imageUrl;
  if (employee.startDate !== undefined) dbEmployee.start_date = employee.startDate;
  if (employee.entryDate !== undefined) dbEmployee.entry_date = employee.entryDate;
  if (employee.cluster !== undefined) dbEmployee.cluster = employee.cluster;
  if (employee.position !== undefined) dbEmployee.position = employee.position;
  if (employee.budget !== undefined) dbEmployee.budget = employee.budget;
  if (employee.usedBudget !== undefined) dbEmployee.used_budget = employee.usedBudget;
  if (employee.profileImage !== undefined) dbEmployee.profile_image = employee.profileImage;
  
  return dbEmployee;
}

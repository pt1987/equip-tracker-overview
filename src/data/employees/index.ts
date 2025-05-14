
// Export all employee-related functions
export * from './fetch';
export * from './create';
export * from './update';
export * from './exists';
export * from './storage';
export * from './assets';

// Make sure getEmployeeById is exported
export const getEmployeeById = async (id: string) => {
  // Import dynamically to avoid circular dependencies
  const { getEmployees } = await import('./fetch');
  const employees = await getEmployees();
  return employees.find(employee => employee.id === id) || null;
};

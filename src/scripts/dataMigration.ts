
// Function to check if data already exists in the database
export const checkDataExists = async (tableName: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error(`Error checking if ${tableName} data exists:`, error);
    return false;
  }
  
  return count !== null && count > 0;
};

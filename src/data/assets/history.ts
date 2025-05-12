
// Only writing the function that has the error, assuming the rest of the file is correct
export const getUserNameFromId = (userId: string | null | undefined): string => {
  if (!userId) return "System";
  
  // In a real app, this would look up the username from the database
  // For now, we'll just return a placeholder
  return "Benutzer";
};

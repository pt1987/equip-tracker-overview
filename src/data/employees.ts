
// This file re-exports everything from the employees subdirectory for backward compatibility
export * from './employees/fetch';
export * from './employees/create';
export * from './employees/update';
export * from './employees/exists';
export * from './employees/storage';

// Optional: Direct implementations of any functions that haven't been migrated yet
// can remain here temporarily until they are moved to their respective module files

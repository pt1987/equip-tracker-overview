import { v4 as uuidv4 } from 'uuid';
import { EmployeeForm, FormType, FormStatus, AssetFormEntry, Asset, Employee } from '@/lib/types';
import { employees, getEmployeeById } from './employees';
import { getAssetsByEmployeeId, assets } from './assets';

// Mock data for employee forms
let employeeForms: EmployeeForm[] = [
  {
    id: 'form001',
    formType: 'onboarding',
    employeeId: 'emp001',
    employeeName: 'Max Mustermann',
    createdDate: '2023-01-15T10:30:00Z',
    completedDate: '2023-01-15T11:15:00Z',
    status: 'completed',
    assets: [
      {
        assetId: 'asset001',
        assetName: 'MacBook Pro 16"',
        serialNumber: 'SN123456789',
        condition: 'Neu',
        accessories: ['Ladekabel', 'Adapter USB-C'],
        checklistItems: [
          { id: 'check1', label: 'Gerät vollständig', checked: true },
          { id: 'check2', label: 'Zubehör enthalten', checked: true },
          { id: 'check3', label: 'Keine Schäden', checked: true }
        ]
      }
    ],
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwA...',
    notes: 'Gerät wurde in einwandfreiem Zustand übergeben.',
    documentUrl: '/documents/onboarding_emp001_2023-01-15.pdf',
    emailSent: true
  },
  {
    id: 'form002',
    formType: 'offboarding',
    employeeId: 'emp004',
    employeeName: 'Laura Müller',
    createdDate: '2023-08-20T14:20:00Z',
    completedDate: '2023-08-20T15:45:00Z',
    status: 'completed',
    assets: [
      {
        assetId: 'asset012',
        assetName: 'iPhone 13',
        serialNumber: 'IMEI98765432101',
        condition: 'Leichte Gebrauchsspuren',
        accessories: ['Ladekabel', 'Originalverpackung'],
        checklistItems: [
          { id: 'check1', label: 'Gerät vollständig', checked: true },
          { id: 'check2', label: 'Zubehör enthalten', checked: true },
          { id: 'check3', label: 'Keine schweren Schäden', checked: true },
          { id: 'check4', label: 'Gerät zurückgesetzt', checked: true }
        ]
      }
    ],
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwA...',
    notes: 'Gerät hat leichte Gebrauchsspuren, sonst in gutem Zustand.',
    documentUrl: '/documents/offboarding_emp004_2023-08-20.pdf',
    emailSent: true
  }
];

// Create a new employee form
export const createEmployeeForm = (
  employeeId: string, 
  formType: FormType,
  assetIds?: string[]
): EmployeeForm | null => {
  const employee = getEmployeeById(employeeId);
  if (!employee) return null;

  // Get assets to include in the form
  let formAssets: AssetFormEntry[] = [];
  if (assetIds && assetIds.length > 0) {
    // If specific assets are provided
    formAssets = assetIds
      .map(id => assets.find(asset => asset.id === id))
      .filter(asset => asset !== undefined)
      .map(asset => createAssetFormEntry(asset as Asset));
  } else {
    // Otherwise, get all assets assigned to the employee
    const employeeAssets = getAssetsByEmployeeId(employeeId);
    formAssets = employeeAssets.map(asset => createAssetFormEntry(asset));
  }

  if (formAssets.length === 0) return null;

  const employeeFullName = `${employee.firstName} ${employee.lastName}`;
  
  const newForm: EmployeeForm = {
    id: uuidv4(),
    formType,
    employeeId,
    employeeName: employeeFullName,
    createdDate: new Date().toISOString(),
    status: 'draft',
    assets: formAssets,
    emailSent: false
  };

  employeeForms.push(newForm);
  return newForm;
};

// Helper to create asset form entries
const createAssetFormEntry = (asset: Asset): AssetFormEntry => {
  return {
    assetId: asset.id,
    assetName: asset.name,
    serialNumber: asset.serialNumber || 'Keine Seriennummer',
    condition: 'Gut',
    accessories: [],
    checklistItems: [
      { id: uuidv4(), label: 'Gerät vollständig', checked: false },
      { id: uuidv4(), label: 'Zubehör enthalten', checked: false },
      { id: uuidv4(), label: 'Keine Schäden', checked: false },
      { id: uuidv4(), label: 'Gerät funktionsfähig', checked: false }
    ]
  };
};

// Update an existing form
export const updateEmployeeForm = (form: EmployeeForm): EmployeeForm => {
  const index = employeeForms.findIndex(f => f.id === form.id);
  if (index !== -1) {
    employeeForms[index] = {
      ...form,
      // If status is being set to completed, add completion date
      ...(form.status === 'completed' && !form.completedDate 
        ? { completedDate: new Date().toISOString() } 
        : {})
    };
    return employeeForms[index];
  }
  return form;
};

// Complete a form and generate PDF + send email
export const completeForm = (
  formId: string,
  signature: string,
  notes?: string
): EmployeeForm | null => {
  const form = getFormById(formId);
  if (!form) return null;

  // Generate document URL (in a real app, this would create an actual PDF)
  const formType = form.formType === 'onboarding' ? 'onboarding' : 'offboarding';
  const dateStr = new Date().toISOString().split('T')[0];
  const documentUrl = `/documents/${formType}_${form.employeeId}_${dateStr}.pdf`;

  const updatedForm: EmployeeForm = {
    ...form,
    status: 'completed',
    completedDate: new Date().toISOString(),
    signature,
    notes: notes || form.notes,
    documentUrl,
    emailSent: true
  };

  return updateEmployeeForm(updatedForm);
};

// Get a form by ID
export const getFormById = (id: string): EmployeeForm | undefined => {
  return employeeForms.find(form => form.id === id);
};

// Get all forms
export const getAllForms = (): EmployeeForm[] => {
  return [...employeeForms];
};

// Get forms for a specific employee
export const getFormsByEmployeeId = (employeeId: string): EmployeeForm[] => {
  return employeeForms.filter(form => form.employeeId === employeeId);
};

// Get forms by type (onboarding/offboarding)
export const getFormsByType = (formType: FormType): EmployeeForm[] => {
  return employeeForms.filter(form => form.formType === formType);
};

// Search and filter forms
export const searchForms = (
  searchTerm: string = '', 
  formType?: FormType,
  status?: FormStatus,
  startDate?: string,
  endDate?: string
): EmployeeForm[] => {
  let filtered = [...employeeForms];
  
  // Apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(form => 
      form.employeeName.toLowerCase().includes(term) ||
      form.assets.some(asset => 
        asset.assetName.toLowerCase().includes(term) ||
        (asset.serialNumber && asset.serialNumber.toLowerCase().includes(term))
      )
    );
  }
  
  // Apply type filter
  if (formType) {
    filtered = filtered.filter(form => form.formType === formType);
  }
  
  // Apply status filter
  if (status) {
    filtered = filtered.filter(form => form.status === status);
  }
  
  // Apply date range filters
  if (startDate) {
    filtered = filtered.filter(form => form.createdDate >= startDate);
  }
  
  if (endDate) {
    filtered = filtered.filter(form => form.createdDate <= endDate);
  }
  
  return filtered;
};

// Delete a form
export const deleteForm = (id: string): boolean => {
  const initialLength = employeeForms.length;
  employeeForms = employeeForms.filter(form => form.id !== id);
  return employeeForms.length < initialLength;
};

// Cancel a form
export const cancelForm = (id: string): EmployeeForm | null => {
  const form = getFormById(id);
  if (!form) return null;
  
  const updatedForm: EmployeeForm = {
    ...form,
    status: 'cancelled'
  };
  
  return updateEmployeeForm(updatedForm);
};

// Helper to generate a PDF (mock function)
export const generatePdf = (formId: string): string => {
  const form = getFormById(formId);
  if (!form) return '';
  
  // In a real app, this would generate a PDF document
  // For now, we just return a placeholder URL
  const formType = form.formType === 'onboarding' ? 'onboarding' : 'offboarding';
  const dateStr = new Date().toISOString().split('T')[0];
  return `/documents/${formType}_${form.employeeId}_${dateStr}.pdf`;
};

// Helper to send email (mock function)
export const sendEmail = (formId: string): boolean => {
  const form = getFormById(formId);
  if (!form) return false;
  
  // In a real app, this would send an actual email
  // For now, we just update the emailSent flag
  const updatedForm: EmployeeForm = {
    ...form,
    emailSent: true
  };
  
  updateEmployeeForm(updatedForm);
  return true;
};

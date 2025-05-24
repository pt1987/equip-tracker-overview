
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

/**
 * Creates a Microsoft Graph client using the provided credentials
 */
export function createIntuneClient(tenantId: string, clientId: string, clientSecret: string) {
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const client = Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        try {
          const token = await credential.getToken('https://graph.microsoft.com/.default');
          return token?.token || '';
        } catch (error) {
          console.error("Error getting access token:", error);
          throw error;
        }
      },
    },
  });

  return client;
}

/**
 * Get device information from Intune by name
 */
export async function getDeviceByName(
  tenantId: string, 
  clientId: string, 
  clientSecret: string, 
  deviceName: string
) {
  try {
    const client = createIntuneClient(tenantId, clientId, clientSecret);

    const response = await client
      .api(`/deviceManagement/managedDevices`)
      .filter(`deviceName eq '${deviceName}'`)
      .select('deviceName,complianceState,lastLoggedOnDateTime,userPrincipalName,operatingSystem,osVersion')
      .get();

    if (response.value.length === 0) {
      return { error: 'Kein Gerät mit diesem Namen gefunden' };
    }

    return { device: response.value[0] };
  } catch (error: any) {
    console.error("Error in getDeviceByName:", error);
    return { error: 'Fehler bei Verbindung zur Microsoft Graph API', details: error.message };
  }
}

/**
 * Get all devices from Intune
 */
export async function getAllDevices(
  tenantId: string,
  clientId: string,
  clientSecret: string,
  limit: number = 50
) {
  try {
    const client = createIntuneClient(tenantId, clientId, clientSecret);
    
    const response = await client
      .api(`/deviceManagement/managedDevices`)
      .top(limit)
      .select('deviceName,complianceState,lastLoggedOnDateTime,userPrincipalName,operatingSystem,osVersion,serialNumber,model,manufacturer')
      .get();

    return { devices: response.value };
  } catch (error: any) {
    console.error("Error in getAllDevices:", error);
    return { error: 'Fehler bei Verbindung zur Microsoft Graph API', details: error.message };
  }
}

/**
 * Get device compliance policies
 */
export async function getCompliancePolicies(
  tenantId: string,
  clientId: string,
  clientSecret: string
) {
  try {
    const client = createIntuneClient(tenantId, clientId, clientSecret);
    
    const response = await client
      .api(`/deviceManagement/deviceCompliancePolicies`)
      .select('id,displayName,description,version')
      .get();

    return { policies: response.value };
  } catch (error: any) {
    console.error("Error in getCompliancePolicies:", error);
    return { error: 'Fehler bei Verbindung zur Microsoft Graph API', details: error.message };
  }
}

/**
 * Get a user by UPN (User Principal Name)
 */
export async function getUserByUPN(
  tenantId: string,
  clientId: string,
  clientSecret: string,
  userPrincipalName: string
) {
  try {
    const client = createIntuneClient(tenantId, clientId, clientSecret);
    
    const response = await client
      .api(`/users/${userPrincipalName}`)
      .select('id,displayName,mail,userPrincipalName,jobTitle,department')
      .get();

    return { user: response };
  } catch (error: any) {
    console.error("Error in getUserByUPN:", error);
    return { error: 'Fehler beim Abrufen des Benutzers', details: error.message };
  }
}

/**
 * Get installed apps for a specific device
 */
export async function getDeviceInstalledApps(
  tenantId: string,
  clientId: string,
  clientSecret: string,
  deviceId: string
) {
  try {
    const client = createIntuneClient(tenantId, clientId, clientSecret);
    
    const response = await client
      .api(`/deviceManagement/managedDevices/${deviceId}/detectedApps`)
      .select('id,displayName,version,sizeInByte')
      .get();

    return { apps: response.value };
  } catch (error: any) {
    console.error("Error in getDeviceInstalledApps:", error);
    return { error: 'Fehler beim Abrufen der installierten Apps', details: error.message };
  }
}

/**
 * Get device by serial number
 */
export async function getDeviceBySerial(
  tenantId: string,
  clientId: string,
  clientSecret: string,
  serialNumber: string
) {
  try {
    const client = createIntuneClient(tenantId, clientId, clientSecret);
    
    const response = await client
      .api(`/deviceManagement/managedDevices`)
      .filter(`serialNumber eq '${serialNumber}'`)
      .select('deviceName,complianceState,lastLoggedOnDateTime,userPrincipalName,operatingSystem,osVersion,serialNumber,model,manufacturer')
      .get();

    if (response.value.length === 0) {
      return { error: 'Kein Gerät mit dieser Seriennummer gefunden' };
    }

    return { device: response.value[0] };
  } catch (error: any) {
    console.error("Error in getDeviceBySerial:", error);
    return { error: 'Fehler bei Verbindung zur Microsoft Graph API', details: error.message };
  }
}

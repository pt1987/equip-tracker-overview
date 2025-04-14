
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

/**
 * Creates a Microsoft Graph client using the provided credentials
 * NOTE: This should only be used in a secure environment, not directly in the browser
 */
export function createIntuneClient(tenantId: string, clientId: string, clientSecret: string) {
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const client = Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const token = await credential.getToken('https://graph.microsoft.com/.default');
        return token?.token || '';
      },
    },
  });

  return client;
}

/**
 * Get device information from Intune by name
 * This is a mock function that returns a simulated response for demo purposes
 * In production, this would be implemented as a backend API endpoint
 */
export async function getDeviceByName(
  tenantId: string, 
  clientId: string, 
  clientSecret: string, 
  deviceName: string
) {
  try {
    console.log(`Attempting to search for device: ${deviceName}`);
    
    // For demo purposes, simulate a successful response without actually calling the Microsoft Graph API
    // In production, this would call an API endpoint on your server that uses the Microsoft Graph SDK
    
    if (deviceName && tenantId && clientId && clientSecret) {
      // Simulate an API response
      return { 
        device: {
          deviceName: deviceName,
          complianceState: "compliant",
          lastLoggedOnDateTime: new Date().toISOString(),
          userPrincipalName: "demo.user@example.com"
        }
      };
    } else {
      return { error: 'Kein Gerät mit diesem Namen gefunden' };
    }
  } catch (error: any) {
    console.error("Error in getDeviceByName:", error);
    return { error: 'Fehler bei Verbindung zur Microsoft Graph API', details: error.message };
  }
}

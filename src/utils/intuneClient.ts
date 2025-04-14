
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

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
      .select('deviceName,complianceState,lastLoggedOnDateTime,userPrincipalName')
      .get();

    if (response.value.length === 0) {
      return { error: 'Kein Gerät mit diesem Namen gefunden' };
    }

    return { device: response.value[0] };
  } catch (error: any) {
    console.error(error);
    return { error: 'Fehler bei Verbindung zur Microsoft Graph API', details: error.message };
  }
}

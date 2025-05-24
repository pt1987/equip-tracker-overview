
import { useState, useEffect } from 'react';
import { 
  getDeviceByName, 
  getAllDevices, 
  getCompliancePolicies 
} from '@/utils/intuneClient';

export interface IntuneConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
}

export interface IntuneDeviceDetails {
  deviceName: string;
  complianceState: string;
  lastLoggedOnDateTime?: string;
  userPrincipalName?: string;
  operatingSystem?: string;
  osVersion?: string;
}

export interface IntuneCompliancePolicy {
  id: string;
  displayName: string;
  description?: string;
  version: number;
}

export function useIntuneConfig() {
  const [config, setConfig] = useState<IntuneConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load configuration from localStorage on component mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('intuneConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig) as IntuneConfig;
        setConfig(parsedConfig);
        setIsConfigured(!!parsedConfig.tenantId && !!parsedConfig.clientId && !!parsedConfig.clientSecret);
      }
    } catch (error) {
      console.error('Error loading Intune configuration:', error);
    }
  }, []);

  const updateConfig = (newConfig: IntuneConfig) => {
    try {
      setConfig(newConfig);
      setIsConfigured(!!newConfig.tenantId && !!newConfig.clientId && !!newConfig.clientSecret);
      localStorage.setItem('intuneConfig', JSON.stringify(newConfig));
    } catch (error) {
      console.error('Error saving Intune configuration:', error);
    }
  };

  const clearConfig = () => {
    setConfig(null);
    setIsConfigured(false);
    localStorage.removeItem('intuneConfig');
  };

  return {
    config,
    isConfigured,
    isLoading,
    updateConfig,
    clearConfig
  };
}

export function useIntuneDevice(deviceName: string) {
  const { config, isConfigured } = useIntuneConfig();
  const [device, setDevice] = useState<IntuneDeviceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevice = async () => {
    if (!isConfigured || !config || !deviceName) {
      setError('Intune ist nicht konfiguriert oder Gerätename fehlt');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getDeviceByName(
        config.tenantId, 
        config.clientId, 
        config.clientSecret, 
        deviceName
      );

      if (result.error) {
        setError(result.error);
        setDevice(null);
      } else {
        setDevice(result.device);
      }
    } catch (err: any) {
      setError(err.message || 'Fehler beim Abrufen des Geräts');
      setDevice(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (deviceName && isConfigured) {
      fetchDevice();
    }
  }, [deviceName, isConfigured]);

  return {
    device,
    isLoading,
    error,
    refetch: fetchDevice
  };
}

export function useIntuneDevices(limit: number = 50) {
  const { config, isConfigured } = useIntuneConfig();
  const [devices, setDevices] = useState<IntuneDeviceDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async () => {
    if (!isConfigured || !config) {
      setError('Intune ist nicht konfiguriert');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getAllDevices(
        config.tenantId, 
        config.clientId, 
        config.clientSecret, 
        limit
      );

      if (result.error) {
        setError(result.error);
        setDevices([]);
      } else {
        setDevices(result.devices || []);
      }
    } catch (err: any) {
      setError(err.message || 'Fehler beim Abrufen der Geräte');
      setDevices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConfigured) {
      fetchDevices();
    }
  }, [isConfigured, limit]);

  return {
    devices,
    isLoading,
    error,
    refetch: fetchDevices
  };
}

export function useIntuneCompliancePolicies() {
  const { config, isConfigured } = useIntuneConfig();
  const [policies, setPolicies] = useState<IntuneCompliancePolicy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = async () => {
    if (!isConfigured || !config) {
      setError('Intune ist nicht konfiguriert');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getCompliancePolicies(
        config.tenantId, 
        config.clientId, 
        config.clientSecret
      );

      if (result.error) {
        setError(result.error);
        setPolicies([]);
      } else {
        setPolicies(result.policies || []);
      }
    } catch (err: any) {
      setError(err.message || 'Fehler beim Abrufen der Compliance-Richtlinien');
      setPolicies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConfigured) {
      fetchPolicies();
    }
  }, [isConfigured]);

  return {
    policies,
    isLoading,
    error,
    refetch: fetchPolicies
  };
}

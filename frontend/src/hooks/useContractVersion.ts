import { useState, useEffect } from 'react';
import { contractVersionService, type ContractVersionInfo } from '../services/contract-version';

export function useContractVersion() {
  const [info, setInfo] = useState<ContractVersionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkVersion() {
      try {
        const versionInfo = await contractVersionService.getVersionInfo();
        if (isMounted) {
          setInfo(versionInfo);
        }
      } catch (error) {
        if (isMounted) {
          setInfo({
            version: 0,
            isSupported: false,
            isValidated: false,
            error: 'Failed to initialize version check',
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkVersion();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...info,
    loading,
    isSupported: info?.isSupported ?? false,
    isValidated: info?.isValidated ?? false,
  };
}

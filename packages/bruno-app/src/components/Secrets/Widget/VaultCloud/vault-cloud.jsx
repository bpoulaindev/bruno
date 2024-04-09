import { SecretField } from 'components/Secrets/Editor/field';
import { useMemo, useState } from 'react';
import { sendSimpleHttpRequest } from 'utils/network';
import Spinner from 'components/Spinner';
import { IconLoader, IconLoader2 } from '@tabler/icons';

export const VaultCloudWidget = ({ className, config, setConfig }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const getTokenFn = ({ clientID, clientSecret }) => {
    const url = 'https://auth.idp.hashicorp.com/oauth2/token';
    const body = {
      client_id: clientID,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      audience: 'https://api.hashicorp.cloud'
    };
    return sendSimpleHttpRequest({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })
      .then((data) => data)
      .catch((error) => console.error('Failed to fetch data', error));
  };
  const [vaultConfig, setVaultConfig] = useState({
    ...config,
    platformConfig: {
      getToken: ({ clientID, clientSecret }) => getTokenFn({ clientID, clientSecret }),
      getSecret: () => {}
    }
  });
  const updateConfig = (newField) => {
    setVaultConfig((prevConfig) => {
      return { ...prevConfig, ...newField };
    });
  };
  const testTokenRequest = () => {
    setTestResult(null);
    setIsLoading(true);
    try {
      vaultConfig.platformConfig
        .getToken({
          clientID: vaultConfig.secretConfig?.clientID,
          clientSecret: vaultConfig.secretConfig?.clientSecret
        })
        .then((response) => {
          setIsLoading(false);
          setTestResult(response?.access_token ? 'success' : 'error');
        });
    } catch (error) {
      setIsLoading(false);
      setTestResult('error');
    }
  };
  console.log({ vaultConfig });
  const sectionClasses =
    'flex flex-col w-full shadow-[inset_0rem_0.2rem_0.4rem_0_rgb(0,0,0,0.1)] rounded-lg bg-zinc-50 dark:bg-transparent/10 p-4';
  const buttonDisabled = useMemo(() => {
    return isLoading || !vaultConfig.secretConfig?.clientID || !vaultConfig.secretConfig?.clientSecret;
  }, [isLoading, vaultConfig.secretConfig?.clientID, vaultConfig.secretConfig?.clientSecret]);
  return (
    <div className={`${className}`}>
      <div className={sectionClasses}>
        <h2 className="text-base font-semibold leading-7">Secret Configuration</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-400 dark:text-zinc-500">
          Configure the secrets module to connect to your Vault Cloud instance
        </p>
        <div className="flex items-center mt-4">
          <SecretField
            hide
            className="grow"
            name="Client ID"
            value={vaultConfig.secretConfig?.clientID ?? ''}
            onChange={(value) =>
              updateConfig({
                secretConfig: {
                  ...vaultConfig.secretConfig,
                  clientID: value
                }
              })
            }
          />
          <SecretField
            hide
            className="grow ml-2"
            name="Client Secret"
            value={vaultConfig.secretConfig?.clientSecret ?? ''}
            onChange={(value) =>
              updateConfig({
                secretConfig: {
                  ...vaultConfig.secretConfig,
                  clientSecret: value
                }
              })
            }
          />
        </div>
        <div className="flex items-center w-full justify-end mt-2">
          {testResult && (
            <div
              className={`flex items-center rounded px-2.5 py-2 text-xs font-semibold mr-2 ring-1 ring-inset ${
                testResult === 'success'
                  ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-500 ring-green-600/20 dark:ring-green-500/20'
                  : 'bg-red-50 dark:bg-red-400/10 text-red-700 dark:text-red-400 ring-red-600/10 dark:ring-red-400/20'
              }`}
            >
              {testResult === 'success' ? 'Token retrieval successful' : 'Failed to retrieve token'}
            </div>
          )}
          <button
            type="button"
            disabled={buttonDisabled}
            className={`${
              buttonDisabled
                ? 'cursor-not-allowed text-zinc-300 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900/70'
                : 'cursor-pointer text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-700'
            }
            flex items-center transition-all rounded bg-transparent px-2.5 py-2 text-xs font-semibold shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-500`}
            onClick={() => testTokenRequest()}
          >
            Test token retrieval
            {isLoading && <IconLoader2 size={16} className="animate-spin ml-2" />}
          </button>
        </div>
      </div>
      <div className={`mt-4 ${sectionClasses}`}>
        <h2 className="text-base font-semibold leading-7">Shared Configuration</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-400 dark:text-zinc-500">
          This configuration can be shared in a repository
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <SecretField
            className="grow"
            name="Node name"
            tooltip="The name of the configuration"
            value={vaultConfig.sharedConfig?.name ?? ''}
            onChange={(value) =>
              updateConfig({
                sharedConfig: {
                  ...vaultConfig.sharedConfig,
                  name: value
                }
              })
            }
          />
          <SecretField
            className="grow"
            name="Organization ID"
            value={vaultConfig.sharedConfig?.orgID ?? ''}
            onChange={(value) =>
              updateConfig({
                sharedConfig: {
                  ...vaultConfig.sharedConfig,
                  orgID: value
                }
              })
            }
          />
          <SecretField
            name="Project ID"
            className="grow"
            value={vaultConfig.sharedConfig?.projectID ?? ''}
            onChange={(value) =>
              updateConfig({
                sharedConfig: {
                  ...vaultConfig.sharedConfig,
                  projectID: value
                }
              })
            }
          />
          <SecretField
            tooltip={'The path where the secrets are stored in Vault Cloud'}
            className="grow"
            name="Path"
            value={vaultConfig.sharedConfig?.path ?? ''}
            onChange={(value) =>
              updateConfig({
                sharedConfig: {
                  ...vaultConfig.sharedConfig,
                  path: value
                }
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

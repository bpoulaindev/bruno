import { SecretField } from 'components/Secrets/Editor/field';
import { useCallback, useMemo, useState } from 'react';
import { sendSimpleHttpRequest } from 'utils/network';
import Spinner from 'components/Spinner';
import { IconCaretDown, IconCaretRight, IconLoader, IconLoader2 } from '@tabler/icons';
import { saveSecretsInstance, getInstance } from 'providers/ReduxStore/slices/collections/actions';
import cloneDeep from 'lodash/cloneDeep';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const TokenTestResult = ({ testResult, showError, setShowError }) => {
  return testResult === 'success' ? (
    <div className="flex items-center rounded px-2.5 py-2 text-xs font-semibold ml-2 ring-1 ring-inset bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-500 ring-green-600/20 dark:ring-green-500/20">
      Token retrieval successful
    </div>
  ) : (
    <button
      onClick={() => setShowError(!showError)}
      className="flex items-center rounded px-2.5 py-2 text-xs font-semibold ml-2 ring-1 ring-inset bg-red-50 dark:bg-red-400/10 text-red-700 dark:text-red-400 ring-red-600/10 dark:ring-red-400/20"
    >
      Failed to retrieve token
      {showError ? <IconCaretDown size={16} className="ml-1" /> : <IconCaretRight size={16} className="ml-1" />}
    </button>
  );
};

export const VaultCloudWidget = ({ className, config, setConfig, collection, saveSecretsRef }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showError, setShowError] = useState(false);
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
      .catch((error) => {
        console.log('Failed to fetch data', { error });
        console.error('Failed to fetch data', { error });
        return Promise.reject(error);
      });
  };
  const [vaultConfig, setVaultConfig] = useState({
    ...config,
    sharedConfig: {
      ...config.sharedConfig,
      provider: 'vault-cloud'
    },
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
    vaultConfig.platformConfig
      .getToken({
        clientID: vaultConfig.secretConfig?.clientID,
        clientSecret: vaultConfig.secretConfig?.clientSecret
      })
      .then((response) => {
        setIsLoading(false);
        setTestResult(response?.access_token ? 'success' : response);
      })
      .catch((error) => {
        setIsLoading(false);
        setTestResult(error);
      });
  };
  console.log({ vaultConfig });
  const sectionClasses =
    'flex flex-col w-full shadow-[inset_0rem_0.2rem_0.4rem_0_rgb(0,0,0,0.1)] rounded-lg bg-zinc-50 dark:bg-transparent/10 p-4';
  const buttonDisabled = useMemo(() => {
    return isLoading || !vaultConfig.secretConfig?.clientID || !vaultConfig.secretConfig?.clientSecret;
  }, [isLoading, vaultConfig.secretConfig?.clientID, vaultConfig.secretConfig?.clientSecret]);

  const saveSecrets = useCallback(() => {
    console.log('triggering save function');
    // name has changed
    if (vaultConfig.sharedConfig.name !== config.sharedConfig.name) {
      di;
    }
    dispatch(
      saveSecretsInstance(
        {
          provider: 'vault-cloud',
          name: vaultConfig.sharedConfig.name,
          orgID: vaultConfig.sharedConfig.orgID,
          projectID: vaultConfig.sharedConfig.projectID,
          path: vaultConfig.sharedConfig.path,
          secretConfig: {
            clientID: vaultConfig.secretConfig?.clientID,
            clientSecret: vaultConfig.secretConfig?.clientSecret
          }
        },
        collection.uid
      )
    )
      .then(() => {
        toast.success('Changes saved successfully');
      })
      .catch(() => toast.error('An error occurred while saving the changes'));
    console.log('save secrets', collection);
  }, [vaultConfig.secretConfig, vaultConfig.sharedConfig]);
  saveSecretsRef.current = saveSecrets;

  const getStoredSecrets = () => {
    dispatch(getCredentials(collection.uid, vaultConfig.sharedConfig.name))
      .then((data) => {
        console.log('getStoredSecrets', data);
        setVaultConfig({
          ...vaultConfig,
          secretConfig: {
            clientID: data.clientID,
            clientSecret: data.clientSecret
          }
        });
      })
      .catch((error) => {
        console.log('getStoredSecrets', error);
      });
  };

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
        <div className="flex items-center w-full justify-start mt-2">
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
          {testResult && <TokenTestResult testResult={testResult} showError={showError} setShowError={setShowError} />}
          <button
            type="button"
            className="cursor-pointer ml-2 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center transition-all rounded bg-transparent px-2.5 py-2 text-xs font-semibold shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-500"
            onClick={() => saveSecrets()}
          >
            Save secrets
          </button>
          <button
            type="button"
            className="cursor-pointer ml-2 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center transition-all rounded bg-transparent px-2.5 py-2 text-xs font-semibold shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-500"
            onClick={() => getStoredSecrets()}
          >
            Get secrets
          </button>
        </div>
        {showError && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-400/10 rounded-lg text-red-700 dark:text-red-400 ring-red-600/20 dark:ring-red-400/20">
            <pre className="text-xs">{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}
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

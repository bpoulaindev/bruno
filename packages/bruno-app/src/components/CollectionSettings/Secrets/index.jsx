import { useEffect, useState } from 'react';
import { IconCopy, IconEdit, IconEye, IconEyeOff, IconPlus, IconTrash } from '@tabler/icons';
import { SecretsEditor } from 'components/Secrets/Editor/editor';
import toast from 'react-hot-toast';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const Button = ({ className, onClick, children }) => {
  return (
    <button
      type="button"
      className={`rounded bg-transparent px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function Secrets({ collection }) {
  const [vaultData, setVaultData] = useState();
  const [instances, setInstances] = useState([
    {
      name: {
        key: 'name',
        name: 'Name',
        value: 'VaultExample'
      },
      orgID: {
        key: 'orgID',
        name: 'Organization ID',
        value: 'd7a4b4ba-db1c-43a8-ae26-31cfca663574'
      },
      projectID: {
        key: 'projectID',
        name: 'Project ID',
        value: '095e8714-9c53-45d4-ae06-48abef86adeb'
      },
      path: {
        key: 'path',
        name: 'Path',
        value: 'bruno-secrets'
      }
    }
  ]);
  const fetchData = async () => {
    try {
      const url = 'https://auth.idp.hashicorp.com/oauth2/token';
      /* const encodedBody = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        audience: 'https://api.hashicorp.cloud'
      }); */
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        // body: encodedBody
      })
        .then((response) => {
          console.log('this is the response', response);
          return response.json();
        })
        .then((data) => console.log(data.access_token))
        .catch((error) => console.error('Error:', error));
      /* const response = await fetch(
        `https://api.cloud.hashicorp.com/secrets/2023-06-13/organizations/${orgId}/projects/${projectId}/apps/${path}/open`,
        {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            Authorization: `Bearer ${apiToken}`
          }
        }
      ); */

      /* if (!response.ok) {
        throw new Error('Failed to fetch data');
      } */

      /* const data = await response.json();
      console.log(data); // Log the response data to the console
      setVaultData(data?.data); */
    } catch (error) {
      console.error(error);
    }
  };

  // factor all of the elements into a single component
  const vaultElements = [{}];
  const [isOpen, setIsOpen] = useState(false);
  const [editInstance, setEditInstance] = useState();
  console.log('pitié pitié pitié', collection);
  const clearAndOpen = () => {
    setEditInstance(undefined);
    setIsOpen(true);
  };
  const copyClipboard = (value) => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  };
  // TODO : add the provider type to the collection and config file
  const InstanceItem = ({ instance }) => {
    const { secretConfig, ...rest } = instance;
    const editInstance = () => {
      setEditInstance(instance);
      setIsOpen(true);
    };
    return (
      <div className="flex items-center">
        <div className="flex flex-wrap items-center ring-1 ring-zinc-200 dark:ring-zinc-700 w-full rounded bg-zinc-50 dark:bg-transparent/10 py-1 px-3 my-1">
          {Object.entries(rest).map(([key, value], index) => (
            <div key={`configField_${index}`} className="flex flex-col py-1 mr-4 shrink min-w-28">
              <div className="flex items-center w-full">
                <span className="text-xs font-bold capitalize">{key}</span>
                <span className="w-full ml-1 h-1 border-t border-dashed" />
              </div>
              <button
                className="text-xs flex justify-start !p-0 mt-1 max-w-28 truncate cursor-pointer"
                onClick={() => copyClipboard(value)}
              >
                <span
                  className="truncate max-w-28"
                  data-tooltip-id={`tooltip_${key}_${index}`}
                  data-tooltip-content={value}
                >
                  {value}
                </span>
                <ReactTooltip id={`tooltip_${key}_${index}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col ml-1.5 !min-w-[52px] grow">
          <Button className="w-full flex justify-center !p-1" onClick={() => editInstance()}>
            <IconEdit size={16} />
          </Button>
          <div className="flex mt-1">
            <Button className="w-fit !p-1">
              <IconCopy size={16} />
            </Button>
            <Button className="w-fit ml-1 !p-1">
              <IconTrash size={16} className="text-red-600" />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="mt-1 flex flex-col w-full">
      {isOpen && (
        <SecretsEditor
          onClose={() => setIsOpen(false)}
          onConfirm={(data) => console.log(data)}
          collection={collection}
          instance={editInstance}
        />
      )}
      <div className="flex items-center w-full justify-between">
        <span className="font-semibold text-lg">Secrets Instances</span>
        <Button className="w-fit flex items-center ring-0" onClick={() => clearAndOpen()}>
          <IconPlus size={16} className="mr-1" />
          New Instance
        </Button>
      </div>
      {!collection.brunoConfig.secrets || collection.brunoConfig.secrets?.length === 0 ? (
        <div className="text-center mt-4 text-sm">No instance found</div>
      ) : (
        <div className="flex flex-col mt-4 min-w-[350px] my-1">
          {collection.brunoConfig.secrets?.map((instance, index) => (
            <InstanceItem
              key={`instance_${index}`}
              instance={instance}
              setInstance={(newValue) =>
                setInstances(instances.map((instance, i) => (i === index ? newValue : instance)))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

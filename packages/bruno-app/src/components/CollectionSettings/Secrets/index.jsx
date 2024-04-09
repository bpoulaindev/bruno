import { useEffect, useState } from 'react';
import { IconEye, IconEyeOff, IconPlus } from '@tabler/icons';
import { SecretsEditor } from 'components/Secrets/Editor/editor';

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

const VaultField = ({ fieldKey, name, value, onChange }) => {
  return (
    <div className="flex flex-col items-start mt-1 ml-1">
      <label
        htmlFor={fieldKey}
        className="flex items-center min-w-28 whitespace-nowrap text-xs font-medium leading-6 text-zinc-900 dark:text-zinc-50"
      >
        {name}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={fieldKey}
        id={fieldKey}
        className="block w-full rounded border-0 py-1 px-3 text-zinc-900 bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs sm:leading-6"
        placeholder={`Your ${name}`}
      />
    </div>
  );
};
// node contains name, orgId, projectId, path
// each category contains key, name and value
const VaultNode = ({ key, node, setNode }) => {
  return (
    <div className="flex items-center mt-1">
      {Object.entries(node).map(([nodeKey, field]) => (
        <VaultField
          key={nodeKey}
          fieldKey={field.key}
          name={field.name}
          value={field.value}
          onChange={(value) =>
            setNode((prevNode) => {
              const newNode = { ...prevNode };
              newNode[key] = { ...field, value };
              return newNode;
            })
          }
        />
      ))}
    </div>
  );
};

export default function Secrets() {
  const [apiToken, setApiToken] = useState(
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VRTNPRFE0UkVGRU1ESXhRemczT0VFNU5UazROalJHT0RnME5qSTRNRGc1TjBNeVJqVXlSUSJ9.eyJpc3MiOiJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS8iLCJzdWIiOiJWc3lxMGRPcDlOa2k4UUNvaERqN3lLdjVRNlBMVTBlREBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuaGFzaGljb3JwLmNsb3VkIiwiaWF0IjoxNzExMzcwMjk1LCJleHAiOjE3MTEzNzM4OTUsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IlZzeXEwZE9wOU5raThRQ29oRGo3eUt2NVE2UExVMGVEIn0.liZnZ4cZs7d0C9hMHR_Ig9bp5NAFQCO8MlOPlO1VpW3bBRCbvu_vEHqupxtP6dyeZfAsn9Jhz6utEuCEVeNYzuiiCTAsjJY9Xx2WtcM25bJ5UaFW-5ynXEy2L2Yi1BB3k71HWp8jjNQyvwSpA45LRbrbKqfXEuXq50_8YLKvxXGGGHgDQ-0FbjrsAoalPpwOE68QpmSypzCpVmpvN9cijHQegcqiTLhzzPi6HeG1AshnN5W1A2LH8vR4s-sZeY04OsxzzS0-7aL36xqji-mNpNcz9WTyKYpegaOH9bOGMceg9yHW21nbANJxk4hCqOmyU2NsY1VW0GfffjDuQ3iuYA'
  );
  const [hideToken, setHideToken] = useState(true);
  const [vaultData, setVaultData] = useState();
  const [nodes, setNodes] = useState([
    {
      name: {
        key: 'name',
        name: 'Name',
        value: 'VaultExample'
      },
      orgId: {
        key: 'orgId',
        name: 'Organization ID',
        value: 'd7a4b4ba-db1c-43a8-ae26-31cfca663574'
      },
      projectId: {
        key: 'projectId',
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
  return (
    <div className="mt-1 flex flex-col w-full">
      <div className="flex items-center w-full justify-between">
        <span className="font-semibold text-lg">Secrets Modules</span>
        <Button className="w-fit flex items-center ring-0" onClick={() => setIsOpen(true)}>
          <IconPlus size={16} className="mr-1" />
          New Node
        </Button>
      </div>
      {isOpen && <SecretsEditor onClose={() => setIsOpen(false)} onConfirm={(data) => console.log(data)} />}
      <div className="flex flex-col justify-end grow min-w-[300px] my-1">
        <div className="flex items-center">
          <label htmlFor="apiToken" className=" block text-xs font-medium leading-6 text-zinc-900 dark:text-zinc-50">
            API Token
          </label>
          <Button
            className="ml-2 py-1 border-0 ring-0 hover:ring-1"
            onClick={(e) => {
              setHideToken(!hideToken);
            }}
          >
            {hideToken ? <IconEye size={16} /> : <IconEyeOff size={16} />}
          </Button>
        </div>
        <textarea
          rows={hideToken ? 1 : 4}
          name="apiToken input"
          id="apiToken"
          itemType="password"
          disabled={hideToken}
          className={`block w-full mt-4 ${
            hideToken && 'blur-sm overflow-hidden'
          } max-w-96 rounded-md border-0 py-2 px-3 bg-white dark:bg-zinc-900 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs`}
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
          placeholder="Your API Token here"
        />
      </div>
      <div className="flex items-center w-full flex-wrap">
        <div className="flex flex-col mt-4 min-w-[350px] my-1">
          {nodes.map((node, index) => (
            <VaultNode
              key={index}
              node={node}
              setNode={(newValue) => setNodes(nodes.map((node, i) => (i === index ? newValue : node)))}
            />
          ))}
          <Button className="mt-2 w-fit" onClick={() => setIsOpen(true)}>
            New Node
          </Button>
        </div>
        <span className="m-4">or</span>
      </div>
    </div>
  );
}

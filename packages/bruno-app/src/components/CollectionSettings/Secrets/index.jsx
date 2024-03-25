import { useEffect, useState } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons';

export default function Secrets() {
  const [clientId, setClientId] = useState('a7Lv9EWpNYx4Eh9CFcCQ6uDUZ4mXCAVa');
  const [clientSecret, setClientSecret] = useState('gSQbYptQb810FZajLJ3VMVZH4sB9ta6MS_ht_Y8aHbBebmBO98AYXrAXpVW2Qs0D');
  const [apiToken, setApiToken] = useState(
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VRTNPRFE0UkVGRU1ESXhRemczT0VFNU5UazROalJHT0RnME5qSTRNRGc1TjBNeVJqVXlSUSJ9.eyJpc3MiOiJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS8iLCJzdWIiOiJWc3lxMGRPcDlOa2k4UUNvaERqN3lLdjVRNlBMVTBlREBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuaGFzaGljb3JwLmNsb3VkIiwiaWF0IjoxNzExMzcwMjk1LCJleHAiOjE3MTEzNzM4OTUsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IlZzeXEwZE9wOU5raThRQ29oRGo3eUt2NVE2UExVMGVEIn0.liZnZ4cZs7d0C9hMHR_Ig9bp5NAFQCO8MlOPlO1VpW3bBRCbvu_vEHqupxtP6dyeZfAsn9Jhz6utEuCEVeNYzuiiCTAsjJY9Xx2WtcM25bJ5UaFW-5ynXEy2L2Yi1BB3k71HWp8jjNQyvwSpA45LRbrbKqfXEuXq50_8YLKvxXGGGHgDQ-0FbjrsAoalPpwOE68QpmSypzCpVmpvN9cijHQegcqiTLhzzPi6HeG1AshnN5W1A2LH8vR4s-sZeY04OsxzzS0-7aL36xqji-mNpNcz9WTyKYpegaOH9bOGMceg9yHW21nbANJxk4hCqOmyU2NsY1VW0GfffjDuQ3iuYA'
  );
  const [inputIDType, setInputIDType] = useState('password');
  const [inputSecretType, setInputSecretType] = useState('password');
  const [vaultData, setVaultData] = useState();
  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://api.cloud.hashicorp.com/secrets/2023-06-13/organizations/d7a4b4ba-db1c-43a8-ae26-31cfca663574/projects/095e8714-9c53-45d4-ae06-48abef86adeb/apps/bruno-secrets/open',
        {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            Authorization:
              'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VRTNPRFE0UkVGRU1ESXhRemczT0VFNU5UazROalJHT0RnME5qSTRNRGc1TjBNeVJqVXlSUSJ9.eyJpc3MiOiJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS8iLCJzdWIiOiIxTld6cVBicXo5M2pUVlhOV2x0MzFLNFlWMkc3Vm1JZEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuaGFzaGljb3JwLmNsb3VkIiwiaWF0IjoxNzExMzc5MDQwLCJleHAiOjE3MTEzODI2NDAsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IjFOV3pxUGJxejkzalRWWE5XbHQzMUs0WVYyRzdWbUlkIn0.nHGx8Zgnd43PmDrLsPkFtP58uj9biFvHdKeCsfW1cZlKxlZbhFmhfNmcJZnTWSHOSAvvk0EZxNcy_ozU9k_r1WtAwIgviCy6iDs_FBqc59W4Dm9qZma8MAmJlqiVMVhWg1VDKY2tUJXBDChVJjkWOrpvRDbP66OrTHSN4Bx2ORGeneCxK4MGYSHgSlKf4e2q4-2RnmStHJgSaI4sGkyUHanAhGVZpJgBTMYi-4UngQfddKWEYQZlg6t2plh6leLuos27RrEalxnoIZEDvwUs0o4CsmM76hsbl6fLxjBXk_CpbxoJo4CUV2Y1zt_FDIpwQ6u99hVoyQav5k9NzSYBuQ'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log(data); // Log the response data to the console
      setVaultData(data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Call the fetchData function when the component mounts or whenever needed
  useEffect(() => {
    fetchData();
  }, [apiToken]);
  const Button = ({ className, onClick, children }) => {
    return (
      <button
        type="button"
        className={`rounded bg-transparent px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-700 ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
  return (
    <div className="mt-1 flex flex-col w-full">
      <span className="font-semibold text-lg">Vault connexion</span>
      <div className="flex items-center w-full flex-wrap">
        <div className="flex flex-col mt-4 min-w-[300px] my-1">
          <div className="flex items-center">
            <label htmlFor="clientID" className="w-40 block text-xs font-medium leading-6 text-gray-900">
              Client ID
            </label>
            <input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              type={inputIDType}
              name="clientID"
              id="clientID"
              className="block w-full rounded border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs sm:leading-6"
              placeholder="Your client ID"
            />
            <Button
              className="ml-1 py-1"
              onClick={(e) => {
                setInputIDType(inputIDType === 'password' ? 'text' : 'password');
              }}
            >
              {inputIDType === 'password' ? <IconEye size={16} /> : <IconEyeOff size={16} />}
            </Button>
          </div>
          <div className="flex items-center mt-1">
            <label htmlFor="clientSecret" className="w-40 block text-xs font-medium leading-6 text-gray-900">
              Client Secret
            </label>
            <input
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              type={inputSecretType}
              name="clientSecret"
              id="clientSecret"
              className="block w-full rounded border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs sm:leading-6"
              placeholder="Your client secret"
            />
            <Button
              className="ml-1 py-1"
              onClick={(e) => {
                setInputSecretType(inputSecretType === 'password' ? 'text' : 'password');
              }}
            >
              {inputSecretType === 'password' ? <IconEye size={16} /> : <IconEyeOff size={16} />}
            </Button>
          </div>
          <Button className="mt-2">Retrieve token</Button>
        </div>
        <span className="m-4">or</span>
        <div className="flex flex-col justify-end grow min-w-[300px] my-1">
          <label htmlFor="apiToken" className=" block text-xs font-medium leading-6 text-gray-900">
            API Token
          </label>
          <textarea
            rows={4}
            name="apiToken input"
            id="apiToken"
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs"
            defaultValue={''}
            placeholder="Your API Token here"
          />
        </div>
      </div>
    </div>
  );
}

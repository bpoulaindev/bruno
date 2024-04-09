import { useState } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons';
import Tooltip from 'components/Tooltip';

const keyBuilder = (name) => {
  return name.toLowerCase().replace(/ /g, '-');
};

export const SecretField = ({ className = '', name, value, onChange, tooltip, hide = false }) => {
  const [inputType, setInputType] = useState(hide ? 'password' : 'text');
  const fieldKey = keyBuilder(name);
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <label
        htmlFor={fieldKey}
        className="flex items-center min-w-28 whitespace-nowrap text-xs font-medium leading-6 text-zinc-900 dark:text-zinc-50"
      >
        {name}
        {tooltip && <Tooltip text={tooltip} className="ml-1" tooltipId={`secret-field-${fieldKey}`} />}
      </label>
      <div className="flex items-center w-full relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          name={fieldKey}
          id={fieldKey}
          className={`block rounded-md w-full ${
            hide ? 'pr-14' : 'pr-4'
          } border-0 py-1 px-3 text-zinc-900 bg-zinc-100 dark:bg-zinc-900/70 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs sm:leading-6`}
          placeholder={`Your ${name}`}
        />
        {hide && (
          <button
            type="button"
            onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}
            className="absolute inset-y-0 right-0 rounded bg-zinc-100 dark:bg-zinc-900 px-2 py-1 mt-1 mr-1 h-fit text-xs font-semibold text-slate-900 dark:text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
          >
            {inputType === 'password' ? <IconEye size={16} /> : <IconEyeOff size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

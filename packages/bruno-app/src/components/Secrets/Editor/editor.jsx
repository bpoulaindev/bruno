import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import { useRef, useState } from 'react';
import { IconArrowDown, IconCaretDown } from '@tabler/icons';
import { SecretsWidget } from 'components/Secrets/Widget/widget';

const keyBuilder = (name) => {
  return name.toLowerCase().replace(/ /g, '-');
};

const Options = ({ options, setSelectedPlatform, dropdownRef }) => {
  return (
    <ul className={`px-1`}>
      {options.map((option) => (
        <li key={keyBuilder(option)}>
          <button
            className="grow w-full justify-start flex items-center py-1 px-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
            onClick={() => {
              dropdownRef.current.hide();
              setSelectedPlatform(option);
            }}
          >
            {option}
          </button>
        </li>
      ))}
    </ul>
  );
};

export const SecretsEditor = ({ onConfirm, onClose, collection }) => {
  const dropdownTippyRef = useRef();
  const onDropdownCreate = (ref) => (dropdownTippyRef.current = ref);
  const platforms = ['Vault Cloud', 'Vault Server'];
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  return (
    <Modal
      size="lg"
      title="Add a new secret platform"
      confirmText="Save"
      handleConfirm={onConfirm}
      handleCancel={onClose}
    >
      <div className="flex items-center">
        <h1>Start by selecting your platform</h1>
        <Dropdown
          onCreate={onDropdownCreate}
          icon={
            <button className="rounded flex items-center px-2.5 py-2 text-xs font-semibold text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700">
              {selectedPlatform || 'Select a platform'}
              <IconCaretDown size={16} className="ml-1" />
            </button>
          }
          className="ml-4"
        >
          <Options options={platforms} setSelectedPlatform={setSelectedPlatform} dropdownRef={dropdownTippyRef} />
        </Dropdown>
      </div>
      {selectedPlatform && <SecretsWidget type={selectedPlatform} collection={collection} className="mt-2" />}
    </Modal>
  );
};

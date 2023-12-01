import toast from 'react-hot-toast';
import Bruno from '@components/Bruno';
import Dropdown from '@components/Dropdown';
import CreateCollection from '../CreateCollection';
import ImportCollection from '@components/Sidebar/ImportCollection';
import ImportCollectionLocation from '@components/Sidebar/ImportCollectionLocation';

import { IconDots } from '@tabler/icons';
import { useState, forwardRef, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showHomePage } from '@providers/ReduxStore/slices/app';
import { openCollection, importCollection } from '@providers/ReduxStore/slices/collections/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../../@/components/ui/dropdown-menu';
import { FileUp, FolderPlus, Import, MoreHorizontal, Wrench } from 'lucide-react';

export const TitleBar = () => {
  // TODO: create collection type
  const [importedCollection, setImportedCollection] = useState<null | any>(null);
  const [createCollectionModalOpen, setCreateCollectionModalOpen] = useState<boolean>(false);
  const [importCollectionModalOpen, setImportCollectionModalOpen] = useState<boolean>(false);
  const [importCollectionLocationModalOpen, setImportCollectionLocationModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { ipcRenderer } = window;

  const handleImportCollection = (collection) => {
    setImportedCollection(collection);
    setImportCollectionModalOpen(false);
    setImportCollectionLocationModalOpen(true);
  };

  const handleImportCollectionLocation = (collectionLocation) => {
    dispatch(importCollection(importedCollection, collectionLocation));
    setImportCollectionLocationModalOpen(false);
    setImportedCollection(null);
    toast.success('Collection imported successfully');
  };
  const handleTitleClick = () => dispatch(showHomePage());

  const handleOpenCollection = () => {
    // @ts-ignore
    dispatch(openCollection()).catch((err) => {
      console.log(err);
      toast.error('An error occurred while opening the collection');
    });
  };

  const openDevTools = () => {
    ipcRenderer.invoke('renderer:open-devtools');
  };

  return (
    <div className="px-2 py-2">
      {createCollectionModalOpen ? <CreateCollection onClose={() => setCreateCollectionModalOpen(false)} /> : null}
      {importCollectionModalOpen ? (
        <ImportCollection onClose={() => setImportCollectionModalOpen(false)} handleSubmit={handleImportCollection} />
      ) : null}
      {importCollectionLocationModalOpen ? (
        <ImportCollectionLocation
          collectionName={importedCollection.name}
          onClose={() => setImportCollectionLocationModalOpen(false)}
          handleSubmit={handleImportCollectionLocation}
        />
      ) : null}

      <div className="flex items-center">
        <div className="flex items-center cursor-pointer" onClick={handleTitleClick}>
          <Bruno width={30} />
        </div>
        <div
          onClick={handleTitleClick}
          className="flex items-center font-medium select-none cursor-pointer"
          style={{ fontSize: 14, paddingLeft: 6, position: 'relative', top: -1 }}
        >
          Bruno
        </div>
        <div className="collection-dropdown flex flex-grow items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Collection commands</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => setCreateCollectionModalOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Collection
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenCollection()}>
                <FileUp className="mr-2 h-4 w-4" />
                Open Collection
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setImportCollectionModalOpen(true)}>
                <Import className="mr-2 h-4 w-4" />
                Import Collection
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => openDevTools()}>
                <Wrench className="mr-2 h-4 w-4" />
                Open Devtools
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

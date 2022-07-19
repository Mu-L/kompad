import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { HiOutlinePlus } from "react-icons/hi";

import { useAuth } from "../../hooks/useAuth";
import { watchTags } from "../../services/tags";
import { useTagStore } from "../../store/tags";
import { classNames } from "../../libs/utils";
import { useFolderStore } from "../../store/folder";
import { BsFolder } from "react-icons/bs";
import { watchFolders } from "../../services/folders";

interface IFolderSelectProps {
  onChange?: (id: string) => void;
}

function FolderSelect({ onChange }: IFolderSelectProps) {
  const { user } = useAuth();
  const { folders, updateFolders } = useFolderStore();

  useEffect(() => {
    let unsub: Unsubscribe | null;
    if (user) {
      unsub = watchFolders((err, data) => {
        if (err) {
          return;
        }
        updateFolders(data);
      });
    }

    return () => {
      unsub && unsub();
    };
    // eslint-disable-next-line
  }, [user]);

  const onSelect = (id: string) => {
    onChange && onChange(id);
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
            <span className="sr-only">Open options</span>
            <BsFolder className="h-5 w-5 p-1" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-10 origin-top-right absolute left-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {folders.map((folder) => {
                return (
                  <Menu.Item key={folder.id}>
                    {({ active }) => (
                      <div
                        onClick={() => onSelect(folder.id || "")}
                        className={classNames(
                          "cursor-pointer text-gray-400 flex items-center hover:text-gray-700 px-4 py-2 text-sm space-x-3 hover:bg-gray-50"
                        )}
                      >
                        <BsFolder style={{ color: folder.color }} />
                        <span>{folder.title}</span>
                      </div>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}

export default FolderSelect;

import { useContext } from "react"
import { ListBoxOptions } from "../../../components/ListBox"
import { ProviderProps, Rules } from "./types"
import { Context } from "./context"
import { useCurrentUser } from "../../../hooks/useCurrentUser"
import { message } from "../../../components/message"
import { useAuth } from "../../../hooks/useAuth"

export const UserList = () => {
  const {
    padShared,
    sharedUsers,
    setSharedUsers,
  } = useContext(Context) as ProviderProps
  const { info } = useCurrentUser()
  const { user } = useAuth()

  const handleSelectedRule = async (rule: Rules, email: string) => {
    const updateUser = sharedUsers.map((user) => user.email === email ? {
      ...user,
      isEdit: rule === Rules.Edit ? true : false,
    } : user)

    setSharedUsers(updateUser)
    message.success("Access privileges have been modified")
  }

return (
  <div className="pb-10">
    <p className="text-lg leading-6 pb-4">People with access rights</p>
    <ul>
      {padShared?.uid === user?.uid && <li className="flex justify-between">
        <div className="flex">
          <div className="m-auto pr-4">
            <img
              className="inline-block h-9 w-9 rounded-full"
              src={info?.photoURL}
              alt=""
            />
          </div>
          <div>
            <p className="text-sm leading-6 font-semibold">{`${info?.fullname} (you)`}</p>
            <p className="text-sm leading-6">{info?.email}</p>
          </div>
        </div>
        <div className="flex items-center text-sm leading-6 pb-4">
          Owner
        </div>
      </li>}
      {sharedUsers.map((user, id) => (
        <li key={id} className="flex justify-between">
          <div className="flex">
            <div className="m-auto pr-4">
              <img
                className="inline-block h-9 w-9 rounded-full"
                src={user.photoURL}
                alt=""
              />
            </div>
            <div>
              <p className="text-sm leading-6 font-semibold">{user.fullName}</p>
              <p className="text-sm leading-6">{user.email}</p>
            </div>
          </div>
          <ListBoxOptions
            options={rules}
            selected={user.isEdit ? Rules.Edit : Rules.View}
            data={user.email}
            customContainer="relative"
            customButton="btn btn-sm"
            customOptions="bg-light absolute right-0 w-36 rounded z-50 cursor-pointer"
            onSelected={handleSelectedRule}
          />
        </li>
      ))}
    </ul>
  </div>
)
}
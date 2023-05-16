import { useState, useEffect } from "react"
import { usePadStore } from "../../../store/index"
import Modal from "../../../components/Modal"
import { Provider } from "./context"
import { IPad, IUserShared, getPadById } from "../../../services/pads"
import { UserList } from "./UserList"
import { ALL_USERS_CAN_EDIT, Rules } from "./types"
import { UserSearch } from "./UserSearch"
import { UserRuleAssignment } from "./UserRuleAssignment"
import { UserShareActions } from "./UserShareActions"

const updatePermissionLevel = (padShared: IPad) => {
  return padShared && padShared.shared.editedUsers === ALL_USERS_CAN_EDIT ? Rules.Edit : Rules.View
}

const updateAccessLevel = (padShared: IPad) => {
  return padShared && padShared?.shared.accessLevel
}

export const PadShareModal = () => {
  const [visible, setVisible] = useState(false)
  const { isOpenPadShareModal, openPadSharedModal } = usePadStore()
  const [isOpenUser, setIsOpenUser] = useState<boolean>(true)
  const [padShared, setPadShared] = useState<IPad>()
  const [accessLevel, setAccessLevel] = useState<Rules>(Rules.Anyone)
  const [permissionLevel, setPermissionLevel] = useState<Rules>(Rules.View)
  const [sharedUsers, setSharedUsers] = useState<IUserShared[]>([])
  const { idShared } = usePadStore() 

  useEffect(() => {
    void (async () => {
      const pad = await getPadById(idShared!)
      if (!pad) return

      setPadShared(pad)
      setPermissionLevel(updatePermissionLevel(pad))
      setAccessLevel(updateAccessLevel(pad))
      setVisible(isOpenPadShareModal)
      pad.shared.sharedUsers ? setSharedUsers([...pad.shared.sharedUsers]) : setSharedUsers([])
    })()
  // eslint-disable-next-line    
  }, [isOpenPadShareModal])

  useEffect(() => {
    if (visible) {
      setIsOpenUser(true)
    }
    openPadSharedModal(visible)
  }, [visible, openPadSharedModal])

  return (
    <div>
      <Modal visible={visible} setVisible={setVisible}>
        <Provider
          props={{
            setVisible,
            setIsOpenUser,
            setSharedUsers,
            setAccessLevel,
            setPermissionLevel,
            permissionLevel,
            accessLevel,
            padShared,
            sharedUsers,
            isOpenUser,
          }}
        > 
          <UserSearch/>
          <UserList/>
          <UserRuleAssignment/>
          <UserShareActions/>
        </Provider>
      </Modal>
    </div>
  )
}

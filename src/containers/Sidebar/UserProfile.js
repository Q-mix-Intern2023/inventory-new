import React from "react";
// import {useDispatch} from "react-redux";
import { Avatar, Popover } from "antd";

import { authUser } from "../../constanst";

const UserProfile = () => {
  function removeLocalstorage() {
    localStorage.removeItem("user");
    window.location.reload();
  }
  // const dispatch = useDispatch();
  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li onClick={() => removeLocalstorage()}>Logout</li>
    </ul>
  );

  return (
    <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row gx-mt-3">
      <Popover
        placement="bottomRight"
        content={userMenuOptions}
        trigger="click"
      >
        <Avatar
          src={
            "https://cdn.iconscout.com/icon/free/png-512/account-profile-avatar-man-circle-round-user-30452.png"
          }
          className="gx-size-40 gx-pointer gx-mr-3"
          alt=""
        />
        <span className="gx-avatar-name">
          {authUser.user.name}
          {authUser.comp}

          <i className="icon icon-chevron-down gx-fs-xxs gx-ml-2" />
        </span>
      </Popover>
    </div>
  );
};

export default UserProfile;

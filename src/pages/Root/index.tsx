import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getGlobalItem } from "../../utils/helper";

const Root = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(getGlobalItem("authToken"));
  }, []);

  return (
    <div>
      <Outlet context={{ token, setToken }} />
    </div>
  );
};

export default Root;

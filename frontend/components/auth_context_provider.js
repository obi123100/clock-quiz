import { createContext } from "react";

const authContext = createContext();

export function ProvideContext({ children }) {
  const auth = useProvideContext();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useProvidedContext = () => {
  return React.useContext(authContext);
};

const useProvideContext = () => {
  const navigate = useNavigate();

  const checkAuth = (err) => {
    if (
      err.response.status === 401 ||
      err.response.data.message === "jwt expired"
    ) {
      localStorage.removeItem("token");
      return navigate("/");
    }
  };
  const Login = async (data) => {
    const res = await login(data);
    if (res.data.status === "success") {
      console.log(res.data.data.user);
      return res.data;
    }
  };

  const user = () => {
    const user = localStorage.getItem("user");
    return JSON.parse(user);
  };

  const getCurrentDraw = async (id) => {
    try {
      const res = await getDraw(id);
      console.log(res, "the res");
      return res.data;
    } catch (err) {
      console.log(err.response.status);
      // if (err.response.status === 401) return localStorage.removeItem("token");
      checkAuth(err);
    }
  };

  const getAlldraws = async (id) => {
    try {
      const res = await getAllDraws(id);
      console.log(res, "the res");
      return res.data;
    } catch (err) {
      console.log(err.response.status);
      // if (err.response.status === 401) return localStorage.removeItem("token");
      checkAuth(err);
    }
  };

  const createNewDraw = async (id, data) => {
    try {
      const res = await createDraw(id, data);
      console.log(res);
      return res.data;
    } catch (err) {
      console.log(err.response.data.message);
      checkAuth(err);
    }
  };

  const createCircleSubscription = async (data) => {
    try {
      const res = await createCircleSub(data);
      console.log(res);
      return res.data;
    } catch (err) {
      console.log(err.response.data.message);
      checkAuth(err);
    }
  };

  const getSubscriptionUrl = async () => {
    try {
      const res = await getSub();
      console.log(res);
      return res.data;
    } catch (err) {
      console.log(err);
      checkAuth(err);
    }
  };

  const deleteSubscriptionUrl = async (id) => {
    try {
      const res = await deleteSub(id);
      console.log(res);
      return res.data;
    } catch (err) {
      console.log(err);
      checkAuth(err);
    }
  };
  return {
    user,
    Login,
    getCurrentDraw,
    getAlldraws,
    createNewDraw,
    getSubscriptionUrl,
    deleteSubscriptionUrl,
    createCircleSubscription,
  };
};
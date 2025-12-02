export const setAuth = () => localStorage.setItem("isAuth", "true");
export const getAuth = () => localStorage.getItem("isAuth");
export const removeAuth = () => localStorage.removeItem("isAuth");

export const setUser = (uid: string) => localStorage.setItem("User", uid);
export const getUser = () => localStorage.getItem("User");
export const removeUser = () => localStorage.removeItem("User");

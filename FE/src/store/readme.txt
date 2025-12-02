  const [registerUser] = useRegisterUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [loginUser] = useLoginUserMutation();
  const [logoutUser] = useLogoutUserMutation();
  const { data: users } = useGetUsersQuery();
  const { data: getAuthStatus } = useGetAuthStatusQuery();
 
 //регистрация пользователя
 const handleClickSettings = async () => {
    await registerUser({
      email: "test1234@example.com",
      password: "123456",
    });
  };

  //login пользователя
  const handleLoginUser = async () => {
    const data = await loginUser({
      email: "test1234@example.com",
      password: "123456",
    });
  };

// обновление пользователя
  const handleUpdateUser = async () => {
    await updateUser({
      uid: "4M1KOiLuPTNgIw8PSK4NFNZV3O82",
      updates: {
        firstName: "Jane",
        sites: ["123", "456"],
        // preferences: { theme: THEME_ENUM.DARK, language: LANGUAGE_ENUM.RU },
      },
    });
  };


// Logout пользователя
  const handleLogoutUser = async () => {
    const data = await logoutUser();
    console.log("logoutUser", data);
  };

// удаление пользователя
  const handleDeleteUser = async () => {
    await deleteUser("36vd6tlhLBUuHEAT78OWbfY3Maj2");
  };

// получение данных текущего пользователя
  const handleCurrentUser = () => {
    const data = getCurrentUser;
    console.log("handleCurrentUser", data);
  };

// Получение пользователей
  const handleGetUsers = () => {
    const data = users;
    console.log("handleCurrentUser", data);
  };


// получение статуса авторизации  
  const handleGetAuthStatus = () => {
    console.log("handleGetAuthStatus", getAuthStatus);
  };



зарегистрированный пользователь
test1234@example.com
123456
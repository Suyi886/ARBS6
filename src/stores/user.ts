const changePassword = async (params: { oldPassword: string; newPassword: string }) => {
  const response = await axios.post('/api/user/change-password', params);
  return response.data;
};

const updateAvatar = (avatarUrl: string) => {
  if (userInfo.value) {
    userInfo.value.avatar = avatarUrl;
  }
}; 
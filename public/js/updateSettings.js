import axios from 'axios';
import { showAlert } from './alerts';
// Type is ether "password" or "data"
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url: url,
      data,
    });
    if (res.data.status == 'success') {
      showAlert('success', `Your ${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

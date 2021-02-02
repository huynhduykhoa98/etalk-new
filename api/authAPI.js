import instance, { getAccessToken } from './instanceAPI';
import { appSettings } from '~/config';
const path = '/ElearnStudentApi';

const key = appSettings.key;

export const LoginAPI = async (values) => {
	let result;
	try {
		const formData = new FormData();
		formData.append('key', key);
		formData.append('username', values.username);
		formData.append('password', values.password);
		let res = await instance.post(path + '/login', formData, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}

	return result;
};

export const LogoutAPI = async (values) => {
	let result;
	try {
		let res = await instance.get(path + '/LogOut', {
			params: {
				token: values,
			},
		});
		result = res.data;
	} catch (error) {
		console.log('Error Logout API: ', error);
		return error.message ? error.message : (result = '');
	}

	return result;
};

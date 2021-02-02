// contexts/auth.js

import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useCallback,
} from 'react';

import Router, { useRouter } from 'next/router';

//api here is an axios instance which has the baseURL set according to the env.

import { LoginAPI } from '~/api/authAPI';
import { LogoutAPI } from '~/api/authAPI';

// const useStyles = makeStyles((theme) => ({
// 	modal: {
// 		minWidth: '500px',
// 		display: 'flex',
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 		[theme.breakpoints.down('sm')]: {
// 			minWidth: '100%',
// 		},
// 	},
// 	paper: {
// 		backgroundColor: theme.palette.background.paper,
// 		boxShadow: theme.shadows[5],
// 		padding: theme.spacing(2, 4, 3),
// 		border: 'none',
// 		borderRadius: '3px',
// 		width: '448px',
// 		'&:focus': {
// 			outline: 'none',
// 			border: 'none',
// 		},
// 		[theme.breakpoints.down('sm')]: {
// 			width: '90%',
// 		},
// 	},
// 	boxBtn: {
// 		display: 'flex',
// 		justifyContent: 'center',
// 		marginTop: '10px',
// 	},
// 	titleModal: {
// 		textAlign: 'center',
// 	},
// 	textModal: {
// 		textAlign: 'center',
// 		fontSize: '16px',
// 		fontWeight: '500',
// 		color: '#d00000',
// 	},
// }));

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const classes = useStyles();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [dataProfile, setDataProfile] = useState();
	const [checkToken, setCheckToken] = useState({
		code: null,
		message: '',
	});
	const [openModal, setOpenModal] = useState(false);
	const router = useRouter();
	const [checkLogin, setCheckLogin] = useState({
		isLogin: null,
		data: '',
		token: '',
	});

	useEffect(() => {
		console.log('Run this');
		async function loadUserFromCookies() {
			if (localStorage.getItem('TokenUser') !== null) {
				setCheckLogin({
					isLogin: true,
					data: JSON.parse(localStorage.getItem('DataUser')),
					token: localStorage.getItem('TokenUser'),
				});
			}
		}
		loadUserFromCookies();
	}, []);

	//LOAD DATA PROFILE
	const loadDataProfile = useCallback((token) => {
		(async () => {
			try {
				const res = await profileAPI(token);
				res.Code === 1 ? setDataProfile(res.Data) : '';
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const updateProfile = async (dataUpdate) => {
		console.log('Data update: ', dataUpdate);

		let check = null;
		try {
			const res = await updateProfileAPI(dataUpdate);
			res.Code === 1 && (check = true);
			res.Code === 0 && changeIsAuth();
			res.Code === 2 && (check = false);
		} catch (error) {
			console.log(error);
		}
		return check;
	};

	const updateImg = async (dataImg) => {
		let check = null;
		try {
			const res = await updateImage(dataImg);
			res.Code === 1 ? (check = true) : (check = false);
		} catch (error) {
			console.log(error);
		}
		return check;
	};

	const updatePass = async (dataPass) => {
		let check = null;
		try {
			const res = await updatePassword(dataPass);
			res.Code === 1 && (check = true);
			res.Code === 0 && changeIsAuth();
			res.Code === 2 && (check = false);
		} catch (error) {
			console.log(error);
		}
		return check;
	};

	const handleLogin = async (values) => {
		// const { data: token } = await api.post('auth/login', { email, password });
		// if (token) {
		// 	console.log('Got token');
		// 	Cookies.set('token', token, { expires: 60 });
		// 	api.defaults.headers.Authorization = `Bearer ${token.token}`;
		// 	const { data: user } = await api.get('users/me');
		// 	setUser(user);
		// 	console.log('Got user', user);
		// }

		let check = {
			status: null,
			message: '',
		};

		try {
			const res = await LoginAPI(values);
			setLoading(false);
			if (res.Code === 1) {
				console.log('Got token');
				localStorage.setItem('TokenUser', res.Data.account.TokenApp);
				localStorage.setItem('DataUser', JSON.stringify(res.Data.account));
				setCheckLogin({
					isLogin: true,
					token: res.Data.account.TokenApp,
					data: res.Data.account,
				});
				check.status = true;
				check.message = res.Message;
				setTimeout(() => {
					router.back();
				}, 1000);
			}
			if (res.Code === 2) {
				check.status = false;
				check.message = res.Message;
			}
		} catch (error) {
			// setLoading(false);
			console.log('Error Login: ', error);
		}
		return check;
	};

	const handleClick_MoveToLogin = () => {
		setOpenModal(false);
		router.push({
			pathname: '/auth/login',
		});
	};

	const changeIsAuth = () => {
		setOpenModal(true);

		setCheckLogin({
			isLogin: false,
		});

		localStorage.clear();
	};

	const handleLogout = async () => {
		console.log('click logout');
		try {
			const res = await LogoutAPI(checkLogin.token);
			if (res.Code === 1) {
				setCheckLogin({
					isLogin: false,
				});

				localStorage.clear();
				router.push('/auth/login');
			}
		} catch (error) {
			console.log('Error Logout: ', error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: checkLogin,
				dataUser: checkLogin.data,
				dataProfile: dataProfile,
				checkToken: checkToken,
				changeIsAuth,
				loadDataProfile,
				updateProfile,
				updateImg,
				updatePass,
				handleLogin,
				handleLogout,
			}}
		>
			{children}
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={openModal}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={openModal}>
					<div className={classes.paper}>
						<h2 id="transition-modal-title" className={classes.titleModal}>
							Thông báo
						</h2>
						<p id="transition-modal-description" className={classes.textModal}>
							Phiên đăng nhập đã hết hạn <br></br> Vui lòng đăng nhập lại
						</p>

						<div className={classes.boxBtn}>
							<Button
								className={classes.mgBtn}
								variant="contained"
								color="primary"
								onClick={handleClick_MoveToLogin}
							>
								Đến trang đăng nhập
							</Button>
						</div>
					</div>
				</Fade>
			</Modal>
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

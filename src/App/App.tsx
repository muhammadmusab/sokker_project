import { TourProvider } from '@reactour/tour';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { ThemeProvider } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';
import { useFullscreen } from 'react-use';
import COLORS from '../common/data/enumColors';
import ThemeContext from '../contexts/themeContext';
import { getOS } from '../helpers/helpers';
import useDarkMode from '../hooks/useDarkMode';
import AsideRoutes from '../layout/Aside/AsideRoutes';
import Portal from '../layout/Portal/Portal';
import Wrapper from '../layout/Wrapper/Wrapper';
import steps, { styles } from '../steps';
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();
const App = () => {
	getOS();

	dayjs.extend(localizedFormat);
	dayjs.extend(relativeTime);

	/**
	 * Dark Mode
	 */
	const { themeStatus, darkModeStatus } = useDarkMode();
	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};

	useEffect(() => {
		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
			document.documentElement.setAttribute('data-bs-theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
			document.documentElement.removeAttribute('data-bs-theme');
		};
	}, [darkModeStatus]);

	/**
	 * Full Screen
	 */
	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const ref = useRef(null);
	useFullscreen(ref, fullScreenStatus, {
		onClose: () => setFullScreenStatus(false),
	});

	/**
	 * Modern Design
	 */
	useLayoutEffect(() => {
		if (import.meta.env.VITE_REACT_APP_MODERN_DESGIN === 'true') {
			document.body.classList.add('modern-design');
		} else {
			document.body.classList.remove('modern-design');
		}
	});

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<TourProvider
					steps={steps}
					styles={styles}
					showNavigation={false}
					showBadge={false}>
					<div
						ref={ref}
						className='app'
						style={{
							backgroundColor: fullScreenStatus ? 'var(--bs-body-bg)' : undefined,
							zIndex: fullScreenStatus ? 1 : undefined,
							overflow: fullScreenStatus ? 'scroll' : undefined,
						}}>
						<AsideRoutes />
						<Wrapper />
						<Toaster />
					</div>

					<Portal id='portal-notification'>
						<ReactNotifications />
					</Portal>
				</TourProvider>
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;

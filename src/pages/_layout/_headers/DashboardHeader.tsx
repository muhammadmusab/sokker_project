import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import CommonHeaderChat from './CommonHeaderChat';
import Search from '../../../components/Search';
import CommonHeaderRight from './CommonHeaderRight';
import logo from '../../../assets/img/sokker.png';

const DashboardHeader = () => {
	return (
		<Header>
			<HeaderLeft>{/* <img src={logo} width={100} /> */}</HeaderLeft>
			{/* <CommonHeaderRight afterChildren={<CommonHeaderChat />} /> */}
			<CommonHeaderRight />
		</Header>
	);
};

export default DashboardHeader;

import React, { useState } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Chart, { IChartOptions } from '../../../components/extras/Chart';
import CommonStoryBtn from '../../../common/other/CommonStoryBtn';

const RadarBasic = () => {
	const [state] = useState<IChartOptions>({
		series: [
			{
				name: 'Series 1',
				data: [80, 50, 30, 40, 100, 20],
			},
		],
		options: {
			chart: {
				height: 350,
				type: 'radar',
			},

			xaxis: {
				categories: ['January', 'February', 'March', 'April', 'May', 'June'],
			},
		},
	});
	return (
		<div className='col-lg-12'>
			<Card stretch style={{ minHeight: '100px' }}>
				<CardBody style={{ minHeight: '100px' }}>
					<Chart
						series={state.series}
						options={state.options}
						type={state.options.chart?.type}
						height={state.options.chart?.height}
						style={{ minHeight: '100px' }}
					/>
				</CardBody>
			</Card>
		</div>
	);
};

export default RadarBasic;

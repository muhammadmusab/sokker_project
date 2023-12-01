import React from 'react';
import './card.scss';

export default function CardS() {
	return (
		<div className='fut-player-card'>
			<div className='player-card-top'>
				<div className='player-master-info'>
					<div className='player-rating'>
						<span
							className=''
							style={{ position: 'relative', left: '50px', top: '25px' }}>
							97
						</span>
					</div>
				</div>
				<div className='player-picture'>
					<img
						src='https://selimdoyranli.com/cdn/fut-player-card/img/messi.png'
						alt='Messi'
						draggable='false'
					/>
				</div>
			</div>
			<div className='player-card-bottom'>
				<div className='player-info'>
					<div className='player-name'>
						<span className=''>MESSI</span>
					</div>
					<div className='player-features'>
						<div className='player-features-col'>
							<span>
								<div className='player-feature-value mt-1'>97</div>
							</span>
							<span>
								<div className='player-feature-value'>95</div>
							</span>
							<span>
								<div className='player-feature-value'>94</div>
							</span>
						</div>
						<div className='player-features-col'>
							<span>
								<div
									className='player-feature-value '
									style={{ position: 'relative', left: '-35px', top: '2px' }}>
									99
								</div>
							</span>
							<span>
								<div
									className='player-feature-value'
									style={{ position: 'relative', left: '-35px', top: '2px' }}>
									35
								</div>
							</span>
							<span>
								<div
									className='player-feature-value'
									style={{ position: 'relative', left: '-35px', top: '2px' }}>
									68
								</div>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

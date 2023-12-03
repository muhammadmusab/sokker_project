import React from 'react';
import { ComponentAttrs } from '../../types/general';
export const Error = ({ className, children, ...rest }: ComponentAttrs) => {
	return (
		<p className={`text-sm font-medium text-destructive ${className}`} {...rest}>
			{children}
		</p>
	);
};

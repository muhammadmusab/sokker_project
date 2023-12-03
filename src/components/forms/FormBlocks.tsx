import React, { HTMLInputTypeAttribute } from 'react';
import FormGroup from '../bootstrap/forms/FormGroup';
import PlaceholderImage from '../extras/PlaceholderImage';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import { FromField } from '../../pages/presentation/project-management/type/types';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
import Input from '../bootstrap/forms/Input';
import Card, { CardBody, CardHeader, CardTitle } from '../bootstrap/Card';
import { ReactSelectInput } from '../form/inputs/ReactSelect';


type FormBlocksProps = {
	formBlocks: {
		title: React.ReactNode;
		formFields: FromField[];
	}[];
	hookForm: UseFormReturn<FieldValues, any, undefined>;
	mode: 'edit' | 'add';
};

export default function FormBlocks({ formBlocks, hookForm, mode }: Readonly<FormBlocksProps>) {
	const {
		register,
		watch,
		control,
		getFieldState,
		formState: { errors },
	} = hookForm;
	const renderFormFields = ({
		id,
		type,
		label,
		name,
		placeHolder,
		className,
		options,
		...rest
	}: FromField) => {
		
		switch (type) {
			case 'number':
			case 'date':
			case 'tel':
			case 'email':
			case 'text':
				return (
					<div key={id} className={className}>
						<FormGroup id={id} label={label} isFloating>
							<Input
								type={type}
								id={id}
								placeholder={placeHolder}
								{...register(name)}
								errorMessage={errors[name]?.message as string}
							/>
						</FormGroup>
					</div>
				);
			case 'select':
				return (
					<div key={id} className={className}>
						<FormGroup id={id} label={label} isFloating>
							<Select ariaLabel='' className='text-capitalize' {...register(name)}>
								{options?.map(({ label, value }) => {
									return (
										<Option key={label} value={value}>
											{label}
										</Option>
									);
								})}
							</Select>
						</FormGroup>
					</div>
				);
			case 'ReactSelect':
				return (
					<div key={id} className={className}>
						<Controller
							name={name}
							control={control}
							render={({ field }) => {
								return <ReactSelectInput {...rest} {...field} />;
							}}></Controller>
					</div>
				);
			case 'file':
				return (
					<div
						key={id}
						className={className}
						style={{
							display: 'flex',
							justifyContent: 'center',
							marginTop: '-15px',
						}}>
						<div className='d-flex flex-column gap-5'>
							{watch(name) && watch(name)?.length !== 0 ? (
								<img
									src={
										typeof watch(name) === 'object'
											? URL.createObjectURL(watch(name)[0])
											: `data:image/png;base64,${watch(name) || ''}`
									}
									alt=''
									style={{
										width: 'fit-content',
										maxWidth: '100%',
										maxHeight: '20vh',
									}}
								/>
							) : (
								<PlaceholderImage
									width={200}
									height={157}
									className=' d-block img-fluid  rounded'
									style={{
										position: 'relative',
										right: '40px !important',
									}}
								/>
							)}
							<Input
								type={type}
								autoComplete='photo'
								ariaLabel='Upload image file'
								{...register(name)}
								errorMessage={errors[name]?.message as string}
							/>
							{/* {watch(name) && <span>{watch(name)[0]?.name}</span>} */}
						</div>
					</div>
				);
		}
	};
	return (
		<>
			{formBlocks.map((block) => {
				return (
					<Card className='mb-5'>
						<CardHeader>
							<CardTitle tag='div' className='h4 text-capitalize'>
								{block.title}
							</CardTitle>
						</CardHeader>
						<CardBody className='row g-4'>
							{block.formFields.map((field) => renderFormFields(field))}
						</CardBody>
					</Card>
				);
			})}
		</>
	);
}

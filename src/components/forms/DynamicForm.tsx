import React, { HTMLInputTypeAttribute } from 'react';
import FormGroup from '../bootstrap/forms/FormGroup';
import PlaceholderImage from '../extras/PlaceholderImage';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import { FromField } from '../../pages/presentation/project-management/type/types';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import Input from '../bootstrap/forms/Input';

type DynamicFormProps = {
	formFields: FromField[];
	hookForm: UseFormReturn<FieldValues, any, undefined>;
	mode: 'edit' | 'add';
};

export default function DynamicForm({ formFields, hookForm, mode }: Readonly<DynamicFormProps>) {
	const {
		register,
		watch,
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
						<FormGroup id='status' label='status' isFloating>
							<Select
								ariaLabel=''
								className='text-capitalize'
								{...register('status')}>
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
			{formFields.map((formField) => {
				return renderFormFields(formField);
			})}
		</>
	);
}

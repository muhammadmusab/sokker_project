import React, { useState, useEffect } from 'react';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import validate from '../../presentation/demo-pages/helper/editPagesValidate';
import { toast } from 'react-hot-toast';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import useDarkMode from '../../../hooks/useDarkMode';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import Avatar from '../../../components/Avatar';
import Spinner from '../../../components/bootstrap/Spinner';
import USERS from '../../../common/data/userDummyData';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import CommonDesc from '../../../common/other/CommonDesc';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Select from '../../../components/bootstrap/forms/Select';
import Option, { Options } from '../../../components/bootstrap/Option';
// import { addClub, getCluub } from '../../../requests';
import Wizard, { WizardItem } from '../../../components/Wizard';

import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import { addEquipe, getCoaches, getEquipes, getPlayer, updateItemById } from '../../../requests';
import { coach } from '../../../types';
import { ReactSelectInput } from '../../../components/form/inputs/ReactSelect';
import FormBlocks from '../../../components/forms/FormBlocks';
import { FieldValues, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useMutation, useQueryClient } from '@tanstack/react-query';


type FormTeamProps = {
	mode: 'edit' | 'add';
	defaultData?: FieldValues;
};

const FormTeamOp = ({mode,defaultData}:FormTeamProps) => {

	const categorie = [
		{ value: 'U7', label: 'Moins de 7 ans' },
		{ value: 'U9', label: 'Moins de 9 ans' },
		{ value: 'U11', label: 'Moins de 11 ans' },
		{ value: 'U13', label: 'Moins de 13 ans' },
		{ value: 'U15', label: 'Moins de 15 ans' },
		{ value: 'U17', label: 'Moins de 17 ans' },
		{ value: 'U19', label: 'Moins de 19 ans' },
		{ value: 'Séniors', label: '20 ans et plus' },
	];

	const teamFormBlocks = [
		{
			title: 'Logo Equipe',
			formFields: [
				{
					id: 'logo',
					name: 'logo',
					label: 'Chose your file',
					placeHolder: 'Chose you file',
					type: 'file',
					className: 'col-12',
				},
			],
		},
		{
			title: 'Information Equipe',
			formFields: [
				{
					id: 'nom',
					name: 'nom',
					label: "Nom de l'équipe",
					placeHolder: "Nom de l'équipe",
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'genre',
					name: 'genre',
					label: 'genre',
					options: [
						{
							value: 'Garçons',
							label: 'Garçons',
						},
						{
							value: 'Filles',
							label: 'Filles',
						},
						{
							value: 'Mix',
							label: 'Mix',
						},
					],
					placeHolder: 'Genre',
					type: 'select',
					className: 'col-md-4',
				},
				{
					id: 'nbrJoueurs',
					name: 'nbrJoueurs',
					label: "nombre de joueur",
					placeHolder: "nombre de joueur",
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'categorieAge',
					name: 'categorieAge',
					label: "catégorie Age",
					placeHolder: "catégorie Age",
					type: 'select',
					className: 'col-md-4',
					options:categorie
				}
			],
		},

		{
			title: 'Joueur',
			formFields: [
				{
					type:'ReactSelect',
					className: 'col-md-12',
					name:'joueur',
					label:'Joueur',
					isAsync:true,
					isMulti:true,
					callback:async (query: string) => {
			
						const data = await getPlayer();
						return data.content.map((item) => ({
							label: item.nom,
							value: item.id,
						}));
					}
				},
	
			],
		},
		// {
		// 	title: 'Address',
		// 	formFields: [
		// 		{
		// 			id: 'adresse',
		// 			name: 'adresse',
		// 			label: 'Adresse',
		// 			placeHolder: 'Adresse',
		// 			type: 'text',
		// 			className: 'col-md-6',
		// 		},
		// 		{
		// 			id: 'codePostal',
		// 			name: 'code_postal',
		// 			label: 'Code Postal',
		// 			placeHolder: 'Code Postal',
		// 			type: 'text',
		// 			className: 'col-md-3',
		// 		},
	
		// 		{
		// 			id: 'ville',
		// 			name: 'ville',
		// 			label: 'Ville',
		// 			placeHolder: 'Ville',
		// 			type: 'text',
		// 			className: 'col-md-3',
		// 		},
		// 	],
		// },
		// {
		// 	title: 'Information de responsable',
		// 	formFields: [
		// 		{
		// 			id: 'responsableNom',
		// 			name: 'responsableNom',
		// 			label: 'Nom de responsable',
		// 			placeHolder: 'Nom de responsable',
		// 			type: 'text',
		// 			className: 'col-md-6',
		// 		},
		// 		{
		// 			id: 'responsableEmail',
		// 			name: 'responsableEmail',
		// 			label: 'Email de responsable',
		// 			placeHolder: 'Email de responsable',
		// 			type: 'email',
		// 			className: 'col-md-6',
		// 		},
		// 	],
		// },
	];


	const { themeStatus } = useDarkMode();

	const navigate = useNavigate();

	const hookForm = useForm({
		defaultValues:defaultData
	});
	const { handleSubmit, control, reset } = hookForm;

	useEffect(()=>{
		reset(defaultData)
	},[defaultData])


	const { mutateAsync: addEquipeMutation, isLoading } = useMutation((formData: FormData) =>
		addEquipe(formData),
	);
	const { mutateAsync: updateEquipeMutation, isLoading: isLoadingUpdate } = useMutation(
		(formData: FormData) => updateItemById({ endPoint: 'equipes', formData }),
	);
	const queryClient = useQueryClient();
	const onSubmit = async (data: any) => {
		const { logo, ...dataToSend } = data;
<<<<<<< HEAD
=======

>>>>>>> be23a8ec161c75c9cc5cef454a0556cc7ea40d57

		const formData = new FormData();
		formData.append('jsonData', JSON.stringify(dataToSend));
		formData.append('image', logo[0]);
		if (mode === 'add')
			await addEquipeMutation(formData)
				.then((res) => {
					toast.success(res.data);
					reset();
					navigate('/equipes');
					queryClient.invalidateQueries({
						queryKey: ['equipes'],
					});
				})
				.catch((error) => {
					toast.error(error.message);
				});
		else {
			console.log({ logo });
			await updateEquipeMutation(formData)
				.then((res) => {
					toast.success('Equipe Modifier');
					reset();
					navigate('/equipes');
					queryClient.invalidateQueries({
						queryKey: ['equipes'],
					});
				})
				.catch((error) => {
					toast.error(error.message);
				});
		}
	};

	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editModern.text}>
			<Page>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DevTool control={control} />
					<SubHeader>
						<SubHeaderLeft>
							<Breadcrumb
								list={[
									{ title: 'équipes', to: '/equipes' },
									{ title: 'Ajouter équipe', to: '/' },
								]}
							/>
						</SubHeaderLeft>
						<SubHeaderRight>
							<Button
								isDisable={isLoading || isLoadingUpdate}
								icon={'Save'}
								isLight
								color={'success'}
								type='submit'>
								{isLoading || isLoadingUpdate
									? 'Chargement...'
									: mode === 'edit'
									? 'Modifier'
									: 'Add'}
							</Button>
						</SubHeaderRight>
					</SubHeader>
					<Page>
						<div className='row  align-content-start'>
							<FormBlocks formBlocks={teamFormBlocks} hookForm={hookForm} />
						</div>
					</Page>
				</form>
			</Page>
		</PageWrapper>
	);
};

export default FormTeamOp;

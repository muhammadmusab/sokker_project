import { useEffect, useState } from 'react';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';

import { FieldValues, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addClub, updateItemById } from '../../../requests';
import { toast } from 'react-hot-toast';
import DynamicForm from '../../../components/forms/DynamicForm';
import { clubFormSteps } from '../../../constents/formFields';
import { zodResolver } from '@hookform/resolvers/zod';
import { CLUB_FORM_SCHEMA } from '../../../components/forms/schemas/clubFormSchema';
import { Cluub } from '../../../types';
import dayjs from 'dayjs';

type FormClubProps = {
	mode: 'edit' | 'add';
	defaultData?: FieldValues;
};
export const ClubForm = ({ mode, defaultData }: FormClubProps) => {
	const queryClient = useQueryClient();
	const [formStep, setFormStep] = useState(1);
	const { id } = useParams();
	const hookForm = useForm({
		resolver: zodResolver(CLUB_FORM_SCHEMA),
	});
	const { handleSubmit, control, reset } = hookForm;
	const { mutateAsync: addClubMutation, isLoading } = useMutation((formData: FormData) =>
		addClub(formData),
	);
	const { mutateAsync: updateClubMutation, isLoading: isLoadingUpdate } = useMutation(
		(formData: FormData) => updateItemById({ endPoint: 'clubs', formData }),
	);

	const navigate = useNavigate();

	const onSubmit = async (data: any) => {
		const { logo, ...dataToSend } = data;
		console.log({ data });

		const formData = new FormData();
		formData.append('jsonData', JSON.stringify(dataToSend));
		formData.append('image', logo[0]);
		if (mode === 'add')
			await addClubMutation(formData)
				.then((res) => {
					toast.success(res.data);
					reset();
					navigate('/clubs');
					queryClient.invalidateQueries({
						queryKey: ['clubs'],
					});
				})
				.catch((error) => {
					toast.error(error.message);
				});
		else {
			console.log({ logo });
			await updateClubMutation(formData)
				.then((res) => {
					toast.success('Club Modifier');
					reset();
					navigate('/clubs');
					queryClient.invalidateQueries({
						queryKey: ['clubs'],
					});
				})
				.catch((error) => {
					toast.error(error.message);
				});
		}
	};

	const currentFormField = clubFormSteps.find(({ stepNumber }) => stepNumber === formStep);
	useEffect(() => {
		if (defaultData) {
			reset({
				...defaultData,
				date_fondation:
					typeof defaultData.date_fondation === 'number'
						? dayjs(defaultData.date_fondation).format('YYYY-MM-DD')
						: defaultData.date_fondation,
				nbre_licencies: `${defaultData.nbre_licencies}`,
				status: `${defaultData.status}`,
			});
		}
	}, [defaultData]);
	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editModern.text}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DevTool control={control} />
				<SubHeader>
					<SubHeaderLeft>
						<Breadcrumb
							list={[
								{ title: 'Club', to: '/clubs' },
								{ title: 'créer club', to: '/clubs/ajouter' },
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
						<Card>
							<CardHeader>
								<CardLabel icon='people' iconColor='info'>
									<CardTitle>
										{currentFormField?.title ?? 'Ajouter Club'}
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4 '>
									<DynamicForm
										formFields={currentFormField?.formFields ?? []}
										hookForm={hookForm}
									/>
									<div className='d-flex justify-content-between  '>
										<Button
											isDisable={formStep <= 1}
											onClick={() => {
												setFormStep(formStep - 1);
											}}
											color='warning'>
											Précédant
										</Button>
										<Button
											isDisable={formStep >= 4}
											onClick={() => {
												setFormStep(formStep + 1);
											}}
											color='warning'>
											Suivant
										</Button>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</Page>
			</form>
		</PageWrapper>
	);
};

export default ClubForm;

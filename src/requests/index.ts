import axios from 'axios';

import {
	Appointment,
	Event,
	datos,
	Player_type,
	Cluub,
	coach,
	equipe,
	Staff,
	Roles,
	fonction,
	GetData,
} from '../types';
import { PAGE_SIZE } from '../constents';

type ListDataParam = {
	endPoint: string;
	currentPage: number;
	pageSize?: number;
};
type DeleteListDataParam = {
	endPoint: string;
	id: number | string;
};

type UpdateListDataParam = {
	endPoint: string;
	formData: FormData;
};

export const getListData = async ({
	endPoint,
	currentPage,
	pageSize = PAGE_SIZE,
}: ListDataParam) => {
	const { data } = await axios.get(
		`https://spring-boot-sokker.onrender.com/api/${endPoint}?page=${currentPage}&size=${pageSize}`,
	);

	return data;
};

export const deleteListItem = async ({ endPoint, id }: DeleteListDataParam) => {
	return await axios.delete(`https://spring-boot-sokker.onrender.com/api/${endPoint}/${id}`);
};

export const getItemById = async ({ endPoint, id }: DeleteListDataParam) => {
	const { data } = await axios.get(
		`https://spring-boot-sokker.onrender.com/api/${endPoint}/${id}`,
	);

	return data;
};
export const updateItemById = async ({ endPoint, formData }: UpdateListDataParam) => {
	return axios.put(`https://spring-boot-sokker.onrender.com/api/${endPoint}`, formData);
};

export const getAppointments = async (): Promise<Appointment[]> => {
	const { data } = await axios.get('http://localhost:3004/data');
	return data;
};

export const getAppointement = async (appointmentData: Appointment) => {
	try {
		const response = await axios.post('http://localhost:3004/data', appointmentData);
		console.log('POST request successful:', response.data);
	} catch (error) {
		console.error('Error submitting data:', error);
	}
};

export const getEvent = async (): Promise<Event[]> => {
	const { data } = await axios.get('http://localhost:3004/types');
	console.log(data);
	return data;
};

export const getEquipes = async (): Promise<datos[]> => {
	try {
		const { data } = await axios.get('https://spring-boot-sokker.onrender.com/api/equipes');

		// // Map the data and convert the 'id' field to BigInt
		// const datosArray: datos[] = data.map((item: datos) => ({
		// 	...item,
		// 	id: (BigInt(item.id) + 1n).toString(),
		// }));

		// console.log(datosArray);
		console.log(data);

		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};
export const getEquipe = async (id: string | undefined): Promise<equipe> => {
	const { data } = await axios.get(`https://spring-boot-sokker.onrender.com/api/equipes/${id}`);
	return data;
};

export const addEquipe = async (equipo: equipe) => {
	try {
		await axios.post('https://spring-boot-sokker.onrender.com/api/equipes', equipo);
		console.log('equipe sent successfully', equipo);
	} catch (error) {
		console.error('Error sending appointment:', error);
		throw error;
	}
};
export const deleteEquipe = async (id: BigInt) => {
	try {
		await axios.delete(`https://spring-boot-sokker.onrender.com/api/equipes/${id}`);
		console.log('Appointment deleted successfully');
	} catch (error) {
		console.error('Error sending appointment:');
		throw error;
	}
};

export const updateClub = async (updatedClubData: equipe) => {
	axios.put(`https://spring-boot-sokker.onrender.com/api/equipes`, updatedClubData);
};

export const getCoaches = async (): Promise<coach[]> => {
	const { data } = await axios.get('https://spring-boot-sokker.onrender.com/api/entraineurs');

	return data;
};
export const getCoache = async (id: number): Promise<coach> => {
	const { data } = await axios.get(
		`https://spring-boot-sokker.onrender.com/api/entraineurs/${id}`,
	);
	console.log('coach', data);
	return data;
};
export const addCoach = async (coachInfo: coach) => {
	try {
		const response = await axios.post(
			`https://spring-boot-sokker.onrender.com/api/entraineurs`,
			coachInfo,
		);
		console.log('Equipe updated successfully', response.data);
	} catch (error) {
		console.error('Error updating club:', error);
		throw error;
	}
};

// Codes Imad

export const getPlayer = async (): Promise<Player_type[]> => {
	const { data } = await axios.get('https://spring-boot-sokker.onrender.com/api/joueurs');
	return data;
};

export const getcluub = async (): Promise<Cluub[]> => {
	const { data } = await axios.get('https://spring-boot-sokker.onrender.com/api/clubs');
	return data;
};

export const addClub = async (formData: FormData) => {
	return await axios.post('https://spring-boot-sokker.onrender.com/api/clubs', formData);
};

export const useClubs = () => {};

export const usePlayer = async (): Promise<Player_type[]> => {
	const { data } = await axios.get('https://spring-boot-sokker.onrender.com/api/joueurs');
	return data;
};

export const getPlayerById = async (id: number | undefined): Promise<Player_type> => {
	const { data } = await axios.get(`https://spring-boot-sokker.onrender.com/api/joueurs/${id}`);

	console.log(data);
	return data;
};

export const usePlayerUpdate = async (id: number | undefined): Promise<Player_type[]> => {
	try {
		const { data } = await axios.put(`https://spring-boot-sokker.onrender.com/api/joueurs/`);
		console.log(data);
		return data;
	} catch (error) {
		console.error(`Error updating player`);
		throw error;
	}
};

export const usePlayerDelete = async (id: number | undefined): Promise<Player_type[]> => {
	const { data } = await axios.delete(
		`https://spring-boot-sokker.onrender.com/api/joueurs/${id}`,
	);

	return data;
};

export const getCluub = async (
	currentPage: number = 1,
	pageSize: number = PAGE_SIZE,
): Promise<GetData<Cluub>> => {
	const { data } = await axios.get(
		`https://spring-boot-sokker.onrender.com/api/clubs?page=${currentPage}&size=${pageSize}`,
	);
	return data;
};

export const getClubById = async (id: number | string | undefined): Promise<Cluub> => {
	try {
		const { data } = await axios.get(`https://spring-boot-sokker.onrender.com/api/clubs/${id}`);
		console.log(data);
		return data;
	} catch (error) {
		throw error; // Re-throw the error so it can be caught in the component
	}
};

export const getClubDelete = async (id: number | undefined) => {
	const { data } = await axios.delete(`https://spring-boot-sokker.onrender.com/api/clubs/${id}`);
	console.log(id);
};

// Staff

export const getStaff = async (): Promise<Staff[]> => {
	// https://spring-boot-sokker.onrender.com/api/staff
	const { data } = await axios.get('https://spring-boot-sokker.onrender.com/api/staff');
	return data;
};

export const getStaffById = async (id: number | undefined): Promise<Staff> => {
	const { data } = await axios.get(`https://spring-boot-sokker.onrender.com/api/staff/${id}`);
	return data;
};

export const getStaffDelet = async (id: number | undefined): Promise<Staff> => {
	const { data } = await axios.delete(`https://spring-boot-sokker.onrender.com/api/staff/${id}`);
	return data;
};

//  Arbitre | Médecin | Trésorier
// get roles

export const getRoles = async (): Promise<Roles[]> => {
	const { data } = await axios.get('https://spring-boot-sokker.onrender.com/api/roles/');
	return data;
};

// get fonction
export const getFonction = async (): Promise<fonction[]> => {
	const { data } = await axios.get('https://spring-boot-sokker.onrender.com/api/fonction/');
	return data;
};

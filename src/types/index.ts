import { type } from 'os';

export type GetData<DataType> = {
	content: DataType[];
	totalPages: number;
};

export type Service = {
	name: string;
	icon: string;
	color: string;
};

export type User = {
	id: string;
	username: string;
	name: string;
	surname: string;
	position: string;
	email: string;
	src?: string;
	srcSet?: string;
	isOnline?: boolean;
	isReply: boolean;
	services: Service[];
	password: string;
};

export type Appointment = {
	id: number;
	start: string;
	end: string;
	user: User;
	name: string;
	icon: string;
	color: string;
};
export type Event = {
	nom: string;
	value: string;
};

export type datos = {
	id: number;
	nom: string;
	genre: string;
	categorieAge: string;
	createdAt: string;
	modifiedAt: null;
	entraineur?: [{}];
	nbrJoueurs: number;
	joueur_ids: null;
	coach_ids: null;
	status: boolean;
};

export type Player_type = {
	[x: string]: any;
	mere_utilisateur: any;
	code_posteal: string;
	id: number;
	nom: string;
	prenom: string;
	gender: string;
	poste: string;
	photo: string;
	niveau: string;
	status: boolean;
	date_naissance: string;
	numeroLicence: string;
	adresse: string;
	email: string;
	telephone: string;
	ficheSante: string;
	taille: string;
	poids: string;
	vma: string;
	clubPrecedent: string;
	saisonActuelle: string;
	pointure: string;
	tailleMaillot: string;
	ville: string;

	gender_mere: string;
	email_mere: string;
	password_mere: string;
	nom_mere: string;
	prenom_mere: string;
	photo_mere: string;
	date_naissance_mere: string;
	telephone_mere: string;
	adresse_mere: string;
	code_posteal_mere: string;
	ville_mere: string;
	status_mere: boolean;

	gender_pere: string;
	email_pere: string;
	password_pere: string;
	nom_pere: string;
	prenom_pere: string;
	photo_pere: string;
	date_naissance_pere: string;
	telephone_pere: string;
	adresse_pere: string;
	code_posteal_pere: string;
	ville_pere: string;
	status_pere: boolean;
};

export type equipe = {
	photo: null;
	id: number;
	nom: string;
	avatar: null;
	genre: string;
	categorieAge: string;
	joueurs: [{}];
	entraineurs: [{}];
	createdAt: string;
	modifiedAt: string;
	evenements: [];
	status: boolean;
	club: string;
	nbrJoueurs: number;
	joueur_ids: [number];
	coach_ids: [number];
};

export type coach = {
	id: number;
	nom: string;
	prenom: string;
	gender: string;
	date_naissance: string;
	telephone: string;
	email: string;
	password: string;
	photo?: string;
	adresse: string;
	code_postal: string;
	ville: string;
	nomRole: string;
	biographie: string;
	certification: string;
	equipes: [{ nom: string }];
	status: boolean;
};

// export type Cluub = {
// 	id: number;
// 	nom_club: string;
// 	ville: string;
// 	responsable: string;
// 	id_fff: string;
// 	nbre_licencies: string;
// 	status: boolean;
// };
export type Cluub = {
	logo: any;
	id: number;
	nom: string;
	ville: string;
	responsable: string;
	id_fff: string;
	nbre_licencies: string;
	status: boolean;
	adresse: string;
	email_admin: string;
	telephone: string;
	site_web: string;
	date_fondation: string;
	date_creation: string;
	stade: string;
	code_postal: string;
	Reseax_sociaux: [];
	Identifiant_FFF: string;
	modifiedAt: string;
	responsableNom: string;
	responsableEmail: string;
};

export type Staff = {
	id: number;
	biographie: string;
	profile: string;
	fonction?: { fonction: string; id: number; status: boolean } | string;
	status: boolean;
	email: string;
	password: string;
	gender: string;
	nom: string;
	prenom: string;
	photo: string;
	date_naissance: string;
	telephone: string;
	adresse: string;
	code_postal: string;
	ville: string;
	date_inscription: string;
	absences: null;
	nomRole: string;
	role: {
		id: number;
		nomRole: string; // Make sure nomRole can be null
		status: boolean;
	} | null;
};

export type Roles = {
	id: number;
	nomRole: string;
	status: boolean;
};

export type fonction = {
	id: number;
	fonction: string;
	status: boolean;
};

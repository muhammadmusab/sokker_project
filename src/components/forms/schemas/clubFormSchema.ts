import { z } from 'zod';

export const CLUB_FORM_SCHEMA = z.object({
	nom: z
		.string({ required_error: 'Ce champs est requis' })
		.nonempty({ message: 'Ce champs est requis' }),
	telephone: z
		.string()
		.refine((value) => /^\d+$/.test(value), {
			message: 'Le numéro de téléphone doit contenir uniquement des chiffres',
		})
		.optional(),
	adresse: z.string().optional(),
	code_postal: z.string().optional(),
	ville: z
		.string({ required_error: 'Ce champs est requis' })
		.nonempty({ message: 'Ce champs est requis' }),
	site_web: z.string().optional(),
	stade: z.string().optional(),
	responsableNom: z
		.string({ required_error: 'Ce champs est requis' })
		.nonempty({ message: 'Ce champs est requis' }),
	responsableEmail: z
		.string({ required_error: 'Ce champs est requis' })
		.email({
			message: 'Veuillez entrer une adresse e-mail valide',
		})
		.nonempty({ message: 'Ce champs est requis' }),
	nbre_licencies: z.string().optional(),
	id_fff: z.string().optional(),
	date_fondation: z.string().optional(),
	status: z.string({ required_error: 'Ce champs est requis' }),
	logo: z
		.custom<FileList>()
		.refine((file) => !file || (!!file && file[0]?.type?.startsWith('image')), {
			message: 'Only images are allowed to be sent.',
		}),
});

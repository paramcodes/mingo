import type { Course } from "./course.schema";

export const STARTER_COURSE: Course = {
	id: "es-en",
	version: "1.0.0",
	title: "Spanish Essentials",
	sourceLanguage: "English",
	targetLanguage: "Spanish",
	units: [
		{
			id: "unit-1",
			title: "Unit 1 · Greetings & Introductions",
			description:
				"Learn core salutations, how to introduce yourself, and everyday courtesies.",
			order: 1,
			lessons: [
				{
					id: "lesson-1",
					title: "Essential Greetings",
					description: "Say hello and greet people throughout the day.",
					order: 1,
					concepts: [
						"concept-hola",
						"concept-buenos-dias",
						"concept-como-estas",
					],
					exercises: [
						{
							id: "ex-1-1",
							type: "multiple_choice",
							prompt: "Select the Spanish word for 'Hello':",
							options: ["Hola", "Adiós", "Gracias", "Por favor"],
							canonicalAnswer: "Hola",
							explanation:
								"'Hola' is the universal, friendly greeting in Spanish.",
						},
						{
							id: "ex-1-2",
							type: "typed_recall",
							prompt: "Translate 'Good morning' into Spanish:",
							canonicalAnswer: "Buenos días",
							acceptedVariants: ["buenos dias", "buen dia", "buen día"],
							explanation:
								"'Buenos días' literally means 'good days' and is used until midday.",
						},
						{
							id: "ex-1-3",
							type: "listening",
							prompt: "Listen to the audio and select what you hear:",
							audioText: "¿Cómo estás?",
							options: [
								"¿Cómo estás?",
								"Mucho gusto",
								"Buenas noches",
								"De nada",
							],
							canonicalAnswer: "¿Cómo estás?",
							explanation:
								"'¿Cómo estás?' means 'How are you?' when speaking informally.",
						},
					],
				},
				{
					id: "lesson-2",
					title: "Introductions & Names",
					description: "Introduce yourself and ask for someone's name.",
					order: 2,
					concepts: [
						"concept-me-llamo",
						"concept-mucho-gusto",
						"concept-como-te-llamas",
					],
					exercises: [
						{
							id: "ex-2-1",
							type: "multiple_choice",
							prompt: "What does 'Mucho gusto' mean?",
							options: [
								"Nice to meet you",
								"See you later",
								"You're welcome",
								"Excuse me",
							],
							canonicalAnswer: "Nice to meet you",
							explanation:
								"'Mucho gusto' is polite for 'Nice to meet you' (pleased to meet you).",
						},
						{
							id: "ex-2-2",
							type: "typed_recall",
							prompt: "Translate 'My name is' into Spanish:",
							canonicalAnswer: "Me llamo",
							acceptedVariants: ["me llamo", "mi nombre es"],
							explanation:
								"'Me llamo' literally means 'I call myself' and is the standard way to state your name.",
						},
						{
							id: "ex-2-3",
							type: "listening",
							prompt: "Listen and choose the phrase spoken:",
							audioText: "¿Cómo te llamas?",
							options: [
								"¿Cómo te llamas?",
								"¿Cómo estás?",
								"Hasta luego",
								"Buenas tardes",
							],
							canonicalAnswer: "¿Cómo te llamas?",
							explanation: "'¿Cómo te llamas?' asks 'What is your name?'.",
						},
					],
				},
				{
					id: "lesson-3",
					title: "Courtesies & Farewells",
					description: "Polite manners and saying goodbye.",
					order: 3,
					concepts: ["concept-por-favor", "concept-gracias", "concept-adios"],
					exercises: [
						{
							id: "ex-3-1",
							type: "multiple_choice",
							prompt: "How do you say 'Thank you' in Spanish?",
							options: ["Gracias", "Por favor", "De nada", "Perdón"],
							canonicalAnswer: "Gracias",
							explanation: "'Gracias' means 'Thank you'.",
						},
						{
							id: "ex-3-2",
							type: "typed_recall",
							prompt: "Translate 'Please' into Spanish:",
							canonicalAnswer: "Por favor",
							acceptedVariants: ["por favor", "porfavor"],
							explanation: "'Por favor' is 'Please'.",
						},
						{
							id: "ex-3-3",
							type: "listening",
							prompt: "Listen and identify the farewell:",
							audioText: "Adiós",
							options: ["Adiós", "Hola", "Sí", "No"],
							canonicalAnswer: "Adiós",
							explanation: "'Adiós' means 'Goodbye'.",
						},
					],
				},
			],
		},
		{
			id: "unit-2",
			title: "Unit 2 · Everyday Communication",
			description:
				"Basic responses, asking for help, and simple conversations.",
			order: 2,
			lessons: [
				{
					id: "lesson-4",
					title: "Essential Responses",
					description: "Saying yes, no, and asking if someone speaks English.",
					order: 4,
					concepts: ["concept-si", "concept-no", "concept-hablas-ingles"],
					exercises: [
						{
							id: "ex-4-1",
							type: "multiple_choice",
							prompt: "Choose the translation for 'Yes':",
							options: ["Sí", "No", "Tal vez", "Bien"],
							canonicalAnswer: "Sí",
							explanation: "'Sí' with an accent means 'Yes'.",
						},
						{
							id: "ex-4-2",
							type: "typed_recall",
							prompt: "Translate 'Do you speak English?' into Spanish:",
							canonicalAnswer: "¿Hablas inglés?",
							acceptedVariants: [
								"hablas ingles",
								"habla ingles",
								"hablas inglés",
								"habla inglés",
								"¿habla inglés?",
							],
							explanation:
								"'¿Hablas inglés?' asks if the other person speaks English.",
						},
					],
				},
			],
		},
	],
};

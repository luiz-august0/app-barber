import sendEmail from "../services/sendEmail";

export default {
	key: 'SenderMail',
	async handle({ data }) {
		await sendEmail(data.email, data.link, data.tipo);
	}
}
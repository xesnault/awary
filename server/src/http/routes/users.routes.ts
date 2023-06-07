import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Static} from "@sinclair/typebox";
import {InfoBody, LoginBody, SignupBody, VerifyEmailQuerystring} from "./users.def";
import {Logger} from "utils/logger";
import {App} from "@app/core";
import {AppData, rateLimit, withData} from "http/utils";
import {isRegistrationEnabled} from "@app/core/features/users/utils";

export function usersRoutes(app: App) {
	return async (server: FastifyInstance) => {

		const usersUseCases = app.userFeature.useCases
		
		server.post<{Body: Static<typeof SignupBody>}>("/signup",
			{
				schema: {body: SignupBody}
			},
			async (request, reply) => {
				const {email, password, adminToken} = request.body;
				await usersUseCases.signupUser(email, password, adminToken)
				reply.send({success: true});
			}
		);

		server.post<{Body: Static<typeof LoginBody>}>("/login",
			{
				schema: {body: LoginBody}
			},
			async (request, reply) => {
				const {email, password} = request.body;
				const user = await usersUseCases.logUser(email, password)

				const token = server.jwt.sign({email});

				return {...user.getState(), token};
			}
		);

		/*server.get<{Querystring: Static<typeof VerifyEmailQuerystring>}>*/
		/*("/signup-email-confirmation", {schema: {querystring: VerifyEmailQuerystring}}, async function (request, reply) {*/
		/*[>const {email, emailConfirmationToken} = request.query;<]*/
		/*[>const user = await app.userService.getUser({email});<]*/
		/*[>if (!user || !await user.verifyEmail(email,  emailConfirmationToken)) {<]*/
		/*[>reply.status(401);<]*/
		/*[>return {};<]*/
		/*[>}<]*/
		/*reply.send({success: true});*/
		/*});*/

		server.post<{Body: Static<typeof InfoBody>}>("/info",
			{
				schema: {body: InfoBody},
				preValidation: [rateLimit(1, 1000)],
			},
			async (request, reply) => {
				const {adminToken} = request.body;
				return usersUseCases.getGlobalInfo(adminToken)
			}
		);

		server.get("/auth",
			{
				preValidation: [withData(app, [AppData.Caller])]
			},
			async function (request) {
				const {caller} = request.data;
				return caller.asUser().getState(); 
			}
		);

		server.get("/isUserRegistrationEnabled", async function (request) {
			return {enabled: isRegistrationEnabled()};
		});
	}
}


import {FastifyInstance} from "fastify";
import {Static} from "@sinclair/typebox";
import {CreateApiKeyBody, CreateApiKeyParams, CreateProjectBody, DeleteApiKeyParams} from "./projects.def";
import {App} from "@app/core";
import {AppData, withData} from "http/utils";
import {ProjectAuthorization, ProjectContext} from "@app/core/features/projects/ProjectContext";

export function adminRoutes(app: App) {
	const adminUseCases = app.serverAdminFeature.useCases

	return async (server: FastifyInstance) => {

		server.get("/admin/server-stats",
			{
				preValidation: [withData(app, [AppData.Caller])]
			},
			async function (request) {
				const {caller} = request.data;
				return adminUseCases.getGlobalStats(caller);
			}
		);
	}
}

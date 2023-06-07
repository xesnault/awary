import {FastifyInstance} from "fastify";
import {Static} from "@sinclair/typebox";
import {CreateLogBody, CreateLogParams, DeleteLogParams} from "./logs.def";
import {LogsUseCases} from "@app/core/features/logs/LogsUseCases";
import {ProjectsUseCases} from "@app/core/features/projects/ProjectsUseCases";
import {UsersUseCases} from "@app/core/features/users/UsersUseCases";
import {App} from "@app/core";
import {AppData, rateLimit, withData} from "http/utils";

export type MetricRoutesDependencies = {
	logService: LogsUseCases,
	projectService: ProjectsUseCases,
	userService: UsersUseCases
}

export function logsRoutes(app: App) {
	const logService = app.logFeature.service
	return async (server: FastifyInstance) => {

		server.get("/projects/:projectId/logs",
			{
				preValidation: [withData(app, [AppData.Context])]
			},
			async function (request, reply) {
				const {context} = request.data;
				const logs = await logService.getLogs(context);
				reply.status(200).send(logs);
			}
		);

		server.post<{Body: Static<typeof CreateLogBody>, Params: Static<typeof CreateLogParams>}>(
			"/projects/:projectId/logs",
			{
				preValidation: [rateLimit(1, 1000), withData(app, [AppData.Context])],
				schema: {body: CreateLogBody, params: CreateLogParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {title, content, tags} = request.body;
				await logService.addLog(context, {title, content, tags})
				reply.status(201).send({});
			}
		);

		server.delete<{Params: Static<typeof DeleteLogParams>}>(
			"/projects/:projectId/logs/:logId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {params: DeleteLogParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {logId} = request.params
				const log = await logService.getLogById(context, logId)
				await logService.deleteLog(context, log);
				reply.status(200).send();
			}
		);
	}
}

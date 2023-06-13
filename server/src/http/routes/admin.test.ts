import {beforeDescribe} from "@app/testUtils/mochaExtensions";
import {ADMIN_TOKEN, sleep} from "@app/utils";
import {expect} from "chai";
import {HttpServer} from "http/HttpServer";
import {buildTestServer, deleteDatabase, setupNewUsers, TestApiKey, TestUser} from "testUtils/apiTestHelper";

describe("Admin", function () {

	let server: HttpServer;
	let users: TestUser[];
	let project1Id: any
	let project2Id: any

	beforeEach(async function () {
		await deleteDatabase();
		server = await buildTestServer();
		users = await setupNewUsers(server.server);
		users[2].SetAuthorization(ADMIN_TOKEN);
	});

	it ("Return error 401 if not using the ADMIN_TOKEN", async function() {
		const resGet = await users[1].Get(`/admin/server-stats`);

		expect(resGet.statusCode).to.equals(401);
	});

	it ("Return 0 projects, 3 users, 0 logs, 0 metrics on initial state", async function() {
		const resGet = await users[2].Get(`/admin/server-stats`);

		expect(resGet.statusCode).to.equals(200);
		expect(resGet.body).to.deep.equals({
			userCount: 3,
			projectCount: 0,
			logCount: 0,
			metricCount: 0,
			metricHistoryEntryCount: 0
		})
	});

	describe("Server stats", function() {

		beforeEach(async function () {
			// Create basic projects
			const resAddProject1 = await users[0].Post("/projects", {name: "p1"});
			await users[0].Post("/projects", {name: "p2"}); // Yep, don't need all projects
			const resAddProject2 = await users[1].Post("/projects", {name: "p3"});
			project1Id = resAddProject1.body.id;
			project2Id = resAddProject2.body.id;
		});

		it ("Return 3 projects, 3 users, 3 logs, 0 metrics", async function() {
			const resGet = await users[2].Get(`/admin/server-stats`);

			expect(resGet.statusCode).to.equals(200);
			expect(resGet.body).to.deep.equals({
				userCount: 3,
				projectCount: 3,
				logCount: 3,
				metricCount: 0,
				metricHistoryEntryCount: 0
			})
		});

		it ("Return 3 projects, 3 users, 4 logs, 1 metrics", async function() {
			await users[0].Post(`/projects/${project1Id}/metrics`, {
				name: "metric 1"
			})

			const resGet = await users[2].Get(`/admin/server-stats`);
			expect(resGet.statusCode).to.deep.equals(200);
			expect(resGet.body).to.deep.equals({
				userCount: 3,
				projectCount: 3,
				logCount: 4,
				metricCount: 1,
				metricHistoryEntryCount: 0
			})
		});

		it ("Return 3 projects, 3 users, 5 logs, 2 metrics, 3 metric history entries", async function() {
			await users[0].Post(`/projects/${project1Id}/metrics`, {
				name: "metric 1"
			})

			const resAddMetric = await users[0].Post(`/projects/${project1Id}/metrics`, {
				name: "metric 2"
			})

			const metricId = resAddMetric.body.id;

			await users[0].Post(`/projects/${project1Id}/metrics/${metricId}`, {value: 1});
			await users[0].Post(`/projects/${project1Id}/metrics/${metricId}`, {value: 2});
			await users[0].Post(`/projects/${project1Id}/metrics/${metricId}`, {value: 3});

			const resGet = await users[2].Get(`/admin/server-stats`);
			expect(resGet.statusCode).to.deep.equals(200);
			expect(resGet.body).to.deep.equals({
				userCount: 3,
				projectCount: 3,
				logCount: 5,
				metricCount: 2,
				metricHistoryEntryCount: 3
			})
		});
	})
});
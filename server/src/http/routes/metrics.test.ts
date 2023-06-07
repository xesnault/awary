import {beforeDescribe} from "@app/testUtils/mochaExtensions";
import {sleep} from "@app/utils";
import {expect} from "chai";
import {HttpServer} from "http/HttpServer";
import {buildTestServer, deleteDatabase, setupNewUsers, TestApiKey, TestUser} from "testUtils/apiTestHelper";

describe("Metrics", function () {

	let server: HttpServer;
	let users: TestUser[];
	let project1: any
	let project1ApiKey1: TestApiKey
	let project1ApiKey2: TestApiKey

	let project2: any
	let project2ApiKey1: TestApiKey

	let metric1: any

	before(async function () {
		// Setup the server and app
		await deleteDatabase();
		server = await buildTestServer();
		// Create basic users
		users = await setupNewUsers(server.server);
		// Create basic projects
		await users[0].Post("/projects", {name: "p1"});
		await users[0].Post("/projects", {name: "p2"});
		await users[1].Post("/projects", {name: "p3"});

		let response = await users[0].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2);

		project1 = response.body[0];
		project2 = response.body[1];

		// Add 2 Api keys for project 1 and 1 Api ket for project 2
		response = await users[0].Post(`/projects/${project1.id}/apiKeys`, {name: "key1"});
		expect(response.statusCode).to.equals(201);
		expect(response.body).to.be.a("object");

		response = await users[0].Post(`/projects/${project1.id}/apiKeys`, {name: "key2"});
		expect(response.statusCode).to.equals(201);
		expect(response.body).to.be.a("object");

		response = await users[0].Post(`/projects/${project2.id}/apiKeys`, {name: "key3"});
		expect(response.statusCode).to.equals(201);
		expect(response.body).to.be.a("object");

		response = await users[0].Get(`/projects/${project1.id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2);
		expect(response.body[0].name).to.equals("key1")
		expect(response.body[0].projectId).to.equals(project1.id)
		expect(response.body[0].key).to.not.be.undefined
		expect(response.body[1].name).to.equals("key2")
		expect(response.body[1].projectId).to.equals(project1.id)
		expect(response.body[1].key).to.not.be.undefined

		project1ApiKey1 = new TestApiKey(server.server, response.body[0].key)
		project1ApiKey2 = new TestApiKey(server.server, response.body[1].key)

		response = await users[0].Get(`/projects/${project2.id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1);
		expect(response.body[0].name).to.equals("key3")
		expect(response.body[0].projectId).to.equals(project2.id)
		expect(response.body[0].key).to.not.be.undefined

		project2ApiKey1 = new TestApiKey(server.server, response.body[0].key)
	});

	it ("Returns empty metric list", async function() {
		const response = await users[0].Get(`/projects/${project1.id}/metrics`);

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(0);
	});

	it ("Returns error 400 on bad payload", async function() {
		let response = await users[0].Post(`/projects/${project1.id}/metrics`, {
		});

		expect(response.statusCode).to.equals(400);

		response = await users[0].Post(`/projects/${project1.id}/metrics`, {
			type: "numeric"
		});

		expect(response.statusCode).to.equals(400);
	});

	it ("Adds a metric", async function() {
		const response = await users[0].Post(`/projects/${project1.id}/metrics`, {
			name: "metric 1",
			type: "numeric"
		});

		expect(response.statusCode).to.equals(201);
	});

	it ("Returns metric list with 1 result as [User 1]", async function() {
		const response = await users[0].Get(`/projects/${project1.id}/metrics`);

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1);
		metric1 = response.body[0];
	});

	it ("Returns metric list with 1 result on project 1 as [Key 1]", async function() {
		const response = await project1ApiKey1.Get(`/projects/${project1.id}/metrics`);

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1);
	});

	it ("Adds data point to metric 1 on project 1 as [Key 1]", async function() {

		const response = await project1ApiKey1.Post(`/projects/${project1.id}/metrics/${metric1.id}`, {
			value: 42
		});

		expect(response.statusCode).to.equals(201);
	});

	it ("Returns metric list with 1 result and check data point as [User 1]", async function() {
		const response = await users[0].Get(`/projects/${project1.id}/metrics`);

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1);
		expect(response.body[0].history).to.have.length(1);
		expect(response.body[0].history[0].value).to.equals(42);
	});

	it ("Simple rate limit test for [Key 1]", async function() {
		process.env.RATE_LIMIT_ENABLED = 'true'
		const response1 = await project1ApiKey1.Post(`/projects/${project1.id}/metrics/${metric1.id}`, {
			value: 42
		});

		expect(response1.statusCode).to.equals(201);

		const response2 = await project1ApiKey1.Post(`/projects/${project1.id}/metrics/${metric1.id}`, {
			value: 43
		});

		expect(response2.statusCode).to.equals(429);

		await sleep(1100)

		const response3 = await project1ApiKey1.Post(`/projects/${project1.id}/metrics/${metric1.id}`, {
			value: 44
		});

		expect(response3.statusCode).to.equals(201);

		process.env.RATE_LIMIT_ENABLED = 'false'
	});
});

import {expect} from "chai";
import {HttpServer} from "http/HttpServer";
import {MongoClient} from "mongodb";
import {buildTestServer, deleteDatabase, setupNewUsers, TestUser} from "testUtils/apiTestHelper";

describe("Adding projects", function () {

	let server: HttpServer;
	let users: TestUser[];

	before(async function () {
		await deleteDatabase();
		server = await buildTestServer();
		users = await setupNewUsers(server.server);
	});

	it ("Returns empty project list for both user", async function() {
		const responseUser1 = await users[0].Get("/projects");

		expect(responseUser1.statusCode).to.equals(200);
		expect(responseUser1.body).to.be.a("array");
		expect(responseUser1.body).to.have.length(0)

		const responseUser2 = await users[1].Get("/projects");

		expect(responseUser2.statusCode).to.equals(200);
		expect(responseUser2.body).to.be.a("array");
		expect(responseUser2.body).to.have.length(0)
	});

	it ("Adds a project to [User 1]", async function() {
		const response = await users[0].Post("/projects", {name: "p1"});

		expect(response.statusCode).to.equals(201);
	});

	it ("Returns 1 project for [User 1]", async function() {
		const response = await users[0].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1)
	});

	it ("Adds another project to [User 1]", async function() {
		const response = await users[0].Post("/projects", {name: "p2"});

		expect(response.statusCode).to.equals(201);
	});

	it ("Returns 2 projects for [User 1]", async function() {
		const response = await users[0].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2)
	});

	it ("Returns empty list for [User 2]", async function() {
		const response = await users[1].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(0)
	});

	it ("Adds a project to [User 2]", async function() {
		const response = await users[1].Post("/projects", {name: "p3"});

		expect(response.statusCode).to.equals(201);
	});

	it ("Returns 2 projects for [User 1]", async function() {
		const response = await users[0].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2)
	});

	it ("Returns 1 project for [User 2]", async function() {
		const response = await users[1].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1)
	});

	it ("Checks properties of [User 1]'s projects'", async function() {
		const response = await users[0].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2)
		expect(response.body[0].name).to.equals("p1")
		expect(response.body[1].name).to.equals("p2")
	});

	it ("Checks properties of [User 2]'s projects'", async function() {
		const response = await users[1].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1)
		expect(response.body[0].name).to.equals("p3")
	});
});

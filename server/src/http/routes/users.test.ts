import {expect} from "chai";
import {HttpServer} from "http/HttpServer";
import {buildTestServer, deleteDatabase} from "testUtils/apiTestHelper";

const users = [
	{
		email: "user1@test.com",
		password: "user1_password"
	},
	{
		email: "user2@test.com",
		password: "user2_password"
	},
	{
		email: "user3@test.com",
		password: "user3_password"
	}
];

async function TestRequiredBody(server: HttpServer, OriginalRequest: any) {
	const payloadKeys = Object.keys(OriginalRequest.payload);

	for (const key of payloadKeys) {

		const request = JSON.parse(JSON.stringify(OriginalRequest));
		delete request.payload[key];
		const response = await server.inject(request);
		expect(response.statusCode).to.equals(400);
	}
}

describe("Signup and Login", function () {

	let server: HttpServer;

	before(async function () {
		await deleteDatabase();
		server = await buildTestServer();
	});

	it ("User registration is enabled", async function() {
		const response = await server.inject({
			method: "GET",
			url: "/isUserRegistrationEnabled",
		});

		expect(response.statusCode).to.equals(200);
		expect(response.json().enabled).to.equals(true)
	});

	it ("Fails get current user (401) because no Bearer token is provided", async function() {
		const response = await server.inject({
			method: "GET",
			url: "/auth",
		});

		expect(response.statusCode).to.equals(401);
	});

	it ("Should fail (400) when a required property is missing", async function() {
		await TestRequiredBody(server, {
			method: "POST",
			url: "/login",
			payload: {
				email: users[0].email,
				password: users[0].password,
			}
		});
	});

	it("Should fail to log in with wrong credentials", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/login",
			payload: {
				email: users[0].email,
				password: users[0].password,
			}
		});

		expect(response.statusCode).to.equals(401);
	});

	/*it("Should fail to sign up a new user (wrong code)", async function () {*/

	/*const response = await server.inject({*/
	/*method: "POST",*/
	/*url: "/signup",*/
	/*payload: {*/
	/*email: users[0].email,*/
	/*password: users[0].password,*/
	/*code: "qwerty"*/
	/*}*/
	/*});*/

	/*expect(response.statusCode).to.equals(403);*/
	/*});*/

	/*let codeForSignup = "";*/

	/*it("Create a new code for sign up", async function () {*/

	/*const response = await server.inject({*/
	/*method: "POST",*/
	/*url: "/users/codes",*/
	/*payload: {*/
	/*email: users[0].email,*/
	/*tmpSecret: thisIsATemporaryPasswordToPreventUserCreation,*/
	/*}*/
	/*});*/

	/*expect(response.statusCode).to.equals(200);*/
	/*codeForSignup = response.body;*/
	/*expect(codeForSignup).to.be.a.string;*/
	/*expect(codeForSignup).to.have.length.greaterThan(0);*/
	/*});*/

	/*it("Should fail to sign up a the wrong email using right code", async function () {*/

	/*const response = await server.inject({*/
	/*method: "POST",*/
	/*url: "/signup",*/
	/*payload: {*/
	/*email: users[1].email,*/
	/*password: users[1].password,*/
	/*code: codeForSignup*/
	/*}*/
	/*});*/

	/*expect(response.statusCode).to.equals(403);*/
	/*});*/

	it("Should succeed to sign up a new user", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/signup",
			payload: {
				email: users[0].email,
				password: users[0].password,
				//code: codeForSignup
			}
		});

		expect(response.statusCode).to.equals(200);
	});


	/*it("Should fail to log in with the new user because email is not verified", async function () {*/

	/*const response = await server.inject({*/
	/*method: "POST",*/
	/*url: "/login",*/
	/*payload: {*/
	/*email: users[0].email,*/
	/*password: users[0].password,*/
	/*}*/
	/*});*/

	/*expect(response.statusCode).to.equals(403);*/
	/*});*/
	
	/*it("Fail to verify the email (wrong token)", async function () {*/

	/*const response = await server.inject({*/
	/*method: "GET",*/
	/*url: `/signup-email-confirmation?email=${users[0].email}&emailConfirmationToken=this_is_a_random_string`,*/
	/*});*/

	/*expect(response.statusCode).to.equals(401);*/
	/*});*/

	/*it("Verify the email", async function () {*/

	/*const user = await server.app.managers.userManager.FetchUserByEmail(users[0].email);*/

	/*const response = await server.inject({*/
	/*method: "GET",*/
	/*url: `/signup-email-confirmation?email=${users[0].email}&emailConfirmationToken=${user?.GetDocument().emailConfirmationToken}`,*/
	/*});*/

	/*expect(response.statusCode).to.equals(200);*/
	/*});*/

	it("Should succeed to log in with the new user", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/login",
			payload: {
				email: users[0].email,
				password: users[0].password,
			}
		});

		expect(response.statusCode).to.equals(200);
	});

	/*it("Create a new code for sign up (2nd user)", async function () {*/

	/*const response = await server.inject({*/
	/*method: "POST",*/
	/*url: "/users/codes",*/
	/*payload: {*/
	/*tmpSecret: thisIsATemporaryPasswordToPreventUserCreation,*/
	/*}*/
	/*});*/

	/*expect(response.statusCode).to.equals(200);*/
	/*codeForSignup = response.body;*/
	/*expect(codeForSignup).to.be.a.string;*/
	/*expect(codeForSignup).to.have.length.greaterThan(0);*/
	/*});*/

	it("Should fail to sign up because email is already taken", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/signup",
			payload: {
				email: users[0].email,
				password: users[1].password,
			}
		});

		expect(response.statusCode).to.equals(409);
	});

	it("Fails to sign up because email has wrong format", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/signup",
			payload: {
				email: "wrong",
				password: users[1].password,
			}
		});

		expect(response.statusCode).to.equals(400);
	});

	it("Fails to sign up because email is an empty string", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/signup",
			payload: {
				email: "",
				password: users[1].password,
			}
		});

		expect(response.statusCode).to.equals(400);
	});

	it("Fails to sign up because password is an empty string", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/signup",
			payload: {
				email: users[1].email,
				password: "",
			}
		});

		expect(response.statusCode).to.equals(400);
	});

	it("Should succeed to sign up a new user (2nd user)", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/signup",
			payload: {
				email: users[1].email,
				password: users[1].password,
			}
		});

		expect(response.statusCode).to.equals(200);
	});

	/*it("Verify the email of the 2nd user", async function () {*/

	/*const user = await server.app.managers.userManager.FetchUserByEmail(users[1].email);*/

	/*const response = await server.inject({*/
	/*method: "GET",*/
	/*url: `/signup-email-confirmation?email=${users[1].email}&emailConfirmationToken=${user?.GetDocument().emailConfirmationToken}`,*/
	/*});*/

	/*expect(response.statusCode).to.equals(200);*/
	/*});*/

	let token = "";

	it("Should succeed to log in with the 2nd user", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/login",
			payload: {
				email: users[1].email,
				password: users[1].password,
			}
		});

		const body = response.json();

		expect(response.statusCode).to.equals(200);
		expect(body.token).to.be.a("string");
		token = body.token;
	});

	it ("Fails to get current authenticated user because of wrong jwt token", async function() {
		const response = await server.inject({
			method: "GET",
			url: "/auth",
			headers: {
				["Authorization"]: "Bearer abcd"
			}
		});

		expect(response.statusCode).to.equals(401);
	});

	it ("Succeed to get current authenticated user", async function() {
		const response = await server.inject({
			method: "GET",
			url: "/auth",
			headers: {
				["Authorization"]: `Bearer ${token}`
			}
		});

		expect(response.statusCode).to.equals(200);
	});

	it("Should fail to log in with password of another user", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/login",
			payload: {
				email: users[1].email,
				password: users[0].password,
			}
		});

		expect(response.statusCode).to.equals(401);
	});

	it("Should fail to log in with a total random password", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/login",
			payload: {
				email: users[1].email,
				password: "qwertyasdfgzxcvb",
			}
		});

		expect(response.statusCode).to.equals(401);
	});

	it("Should fail to log in with an unknown email but existing password", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/login",
			payload: {
				email: "this_email@doesnt.exist",
				password: users[0].password,
			}
		});

		expect(response.statusCode).to.equals(401);
	});

	it("Should fail to log in with an unknown email and unknown password", async function () {

		const response = await server.inject({
			method: "POST",
			url: "/login",
			payload: {
				email: "this_email@doesnt.exist",
				password: "this_password_doesnt_exist",
			}
		});

		expect(response.statusCode).to.equals(401);
	});
});

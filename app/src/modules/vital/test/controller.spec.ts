import { VitalClient } from "@tryvital/vital-node";
import { ClientFacingProviderWithStatus } from "@tryvital/vital-node/api";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import type { Request, Response } from "express";
import sinon from "sinon";
import mqConnection from "../../../shared/utils/rabbitmq";
import VitalController from "../controllers/vitalController";

chai.use(chaiHttp);

describe("VitalController", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let statusStub: sinon.SinonStub;
	let jsonStub: sinon.SinonStub;
	let vitalClientStub: sinon.SinonStub;
	let sendToQueueStub: sinon.SinonStub;

	beforeEach(() => {
		req = {
			params: {
				vitalUserId: "testUserId",
				provider: "testProvider",
			},
		};
		res = {
			status: sinon.stub().returnsThis(),
			json: sinon.stub(),
		};
		statusStub = res.status as sinon.SinonStub;
		jsonStub = res.json as sinon.SinonStub;
		vitalClientStub = sinon.stub(VitalClient.prototype, "link").value({
			token: sinon.stub().resolves({ token: "mockToken" }),
		});
		sendToQueueStub = sinon.stub(mqConnection, "sendToQueue");
	});

	afterEach(() => {
		sinon.restore();
	});

	describe("getToken", () => {
		it("should return a token when successful", async () => {
			await VitalController.getToken(req as Request, res as Response);

			expect(statusStub.calledWith(200)).to.be.true;
			expect(jsonStub.calledWith({ token: "mockToken" })).to.be.true;
		});
	});

	describe("getProviders", () => {
		it("should return an error when something fails", async () => {
			sinon
				.stub(VitalClient.prototype.user, "getConnectedProviders")
				.rejects(new Error("Failed to get providers"));

			await VitalController.getProviders(req as Request, res as Response);

			expect(statusStub.calledWith(400)).to.be.true;
			expect(
				jsonStub.calledWith({
					error: "Failed to get providers",
				}),
			).to.be.true;
		});
	});

	describe("getRemovalOfConnection", () => {
		it("should remove provider and send a message to the queue", async () => {
			const mockResponse = { success: true };
			sinon
				.stub(VitalClient.prototype.user, "deregisterProvider")
				.resolves(mockResponse);

			await VitalController.getRemovalOfConnection(
				req as Request,
				res as Response,
			);

			expect(statusStub.calledWith(200)).to.be.true;
			expect(jsonStub.calledWith(mockResponse)).to.be.true;
			expect(
				sendToQueueStub.calledWith("vital_user_queue", {
					event: "VitalProviderRemoved",
					data: { ...mockResponse, vitalUserId: "testUserId" },
				}),
			).to.be.true;
		});

		it("should return an error when something fails", async () => {
			sinon
				.stub(VitalClient.prototype.user, "deregisterProvider")
				.rejects(new Error("Failed to remove provider"));

			await VitalController.getRemovalOfConnection(
				req as Request,
				res as Response,
			);

			expect(statusStub.calledWith(400)).to.be.true;
			expect(
				jsonStub.calledWith({
					error: "Failed to remove provider",
				}),
			).to.be.true;
		});
	});
});

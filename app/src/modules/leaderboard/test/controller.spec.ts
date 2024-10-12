import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import sinon from "sinon";
import LeaderboardController from "../controllers/leaderboardController";
import type { ILeaderboardEntry } from "../models/leaderboardEntry";
import LeaderboardService from "../services/leaderboardService";

chai.use(chaiHttp);

describe("LeaderboardController", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let jsonStub: sinon.SinonStub;
	let statusStub: sinon.SinonStub;

	beforeEach(() => {
		req = {};
		res = {
			json: sinon.stub(),
			status: sinon.stub(),
		};
		jsonStub = res.json as sinon.SinonStub;
		statusStub = res.status as sinon.SinonStub;
		statusStub.returns(res);
	});

	afterEach(() => {
		sinon.restore();
	});

	describe("createLeaderboardEntry", () => {
		it("should return 400 if validation errors exist", async () => {
			req.body = {};
			sinon.stub(LeaderboardService, "createLeaderboardEntry").resolves();
			await LeaderboardController.createLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
		});

		it("should create a leaderboard entry and return 201", async () => {
			req.body = { name: "John Doe" };
			req.userId = "123";
			sinon.stub(LeaderboardService, "createLeaderboardEntry").resolves({
				name: "John Doe",
				score: 23,
				date: new Date(),
				userId: "user123",
				teamId: "team1234",
			} as ILeaderboardEntry);
			await LeaderboardController.createLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(201)).to.be.true;
		});

		it("should return 400 if LeaderboardService throws an error", async () => {
			req.body = { name: "John Doe" };
			req.userId = "123";
			sinon
				.stub(LeaderboardService, "createLeaderboardEntry")
				.throws(new Error("Error creating leaderboard entry"));
			await LeaderboardController.createLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "Error creating Leaderboard Entry" })).to.be.true;
		});
	});

	describe("getLeaderboardEntry", () => {
		it("should return 400 if userId is invalid", async () => {
			req.params = { id: "invalid-id" };
			await LeaderboardController.getLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ message: "Invalid Leaderboard Entry ID format" })).to.be
				.true;
		});

		it("should return 404 if userEntry is not found", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon.stub(LeaderboardService, "getLeaderboardEntryById").resolves(null);
			await LeaderboardController.getLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(404)).to.be.true;
			expect(jsonStub.calledWith({ error: "No Leaderboard Entry Found in Leaderboard" })).to.be.true;
		});

		it("should return 200 if leaderboard entry is found", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			const entry = { name: "John Doe" };
			sinon.stub(LeaderboardService, "getLeaderboardEntryById").resolves(entry as any);
			await LeaderboardController.getLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(200)).to.be.true;
			expect(jsonStub.calledWith(entry)).to.be.true;
		});

		it("should return 400 if LeaderboardService throws an error", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon
				.stub(LeaderboardService, "getLeaderboardEntryById")
				.throws(new Error("Error retrieving Leaderboard Entry"));
			await LeaderboardController.getLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "rror retrieving Leaderboard Entry" })).to.be
				.true;
		});
	});

	describe("getLeaderboard", () => {
		it("should return 404 if no entires are found", async () => {
			req.userId = "123";
			sinon.stub(LeaderboardService, "getAllLeaderboard").resolves(null);
			await LeaderboardController.getLeaderboard(req as Request, res as Response);
			expect(statusStub.calledWith(404)).to.be.true;
			expect(jsonStub.calledWith({ error: "No Leaderboard Entries Found" })).to.be.true;
		});

		it("should return 200 if entries are found", async () => {
			req.userId = "123";
			const entry = [{ name: "John Doe" }];
			sinon.stub(LeaderboardService, "getAllLeaderboard").resolves(entry as any);
			await LeaderboardController.getLeaderboard(req as Request, res as Response);
			expect(statusStub.calledWith(200)).to.be.true;
			expect(jsonStub.calledWith(entry)).to.be.true;
		});

		it("should return 400 if LeaderboardService throws an error", async () => {
			req.userId = "123";
			sinon
				.stub(LeaderboardService, "getAllLeaderboard")
				.throws(new Error("Error retrieving Leaderboard Entries"));
			await LeaderboardController.getLeaderboard(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "Error retrieving Leaderboard Entries" })).to.be
				.true;
		});
	});

	describe("updateLeaderboardEntry", () => {
		it("should return 400 if userId is invalid", async () => {
			req.params = { id: "invalid-id" };
			await LeaderboardController.updateLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ message: "Invalid leaderboard Entry ID forma" })).to.be
				.true;
		});

		it("should return 404 if entry is not found", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon.stub(LeaderboardService, "updateLeaderboardEntry").resolves(null);
			await LeaderboardController.updateLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(404)).to.be.true;
			expect(jsonStub.calledWith({ error: "No Leaderboard Entry Found in Leaderboard" })).to.be.true;
		});

		it("should return 200 if entry is updated", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			req.body = { score: 999 };
			const updatedScore = { name: "Updated Leaderboard Entry" };
			sinon.stub(LeaderboardService, "updateLeaderboardEntry").resolves(updatedScore as any);
			await LeaderboardController.updateLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(200)).to.be.true;
			expect(jsonStub.calledWith(updatedScore)).to.be.true;
		});

		it("should return 400 if LeaderboardService throws an error", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			req.body = { name: "John Doe" };
			sinon
				.stub(LeaderboardService, "updateLeaderboardEntry")
				.throws(new Error("Error updating Leaderboard Entry"));
			await LeaderboardController.updateLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "Error updating Leaderboard Entry" })).to.be.true;
		});
	});

	describe("deleteLeaderboardEntry", () => {
		it("should return 400 if userID is invalid", async () => {
			req.params = { id: "invalid-id" };
			await LeaderboardController.deleteLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ message: "valid Leaderboard Entry ID format" })).to.be
				.true;
		});

		it("should return 404 if entry is not found", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon.stub(LeaderboardService, "deleteLeaderboardEntry").resolves(null);
			await LeaderboardController.deleteLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(404)).to.be.true;
			expect(jsonStub.calledWith({ error: "No Leaderboard Entry Found" })).to.be.true;
		});

		it("should return 204 if entry is deleted", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon.stub(LeaderboardService, "deleteLeaderboardEntry").resolves(true);
			await LeaderboardController.deleteLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(204)).to.be.true;
		});

		it("should return 400 if LeaderboardService throws an error", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon
				.stub(LeaderboardService, "deleteLeaderboardEntry")
				.throws(new Error("Error deleting Leaderboard Entry"));
			await LeaderboardController.deleteLeaderboardEntry(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "Error deleting Leaderboard Entry from Leaderboard" })).to.be.true;
		});
	});
});

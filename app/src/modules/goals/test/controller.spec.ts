import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import sinon from "sinon";
import GoalController from "../controllers/goalController";
import type { IGoal } from "../models/goal";
import GoalService from "../services/goalService";

chai.use(chaiHttp);

describe("GoalController", () => {
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

	describe("createGoal", () => {
		it("should return 400 if validation errors exist", async () => {
			req.body = {};
			sinon.stub(GoalService, "createGoal").resolves();
			await GoalController.createGoal(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
		});

		it("should create a goal and return 201", async () => {
			req.body = { name: "Test Goal" };
			req.userId = "123";
			sinon.stub(GoalService, "createGoal").resolves({
				name: "Test Goal",
				createdAt: new Date(),
				updatedAt: new Date(),
				goalInt: 10,
				teamId: "team123",
				userId: "user123",
				interval: "weekly",
			} as IGoal);
			await GoalController.createGoal(req as Request, res as Response);
			expect(statusStub.calledWith(201)).to.be.true;
		});

		it("should return 400 if GoalService throws an error", async () => {
			req.body = { name: "Test Goal" };
			req.userId = "123";
			sinon
				.stub(GoalService, "createGoal")
				.throws(new Error("Error creating Goal"));
			await GoalController.createGoal(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "Error creating Goal" })).to.be.true;
		});
	});

	describe("getGoal", () => {
		it("should return 400 if goalId is invalid", async () => {
			req.params = { id: "invalid-id" };
			await GoalController.getGoal(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ message: "Invalid Goal ID format" })).to.be
				.true;
		});

		it("should return 404 if goal is not found", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon.stub(GoalService, "getGoalById").resolves(null);
			await GoalController.getGoal(req as Request, res as Response);
			expect(statusStub.calledWith(404)).to.be.true;
			expect(jsonStub.calledWith({ error: "No Goal Found" })).to.be.true;
		});

		it("should return 200 if goal is found", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			const goal = { name: "Test Goal" };
			sinon.stub(GoalService, "getGoalById").resolves(goal as any);
			await GoalController.getGoal(req as Request, res as Response);
			expect(statusStub.calledWith(200)).to.be.true;
			expect(jsonStub.calledWith(goal)).to.be.true;
		});

		it("should return 400 if GoalService throws an error", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon
				.stub(GoalService, "getGoalById")
				.throws(new Error("Error retrieving Goal"));
			await GoalController.getGoal(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "Error retrieving Goal" })).to.be
				.true;
		});
	});

	describe("getGoals", () => {
		it("should return 404 if no goals are found", async () => {
			req.userId = "123";
			sinon.stub(GoalService, "getGoals").resolves(null);
			await GoalController.getGoals(req as Request, res as Response);
			expect(statusStub.calledWith(404)).to.be.true;
			expect(jsonStub.calledWith({ error: "No Goals Found" })).to.be.true;
		});

		it("should return 200 if goals are found", async () => {
			req.userId = "123";
			const goals = [{ name: "Test Goal" }];
			sinon.stub(GoalService, "getGoals").resolves(goals as any);
			await GoalController.getGoals(req as Request, res as Response);
			expect(statusStub.calledWith(200)).to.be.true;
			expect(jsonStub.calledWith(goals)).to.be.true;
		});

		it("should return 400 if GoalService throws an error", async () => {
			req.userId = "123";
			sinon
				.stub(GoalService, "getGoals")
				.throws(new Error("Error retrieving Goals"));
			await GoalController.getGoals(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "Error retrieving Goals" })).to.be
				.true;
		});
	});

	describe("updateGoal", () => {
		it("should return 400 if goalId is invalid", async () => {
			req.params = { id: "invalid-id" };
			await GoalController.updateGoal(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ message: "Invalid Goal ID format" })).to.be
				.true;
		});

		it("should return 404 if goal is not found", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon.stub(GoalService, "updateGoalById").resolves(null);
			await GoalController.updateGoal(req as Request, res as Response);
			expect(statusStub.calledWith(404)).to.be.true;
			expect(jsonStub.calledWith({ error: "No Goal Found" })).to.be.true;
		});

		it("should return 200 if goal is updated", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			req.body = { name: "Updated Goal" };
			const updatedGoal = { name: "Updated Goal" };
			sinon.stub(GoalService, "updateGoalById").resolves(updatedGoal as any);
			await GoalController.updateGoal(req as Request, res as Response);
			expect(statusStub.calledWith(200)).to.be.true;
			expect(jsonStub.calledWith(updatedGoal)).to.be.true;
		});

		it("should return 400 if GoalService throws an error", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			req.body = { name: "Updated Goal" };
			sinon
				.stub(GoalService, "updateGoalById")
				.throws(new Error("Error updating Goal"));
			await GoalController.updateGoal(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "Error updating Goal" })).to.be.true;
		});
	});

	describe("deleteGoal", () => {
		it("should return 400 if goalId is invalid", async () => {
			req.params = { id: "invalid-id" };
			await GoalController.deleteGoal(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ message: "Invalid Goal ID format" })).to.be
				.true;
		});

		it("should return 404 if goal is not found", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon.stub(GoalService, "deleteGoalById").resolves(null);
			await GoalController.deleteGoal(req as Request, res as Response);
			expect(statusStub.calledWith(404)).to.be.true;
			expect(jsonStub.calledWith({ error: "No Goal Found" })).to.be.true;
		});

		it("should return 204 if goal is deleted", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon.stub(GoalService, "deleteGoalById").resolves(true);
			await GoalController.deleteGoal(req as Request, res as Response);
			expect(statusStub.calledWith(204)).to.be.true;
		});

		it("should return 400 if GoalService throws an error", async () => {
			req.params = { id: new mongoose.Types.ObjectId().toString() };
			req.userId = "123";
			sinon
				.stub(GoalService, "deleteGoalById")
				.throws(new Error("Error deleting Goal"));
			await GoalController.deleteGoal(req as Request, res as Response);
			expect(statusStub.calledWith(400)).to.be.true;
			expect(jsonStub.calledWith({ error: "Error deleting Goal" })).to.be.true;
		});
	});
});

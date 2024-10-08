import { expect } from "chai";
import sinon from "sinon";
import Goal from "../models/goal";
import GoalRepository from "../repositories/goalRepository";

describe("GoalRepository", () => {
	afterEach(() => {
		sinon.restore();
	});

	describe("create", () => {
		it("should create and return a goal", async () => {
			const goalData = { name: "Test Goal" };
			const teamId = "team-1";

			const mockGoal = {
				...goalData,
				teamId,
				createdAt: new Date(),
				userId: "user-1",
				goalInt: 5,
				interval: "weekly",
			};

			sinon.stub(Goal.prototype, "save").resolves(mockGoal);

			const result = await GoalRepository.create(goalData, teamId);
			expect(result).to.deep.equal(mockGoal);
		});

		it("should throw an error when goal creation fails", async () => {
			const goalData = { name: "Test Goal" };
			const teamId = "team-1";

			sinon.stub(Goal.prototype, "save").throws(new Error("Creation Error"));

			try {
				await GoalRepository.create(goalData, teamId);
			} catch (error: any) {
				expect(error.message).to.equal("Creation Error");
			}
		});
	});

	describe("findById", () => {
		it("should return a goal by id and teamId", async () => {
			const goalId = "goal-1";
			const teamId = "team-1";
			const mockGoal = { name: "Test Goal" };

			sinon.stub(Goal, "findOne").resolves(mockGoal);

			const result = await GoalRepository.findById(goalId, teamId);
			expect(result).to.deep.equal(mockGoal);
		});

		it("should return null if no goal is found", async () => {
			const goalId = "goal-1";
			const teamId = "team-1";

			sinon.stub(Goal, "findOne").resolves(null);

			const result = await GoalRepository.findById(goalId, teamId);
			expect(result).to.be.null;
		});
	});

	describe("findAll", () => {
		it("should return all goals for a team", async () => {
			const teamId = "team-1";
			const mockGoals = [{ name: "Test Goal 1" }, { name: "Test Goal 2" }];

			sinon.stub(Goal, "find").resolves(mockGoals);

			const result = await GoalRepository.findAll(teamId);
			expect(result).to.deep.equal(mockGoals);
		});

		it("should return undefined if no goals are found", async () => {
			const teamId = "team-1";

			sinon.stub(Goal, "find").resolves(undefined);

			const result = await GoalRepository.findAll(teamId);
			expect(result).to.be.undefined;
		});
	});

	describe("updateById", () => {
		it("should update and return a goal by id and teamId", async () => {
			const goalId = "goal-1";
			const teamId = "team-1";
			const updateData = { name: "Updated Goal" };
			const mockGoal = { name: "Updated Goal" };

			sinon.stub(Goal, "findByIdAndUpdate").resolves(mockGoal);

			const result = await GoalRepository.updateById(
				goalId,
				teamId,
				updateData,
			);
			expect(result).to.deep.equal(mockGoal);
		});

		it("should return undefined if no goal is found", async () => {
			const goalId = "goal-1";
			const teamId = "team-1";
			const updateData = { name: "Updated Goal" };

			sinon.stub(Goal, "findByIdAndUpdate").resolves(undefined);

			const result = await GoalRepository.updateById(
				goalId,
				teamId,
				updateData,
			);
			expect(result).to.be.undefined;
		});
	});

	describe("deleteById", () => {
		it("should delete a goal by id and teamId", async () => {
			const goalId = "goal-1";
			const teamId = "team-1";
			const mockDeleteResult = { acknowledged: true, deletedCount: 1 };

			sinon.stub(Goal, "deleteOne").resolves(mockDeleteResult);

			const result = await GoalRepository.deleteById(goalId, teamId);
			expect(result).to.be.true;
		});

		it("should return false if no goal is deleted", async () => {
			const goalId = "goal-1";
			const teamId = "team-1";
			const mockDeleteResult = { acknowledged: true, deletedCount: 0 };

			sinon.stub(Goal, "deleteOne").resolves(mockDeleteResult);

			const result = await GoalRepository.deleteById(goalId, teamId);
			expect(result).to.be.false;
		});
	});
});

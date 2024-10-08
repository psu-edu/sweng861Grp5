import { expect } from "chai";
import sinon from "sinon";
import CacheService from "../../../shared/utils/cacheService";
import MqConnection from "../../../shared/utils/rabbitmq";
import type { IGoal } from "../models/goal";
import GoalRepository from "../repositories/goalRepository";
import GoalService from "../services/goalService";

describe("GoalService", () => {
	let cacheStub: sinon.SinonStub;
	let repoCreateStub: sinon.SinonStub;
	let repoFindByIdStub: sinon.SinonStub;
	let repoFindAllStub: sinon.SinonStub;
	let repoUpdateByIdStub: sinon.SinonStub;
	let repoDeleteByIdStub: sinon.SinonStub;
	let mqSendStub: sinon.SinonStub;

	const userId = "test-user-id";
	const teamId = "test-team-id";
	const goalId = "test-goal-id";
	const goalData: Partial<IGoal> = {
		name: "Test Goal",
		goalInt: 10,
		teamId: teamId,
		userId: userId,
		interval: "weekly",
		createdAt: new Date(),
	};

	beforeEach(() => {
		cacheStub = sinon.stub(CacheService, "getTeamIdFromCache").resolves(teamId);
		repoCreateStub = sinon
			.stub(GoalRepository, "create")
			.resolves(goalData as IGoal);
		repoFindByIdStub = sinon
			.stub(GoalRepository, "findById")
			.resolves(goalData as IGoal);
		repoFindAllStub = sinon
			.stub(GoalRepository, "findAll")
			.resolves([goalData as IGoal]);
		repoUpdateByIdStub = sinon
			.stub(GoalRepository, "updateById")
			.resolves(goalData as IGoal);
		repoDeleteByIdStub = sinon
			.stub(GoalRepository, "deleteById")
			.resolves(true);
		mqSendStub = sinon.stub(MqConnection, "sendToQueue").resolves();
	});

	afterEach(() => {
		sinon.restore();
	});

	describe("createGoal", () => {
		it("should create a new goal and send a message to the queue", async () => {
			const result = await GoalService.createGoal(goalData, userId);

			expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
			expect(repoCreateStub.calledOnce).to.be.true;
			expect(
				mqSendStub.calledOnceWithExactly(
					`team-${teamId}-goal-queue`,
					sinon.match.object,
				),
			).to.be.true;
			expect(result).to.deep.equal(goalData);
		});
	});

	describe("getGoalById", () => {
		it("should retrieve a goal by ID", async () => {
			const result = await GoalService.getGoalById(goalId, userId);

			expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
			expect(repoFindByIdStub.calledOnceWithExactly(goalId, teamId)).to.be.true;
			expect(result).to.deep.equal(goalData);
		});
	});

	describe("getGoals", () => {
		it("should retrieve all goals for a user", async () => {
			const result = await GoalService.getGoals(userId);

			expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
			expect(repoFindAllStub.calledOnceWithExactly(teamId)).to.be.true;
			expect(result).to.deep.equal([goalData]);
		});
	});

	describe("updateGoalById", () => {
		it("should update a goal by ID and send a message to the queue", async () => {
			const updatedData: Partial<IGoal> = {
				...goalData,
				goalInt: 20,
				updatedAt: new Date(),
			};

			const result = await GoalService.updateGoalById(
				goalId,
				userId,
				updatedData,
			);

			expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
			expect(
				repoUpdateByIdStub.calledOnceWithExactly(
					goalId,
					teamId,
					sinon.match.object,
				),
			).to.be.true;
			expect(
				mqSendStub.calledOnceWithExactly(
					`team-${teamId}-goal-queue`,
					sinon.match.object,
				),
			).to.be.true;
			expect(result).to.deep.equal(goalData);
		});
	});

	describe("deleteGoalById", () => {
		it("should delete a goal by ID and send a message to the queue", async () => {
			const result = await GoalService.deleteGoalById(goalId, userId);

			expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
			expect(repoFindByIdStub.calledOnceWithExactly(goalId, teamId)).to.be.true;
			expect(repoDeleteByIdStub.calledOnceWithExactly(goalId, teamId)).to.be
				.true;
			expect(
				mqSendStub.calledOnceWithExactly(
					`team-${teamId}-goal-queue`,
					sinon.match.object,
				),
			).to.be.true;
			expect(result).to.be.true;
		});
	});
});

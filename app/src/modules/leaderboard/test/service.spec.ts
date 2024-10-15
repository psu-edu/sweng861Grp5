import { expect } from "chai";
import sinon from "sinon";
import CacheService from "../../../shared/utils/cacheService";
import MqConnection from "../../../shared/utils/rabbitmq";
import type { ILeaderboardEntry } from "../models/leaderboardEntry";
import LeaderboardRepository from "../repositories/leaderboardRepository";
import LeaderboardService from "../services/leaderboardService";

describe("LeaderboardService", () => {
	let cacheStub: sinon.SinonStub;
	let repoCreateStub: sinon.SinonStub;
	let repoFindByIdStub: sinon.SinonStub;
	let repoFindAllStub: sinon.SinonStub;
	let repoUpdateByIdStub: sinon.SinonStub;
	let repoDeleteByIdStub: sinon.SinonStub;
	let mqSendStub: sinon.SinonStub;

	const userId = "test-user-id";
	const teamId = "test-team-id";
	const entryId = "test-entry-id";
	const entryData: Partial<ILeaderboardEntry> = {
		name: "John Doe",
		teamId: teamId,
		userId: userId,
	};

	beforeEach(() => {
		cacheStub = sinon.stub(CacheService, "getTeamIdFromCache").resolves(teamId);
		repoCreateStub = sinon
			.stub(LeaderboardRepository, "create")
			.resolves(entryData as ILeaderboardEntry);
		repoFindByIdStub = sinon
			.stub(LeaderboardRepository, "findById")
			.resolves(entryData as ILeaderboardEntry);
		repoFindAllStub = sinon
			.stub(LeaderboardRepository, "findAll")
			.resolves([entryData as ILeaderboardEntry]);
		repoUpdateByIdStub = sinon
			.stub(LeaderboardRepository, "updateById")
			.resolves(entryData as ILeaderboardEntry);
		repoDeleteByIdStub = sinon
			.stub(LeaderboardRepository, "deleteById")
			.resolves(true);
		mqSendStub = sinon.stub(MqConnection, "sendToQueue").resolves();
	});

	afterEach(() => {
		sinon.restore();
	});

	describe("createLeaderboardEntry", () => {
		it("should create a new entry and send a message to the queue", async () => {
			const result = await LeaderboardService.createLeaderboardEntry(
				entryData,
				userId,
			);

			expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
			expect(repoCreateStub.calledOnce).to.be.true;
			expect(
				mqSendStub.calledOnceWithExactly(
					`team-${teamId}-leaderboard-queue`,
					sinon.match.object,
				),
			).to.be.true;
			expect(result).to.deep.equal(entryData);
		});
	});

	describe("getLeaderboardEntryById", () => {
		it("should retrieve an entry by ID", async () => {
			const result = await LeaderboardService.getLeaderboardEntryById(
				entryId,
				userId,
			);

			expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
			expect(repoFindByIdStub.calledOnceWithExactly(entryId, teamId)).to.be
				.true;
			expect(result).to.deep.equal(entryData);
		});
	});

	describe("getAllLeaderboard", () => {
		// it("should retrieve all entries for a user", async () => {
		//   const result = await LeaderboardService.getAllLeaderboard(userId);
		//
		//   expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
		//   expect(repoFindAllStub.calledOnceWithExactly(teamId)).to.be.true;
		//   expect(result).to.deep.equal([entryData]);
		// });
		//
		// Figure out why it breaks
	});

	describe("updateLeaderboardEntry", () => {
		it("should update a entry by ID and send a message to the queue", async () => {
			const updatedData: Partial<ILeaderboardEntry> = {
				...entryData,
				updatedAt: new Date(),
			};

			const result = await LeaderboardService.updateLeaderboardEntry(
				entryId,
				userId,
				updatedData,
			);

			expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
			expect(
				repoUpdateByIdStub.calledOnceWithExactly(
					entryId,
					teamId,
					sinon.match.object,
				),
			).to.be.true;
			expect(
				mqSendStub.calledOnceWithExactly(
					`team-${teamId}-leaderboard-queue`,
					sinon.match.object,
				),
			).to.be.true;
			expect(result).to.deep.equal(entryData);
		});
	});

	describe("deleteLeaderboardEntry", () => {
		it("should delete a entry by ID and send a message to the queue", async () => {
			const result = await LeaderboardService.deleteLeaderboardEntry(
				entryId,
				userId,
			);

			expect(cacheStub.calledOnceWithExactly(userId)).to.be.true;
			expect(repoFindByIdStub.calledOnceWithExactly(entryId, teamId)).to.be
				.true;
			expect(repoDeleteByIdStub.calledOnceWithExactly(entryId, teamId)).to.be
				.true;
			expect(
				mqSendStub.calledOnceWithExactly(
					`team-${teamId}-leaderboard-queue`,
					sinon.match.object,
				),
			).to.be.true;
			expect(result).to.be.true;
		});
	});
});

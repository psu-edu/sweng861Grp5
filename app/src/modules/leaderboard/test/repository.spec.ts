import { expect } from "chai";
import sinon from "sinon";
import LeaderboardEntry from "../models/leaderboardEntry";
import LeaderboardRepository from "../repositories/leaderboardRepository";

describe("LeaderboardRepository", () => {
	afterEach(() => {
		sinon.restore();
	});

	describe("create", () => {
		it("should create and return a leaderboard entry", async () => {
			const entryData = { name: "John Doe" };
			const teamId = "team-1";

			const mockEntry = {
				...entryData,
				teamId,
				date: new Date(),
				userId: "user-1",
				score: 5,
			};

			sinon.stub(LeaderboardEntry.prototype, "save").resolves(mockEntry);

			const result = await LeaderboardRepository.create(entryData, teamId);
			expect(result).to.deep.equal(mockEntry);
		});

		it("should throw an error when entry creation fails", async () => {
			const entryData = { name: "John Doe" };
			const teamId = "team-1";

			sinon.stub(LeaderboardEntry.prototype, "save").throws(new Error("Creation Error"));

			try {
				await LeaderboardRepository.create(entryData, teamId);
			} catch (error: any) {
				expect(error.message).to.equal("Creation Error");
			}
		});
	});

	describe("findById", () => {
		it("should return a entry by id and teamId", async () => {
			const userId = "user-1";
			const teamId = "team-1";
			const mockEntry = { name: "John Doe" };

			sinon.stub(LeaderboardEntry, "findOne").resolves(mockEntry);

			const result = await LeaderboardRepository.findById(userId, teamId);
			expect(result).to.deep.equal(mockEntry);
		});

		it("should return null if no entry is found", async () => {
			const userId = "user-1";
			const teamId = "team-1";

			sinon.stub(LeaderboardEntry, "findOne").resolves(null);

			const result = await LeaderboardRepository.findById(userId, teamId);
			expect(result).to.be.null;
		});
	});

	describe("findAll", () => {
		it("should return all entries for a team", async () => {
			const teamId = "team-1";
			const mockEntries = [{ name: "John Doe" }, { name: "Jane Done" }];

			sinon.stub(LeaderboardEntry, "find").resolves(mockEntries);

			const result = await LeaderboardRepository.findAll(teamId);
			expect(result).to.deep.equal(mockEntries);
		});

		it("should return undefined if no entries are found", async () => {
			const teamId = "team-1";

			sinon.stub(LeaderboardEntry, "find").resolves(undefined);

			const result = await LeaderboardRepository.findAll(teamId);
			expect(result).to.be.undefined;
		});
	});

	describe("updateById", () => {
		it("should update and return a entry by id and teamId", async () => {
			const userId = "user-1";
			const teamId = "team-1";
			const updateData = { name: "Updated Entry" };
			const mockEntry = { name: "Updated Entry" };

			sinon.stub(LeaderboardEntry, "findByIdAndUpdate").resolves(mockEntry);

			const result = await LeaderboardRepository.updateById(
				userId,
				teamId,
				updateData,
			);
			expect(result).to.deep.equal(mockEntry);
		});

		it("should return undefined if no entry is found", async () => {
			const userId = "user-1";
			const teamId = "team-1";
			const updateData = { name: "John Doe" };

			sinon.stub(LeaderboardEntry, "findByIdAndUpdate").resolves(undefined);

			const result = await LeaderboardRepository.updateById(
				userId,
				teamId,
				updateData,
			);
			expect(result).to.be.undefined;
		});
	});

	describe("deleteById", () => {
		it("should delete a entry by id and teamId", async () => {
			const userId = "user-1";
			const teamId = "team-1";
			const mockDeleteResult = { acknowledged: true, deletedCount: 1 };

			sinon.stub(LeaderboardEntry, "deleteOne").resolves(mockDeleteResult);

			const result = await LeaderboardRepository.deleteById(userId, teamId);
			expect(result).to.be.true;
		});

		it("should return false if no entry is deleted", async () => {
			const userId = "user- 1";
			const teamId = "team-1";
			const mockDeleteResult = { acknowledged: true, deletedCount: 0 };

			sinon.stub(LeaderboardEntry, "deleteOne").resolves(mockDeleteResult);

			const result = await LeaderboardRepository.deleteById(userId, teamId);
			expect(result).to.be.false;
		});
	});
});

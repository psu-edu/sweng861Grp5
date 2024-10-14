export enum QUEUES {
	USER = "user_queue",
	VITAL_USER = "vital_user_queue",
	LEADERBOARD = "leaderboard_queue",
	GOALS = "goals_queue",
	GROUPS = "groups_queue",
}

export enum EVENTS {
	LOGIN = "UserLoggedIn",
	USER_CREATED = "UserCreated",
	USER_UPDATED = "UserUpdated",
	VITAL_USER = "VitalUserCreated",
	VITAL_PROVIDER = "VitalProviderConnected",
	TEAM_CHANGE = "UserTeamChanged",
	GOAL_CREATED = "GoalCreated",
	GOAL_UPDATED = "GoalUpdated",
	GOAL_DELETED = "GoalDeleted",
}

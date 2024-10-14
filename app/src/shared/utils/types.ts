import type { EVENTS } from "./enums";

export interface QueueMessage {
	event: EVENTS;
	data: {};
}

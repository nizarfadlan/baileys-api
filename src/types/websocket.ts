export type EventsType =
	| "qrcode.updated"
	| "connection.update"
	| "messaging-history.set"
	| "messages.upsert"
	| "messages.update"
	| "messages.delete"
	| "message-receipt.update"
	| "messages.reaction"
	| "send.message"
	| "contacts.set"
	| "contacts.upsert"
	| "contacts.update"
	| "presence.update"
	| "chats.set"
	| "chats.update"
	| "chats.upsert"
	| "chats.delete"
	| "groups.upsert"
	| "groups.update"
	| "group-participants.update"
	| "call.upsert";

export class WebhookEvents {
	qrcodeUpdated?: boolean;
	messagesHistorySet?: boolean;
	messagesUpsert?: boolean;
	messagesUpdated?: boolean;
	messagesDelete?: boolean;
	messageReceiptUpdated?: boolean;
	messagesReaction?: boolean;
	sendMessage?: boolean;
	contactsSet?: boolean;
	contactsUpsert?: boolean;
	contactsUpdated?: boolean;
	chatsSet?: boolean;
	chatsUpsert?: boolean;
	chatsUpdated?: boolean;
	chatsDeleted?: boolean;
	presenceUpdated?: boolean;
	groupsUpsert?: boolean;
	groupsUpdated?: boolean;
	groupsParticipantsUpdated?: boolean;
	connectionUpdated?: boolean;
	callUpsert?: boolean;
}

export const WebhookEventsEnum: Record<keyof WebhookEvents, EventsType> = {
	qrcodeUpdated: "qrcode.updated",
	messagesHistorySet: "messaging-history.set",
	messagesUpsert: "messages.upsert",
	messagesUpdated: "messages.update",
	messagesDelete: "messages.delete",
	messageReceiptUpdated: "message-receipt.update",
	messagesReaction: "messages.reaction",
	sendMessage: "send.message",
	contactsSet: "contacts.set",
	contactsUpsert: "contacts.upsert",
	contactsUpdated: "contacts.update",
	chatsSet: "chats.set",
	chatsUpsert: "chats.upsert",
	chatsUpdated: "chats.update",
	chatsDeleted: "chats.delete",
	presenceUpdated: "presence.update",
	groupsUpsert: "groups.upsert",
	groupsUpdated: "groups.update",
	groupsParticipantsUpdated: "group-participants.update",
	connectionUpdated: "connection.update",
	callUpsert: "call.upsert",
};

export type WebhookEventsMap = typeof WebhookEventsEnum;

export const ListEvents: EventsType[] = Object.values(WebhookEventsEnum);

export type WebhookEventsType = keyof WebhookEvents;

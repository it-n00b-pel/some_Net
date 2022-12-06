import {MessageType, StatusType} from '../store/reducers/messagesReducer';

let subscribers = {
    'messages-received': [] as MessagesReceivedSubscriberType[],
    'status-changed': [] as StatusChangedSubscriberType[],
};

let ws: WebSocket | null = null;

const cleanUp = () => {
    ws?.removeEventListener('close', closeHandler);
    ws?.removeEventListener('message', messageHandler);
    ws?.removeEventListener('open', openHandler);
    ws?.removeEventListener('error', errorHandler);
};

const notifySubscribersAboutStatus = (status: StatusType) => {
    subscribers['status-changed'].forEach(s => s(status));
};

const openHandler = () => {
    subscribers['status-changed'].forEach(s => s('ready'));
};

const errorHandler = () => {
    subscribers['status-changed'].forEach(s => s('error'));
    console.log('RESTART PAGE');
};

const createChanel = () => {
    cleanUp();
    ws?.close();
    ws = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');
    notifySubscribersAboutStatus('pending');
    ws.addEventListener('close', closeHandler);
    ws.addEventListener('message', messageHandler);
    ws.addEventListener('open', openHandler);
    ws.addEventListener('error', errorHandler);
};

const closeHandler = () => {
    notifySubscribersAboutStatus('pending');
    setTimeout(createChanel, 3000);
};

const messageHandler = (e: MessageEvent) => {
    const newMessages = JSON.parse(e.data);
    subscribers['messages-received'].forEach(s => s(newMessages));
};





export const chatAPI = {
    start() {
        createChanel();
    },
    subscribe(eventName: EventsNamesType, callback: MessagesReceivedSubscriberType | StatusChangedSubscriberType) {
        // @ts-ignore
        subscribers[eventName].push(callback);
        return () => {
            // @ts-ignore
            subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
        };
    },
    unsubscribe(eventName: EventsNamesType, callback: MessagesReceivedSubscriberType | StatusChangedSubscriberType) {
        // @ts-ignore
        subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
    },
    sendMessage(message: string) {
        ws?.send(message);
    },
    stop() {
        subscribers['messages-received'] = [];
        subscribers['status-changed'] = [];
        cleanUp();
        ws?.close();
    },
};

type MessagesReceivedSubscriberType = (messages: MessageType[]) => void
type StatusChangedSubscriberType = (status: StatusType) => void
type EventsNamesType = 'messages-received' | 'status-changed'


import {MessageType} from '../store/reducers/messagesReducer';

let subscribers = [] as SubscriberType[];

let ws: WebSocket | null = null;

const createChanel = () => {
    ws?.removeEventListener('close', closeHandler);
    ws?.close();
    ws = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');
    ws.addEventListener('close', closeHandler);
    ws.addEventListener('message', messageHandler);
};

const closeHandler = () => {
    console.log('CLOSE WS');
    setTimeout(createChanel, 3000);
};

const messageHandler = (e: MessageEvent) => {
    const newMessages = JSON.parse(e.data);
    subscribers.forEach(s => s(newMessages));
};

export const chatAPI = {
    start() {
        createChanel();
    },
    subscribe(callback: SubscriberType) {
        subscribers.push(callback);
        return () => {
            subscribers = subscribers.filter(s => s !== callback);
        };
    },
    unsubscribe(callback: SubscriberType) {
        subscribers = subscribers.filter(s => s !== callback);
    },
    sendMessage(message: string) {
        ws?.send(message);
    },
    stop() {
        subscribers = [];
        ws?.removeEventListener('close', closeHandler);
        ws?.removeEventListener('message', messageHandler);
        ws?.close();
    },
};

type SubscriberType = (messages: MessageType[]) => void


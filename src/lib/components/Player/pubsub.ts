type EventRecordCallback = (opts: { id: string; off: PubSub['off']; data?: any }) => void;

type EventRecordItem = {
	id: string;
	callback: EventRecordCallback;
};

type EventRecord = Record<string, EventRecordItem[]>;

export class PubSub {
	#events: EventRecord = {};

	idTracker = 0;

	on(evtName: string, callback: EventRecordCallback) {
		if (!(evtName in this.#events)) {
			this.#events[evtName] = [];
		}

		const id = this.idTracker.toString();

		this.#events[evtName].push({
			id,
			callback
		});

		return () => this.off(evtName, id);
	}

	off(evtName: string, id?: string) {
		if (!id) {
			delete this.#events[evtName];
			return;
		}

		this.#events[evtName].splice(
			this.#events[evtName].findIndex((item) => item.id === id),
			1
		);
	}

	fire(evtName: string, data?: any) {
		if (!(evtName in this.#events)) {
			return;
		}

		this.#events[evtName].forEach(({ id, callback }) => {
			callback({ id, off: () => this.off(evtName, id), data });
		});
	}
}

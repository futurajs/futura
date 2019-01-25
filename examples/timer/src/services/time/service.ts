import { Dispatch, Service, util } from "@futura/core";
import eq from "fast-deep-equal";

const { EqMap, EqSet } = util.collections;

export class Time implements Service<TimeReq, TimeSub> {
  private readonly dispatch: Dispatch<any>;
  private everySubs: util.collections.EqMap<EverySub, any>;

  constructor(dispatch: Dispatch<any>) {
    this.dispatch = dispatch;
    this.everySubs = new EqMap(eq);
  }

  public handleRequest(cmd: TimeReq) {
    switch (cmd.type) {
      case "after":
        setTimeout(() => this.dispatch(new cmd.Message(...cmd.params)), cmd.time);
        break;
    }
  }

  public updateSubscriptions(subs: ReadonlyArray<TimeSub>) {
    const everySubs = new EqSet(eq, subs.filter((sub) => sub.type === "every"));

    // Find removed subscriptions
    this.everySubs.entries().forEach(([oldSub, emitter]) => {
      if (!everySubs.has(oldSub)) {
        clearInterval(emitter);
        this.everySubs.delete(oldSub);
        console.log ("Cleared old subscription");
      }
    });

    // Find new subscriptions
    everySubs.values().forEach(newSub => {
      if (!this.everySubs.has(newSub)) {
        const { time, Message, params } = newSub;

        const emitter = setInterval(() => {
          this.dispatch(new Message(...params));
        }, time);

        this.everySubs.set(newSub, emitter);

        console.log ("Created new subscription");
      }
    });
  }
}

// Requests

type TimeReq = AfterReq<any>;

export interface AfterReq<Args extends any[] = any[]> {
  type: "after";
  time: number;
  Message: AfterReqMessage<any, Args>;
  params: Args;
}

export interface AfterReqMessage<Message, Args extends any[]> {
  new(...params: Args): Message;
}

// Subscriptions

type TimeSub = EverySub<any>;

export interface EverySub<Args extends any[] = any[]> {
  type: "every";
  time: number;
  Message: EverySubMessage<any, Args>;
  params: Args;
}

export interface EverySubMessage<Message, Args extends any[]> {
  new(...params: Args): Message;
}

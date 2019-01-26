import { Dispatch, Service, util } from "@futura/core";

import Subscriptions = util.services.Subscriptions;


export class Time implements Service<TimeReq, TimeSub> {
  private readonly dispatch: Dispatch<any>;
  private everySubs: Subscriptions<EverySub>;

  constructor(dispatch: Dispatch<any>) {
    this.dispatch = dispatch;
    this.everySubs = new Subscriptions(this.onEverySubAdded, this.onEverySubRemoved);
  }

  public handleRequest(cmd: TimeReq) {
    switch (cmd.type) {
      case "after":
        setTimeout(() => this.dispatch(new cmd.Message(...cmd.params)), cmd.time);
        break;
    }
  }

  public updateSubscriptions(subs: ReadonlyArray<TimeSub>) {
    this.everySubs.update(subs.filter((sub) => sub.type === "every"));
  }

  // EverySub
  private onEverySubAdded = (sub: EverySub) => {
    const { time, Message, params } = sub;

    return setInterval(() => {
      this.dispatch(new Message(...params));
    }, time);
  }

  private onEverySubRemoved = (_sub: EverySub, state: any) => {
    clearInterval(state);
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

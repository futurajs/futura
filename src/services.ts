import { Dispatch } from "./program";


export class Services<Message> {
  private readonly dispatch: Dispatch<Message>;
  private readonly services: Array<Service<any, any>>;
  private readonly env: Record<string, any>;

  constructor(dispatch: Dispatch<Message>, env: Record<string, any>) {
    this.dispatch = dispatch;
    this.services = [];
    this.env = env;
  }

  public handleRequests(requests: ReadonlyArray<Req<Message, any>>) {
    for (const request of requests) {
      const service = this.service(request.service);
      service.handleRequest(request.request);
    }
  }

  public updateSubscriptions(subscriptions: ReadonlyArray<Sub<Message, any>>) {
    // Ensure all services are setup
    for (const subscription of subscriptions) {
      this.service(subscription.service);
    }

    // For each service update their subscriptions
    for (const service of this.services) {
      service.updateSubscriptions(subscriptions
        .filter((subscription) => subscription.service === service.constructor)
        .map((subscription) => subscription.subscription));
    }
  }

  private service<R, S>(Type: ServiceClass<Message, R, S>): Service<R, S> {
    for (const s of this.services) {
      if (s.constructor === Type) {
        return s;
      }
    }

    const env = Type.id !== undefined ? this.env[Type.id] : {};
    const service = new Type(this.dispatch, env);
    this.services.push(service);
    return service;
  }
}


/** Types */

export interface Service<ServiceReq, ServiceSub> {
  handleRequest(request: ServiceReq): void;
  updateSubscriptions(subscriptions: ReadonlyArray<ServiceSub>): void;
}

export interface Req<Message = any, ServiceReq = any> {
  service: ServiceClass<Message, ServiceReq, any>;
  request: ServiceReq;
}

export interface Sub<Message = any, ServiceSub = any> {
  service: ServiceClass<Message, any, ServiceSub>;
  subscription: ServiceSub;
}

export interface ServiceClass<Message, ServiceReq, ServiceSub> {
  readonly id?: string;
  new(dispatch: Dispatch<Message>, env: any): Service<ServiceReq, ServiceSub>;
}

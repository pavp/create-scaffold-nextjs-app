// Event names we make available to track in mixpanel
export enum Events {
  Login = 'Login',
  NavigationGlobalViewToWorkshopWorkload = 'NavigationGlobalViewToWorkshopWorkload',
  AppointmentCreated = 'AppointmentCreated',
  AbsenceCreated = 'AbsenceCreated',
  CustomerSearch = 'CustomerSearch',
  VehicleSearch = 'VehicleSearch',
  AssignmentAssigned = 'AssignmentAssigned',
}

export type UserData = {
  customUserId?: string;
  appName: string;
  id: string;
  username: string;
};

export type CustomData = {
  customData: any;
};

export interface AnalyticsInterface {
  init(apiKey: string): void;
  identifyUser(data: UserData): any;
  trackEvent(eventName: keyof typeof Events, data?: CustomData): any;
  reset(): void;
}

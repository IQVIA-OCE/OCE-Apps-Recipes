export const MEETING_STATUS = {
  Draft: 'Draft',
  PendingApproval: 'PendingApproval',
  Approved: 'Approved',
  Execute: 'Execute',
  Concluded: 'Concluded',
  Closed: 'Closed',
  Cancelled: 'Cancelled',
};

export const MEETING_STATE = {
  NotStarted: 'not-started',
  InProgress: 'in-progress',
  Ended: 'ended',
  Conflicting: 'conflicting',
};

export const PRE_MEETING_STATUSES = [MEETING_STATUS.Draft, MEETING_STATUS.PendingApproval, MEETING_STATUS.Approved];

export const POST_MEETING_STATUSES = [MEETING_STATUS.Concluded, MEETING_STATUS.Closed];

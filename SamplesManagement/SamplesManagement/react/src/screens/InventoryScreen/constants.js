export const DATE_TIME_FORMAT = 'MMM D, YYYY h:mm A';
export const DATE_TIME_FORMAT_WITH_SECONDS = 'MMM D, YYYY h:mm:ss A';
export const DATE_FORMAT = 'MMM D, YYYY';
export const INVENTORY_STATUS = {
  inProgress: 'In Progress',
  saved: 'Saved',
  submitted: 'Submitted',
};

export const BANNER_CONFIG = {
  inProgress: {
    variant: 'success',
    message: 'In Progress. Saved Successfully',
    visible: true,
    icon: 'checkbox-marked-circle',
  },
  saved: {
    variant: 'warning',
    message: 'Saved. Need reason for discrepancies',
    visible: true,
    icon: 'alert',
  },
  submitted: {
    variant: 'success',
    message: 'Submitted Successfully',
    visible: true,
    icon: 'checkbox-marked-circle',
  },
};

export const REASON_LIST = [
  { label: 'Theft/Loss', id: 'Theft/Loss' },
  { label: 'Damaged', id: 'Damaged' },
  { label: 'Disbursement Error', id: 'Disbursement Error' },
  { label: 'Other', id: 'Other' },
];

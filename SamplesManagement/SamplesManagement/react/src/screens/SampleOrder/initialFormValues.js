import { environment } from '../../../bridge/EnvironmentData/EnvironmentData.native';

const initialFormValues = {
    isUrgent: false,
    comments: '',
    status: 'In Progress',
    territory: environment.territory(),
    user: null,
    shipTo: null,
}

export default initialFormValues;
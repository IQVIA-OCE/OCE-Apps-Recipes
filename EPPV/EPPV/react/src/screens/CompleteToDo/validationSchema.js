import * as Yup from 'yup';
import { DateTime } from 'luxon';

export const ToDoValidationSchema = Yup.object().shape({
    surveyType: Yup.object({
      label: Yup.string().required('Field is required'),
      value: Yup.string().required('Field is required'),
    })
      .required('Field is required')
      .nullable(),
    interviewee: Yup.object({
      label: Yup.string(),
      value: Yup.string(),
    }).nullable(),
    otherInterviewee: Yup.string().nullable(),
    completionDate: Yup.date()
      .nullable()
      .max(
        DateTime.now().plus({ days: 1 }).toJSDate(),
        'Completion Date cannot be later than today'
      )
      .test({
        name: 'min',
        exclusive: false,
        params: { },
        message: 'Completion Date cannot be earlier than Cycle Start Date',
        test: (value, context) => {
          return value > new Date(context.parent.cycleStartdate)
        },
      })
      .required('Field is required'),
  });
  
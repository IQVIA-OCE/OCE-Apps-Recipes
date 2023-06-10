import { Select } from 'apollo-react-native';
import { useEffect, useState } from 'react';
import { fetchSurveyTypes } from '../../api/callToDoApi';
import { useFormikContext } from 'formik';

export const SurveyTypeSelect = ({ value, initialValue, onChange, error, onFetchError, helperText }) => {
  const [surveyTypeOptions, setSurveyTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    getSurveyTypes();
  }, []);

  const getSurveyTypes = async () => {
    try {
      setIsLoading(true);

      const surveyTypes = await fetchSurveyTypes();

      setSurveyTypeOptions(surveyTypes);
      const selectedOption = surveyTypes.find((v) => v.value === initialValue);
      if (selectedOption) setFieldValue('surveyType', selectedOption);
    } catch (error) {
      console.log(error);
      onFetchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      fullWidth
      label="Survey Type"
      required
      options={surveyTypeOptions}
      onChange={onChange}
      value={value}
      error={error}
      helperText={helperText}
      disabled={isLoading}
      placeholder="Select"
      hideDropdownPlaceholder
      testID="surveyTypeSelect"
    />
  );
};

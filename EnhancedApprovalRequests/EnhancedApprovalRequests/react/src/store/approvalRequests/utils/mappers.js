export const mapApprovalRequests = (requests, objectMetadataMap) => {
  return requests.map(request => ({
    id: request.Id,
    targetObjectId: request.TargetObjectId,
    name: request.TargetObject.Name,
    type: request.TargetObject.Type,
    submittedBy: request.SubmittedBy.Name,
    comment: request.Steps.records[0]?.Comments ?? '',
    status: request.Status,
    createdDate: request.CreatedDate,
    label: objectMetadataMap[request.TargetObject.Type].label,
  }));
};

export const UI_TO_SOQL_FIELD_NAMES_MAP = {
  targetObjectId: 'TargetObjectId',
  name: 'TargetObject.Name',
  label: 'TargetObject.Type',
  submittedBy: 'SubmittedBy.Name',
  createdDate: 'CreatedDate',
};

export const mapObjectMetadata = arr => {
  return arr.reduce((acc, cur) => {
    acc[cur.name] = {
      label: cur.label,
    };
    return acc;
  }, {});
};

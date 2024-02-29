import { selectAccountData, selectActivityData } from "./dataSelectors";
import { testDataForSelect } from "./testData";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

export const selectedAccountData = [
  {
    accountName: "BRIAN PAT __OLOFSSON",
    accountSpecialty: "Family medicine",
    errorMessage: "The limit for rule \"Mature Product Samples per Call Limit\" in the template \"Italy Class A\" was exceeded in this Call",
    id: "a5EO00000006PbJMAU",
    limitJsonTemplate: "",
    limitTemplateName: "ItalyClassA",
    sampleId: "a4sO00000000sa0IAA",
    sampleName: "Bleomycin 500 MG",
    sampleQuantity: "",
  }
];

export const selectedActivityData = [
  {
    callDateTime: "Jan 19, 2022",
    callLocation: "KANKAKEE",
    callName: "C-00000010",
    callStatus: "Submitted",
    callTerritory: "TM - SPC - Aurora 20A02T06",
    sampleName: "Bleomycin 500 MG",
    sampleDTPProduct: "Y",
    samplePhysicalDrop: false,
    sampleQuantity: 16,
    signatureDate: null,
    submittedDate: "Jan 19, 2022",
  }
];

describe('dateSelectors', () => {
  it('return selectAccountData', () => {
    expect(selectAccountData(testDataForSelect)).toStrictEqual(selectedAccountData);
  });

  it('return selectActivityData', () => {
    expect(selectActivityData(testDataForSelect)).toStrictEqual(selectedActivityData);
  });
});

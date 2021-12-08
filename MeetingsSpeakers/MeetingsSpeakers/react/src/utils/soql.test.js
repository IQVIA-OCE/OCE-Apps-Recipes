import SOQL from './soql';

describe('Query generator', () => {
  it('should generate simple query', () => {
    const query = new SOQL('Account').build();
    expect(query).toBe(`SELECT Id FROM Account`);
  });

  it('should add fields', () => {
    const query = new SOQL('Account')
      .select(['Id', 'Name', 'BillingCountry'])
      .select(['Id', 'BillingState'])
      .build();
    expect(query).toBe(
      `SELECT Id, Name, BillingCountry, BillingState FROM Account`
    );
  });

  it('should add limit', () => {
    const query = new SOQL('Account').limit(10).build();
    expect(query).toBe(`SELECT Id FROM Account LIMIT 10`);
  });

  it('should add where condition', () => {
    const query = new SOQL('Account')
      .where('Id', '=', '001E000001KnMkTIAV')
      .build();
    expect(query).toBe(
      `SELECT Id FROM Account WHERE Id = '001E000001KnMkTIAV'`
    );
  });
});

export default class SOQL {
  fromText;
  fieldList;
  numberOfRows;
  conditions;
  numberOfRowsToSkip;

  constructor(sobject) {
    this.fromText = sobject;
    this.fieldList = new Set();
    this.conditions = [];
  }

  select = fields => {
    this.fieldList = new Set([...this.fieldList, ...fields]);
    return this;
  };

  limit = limit => {
    this.numberOfRows = limit;
    return this;
  };

  offset = offset => {
    this.numberOfRowsToSkip = offset;
    return this;
  };

  where = (field, operator, value) => {
    this.conditions.push({
      field,
      operator,
      value,
    });
    return this;
  };

  buildSelect = () => {
    if (this.fieldList.size !== 0) {
      return 'SELECT ' + Array.from(this.fieldList).join(', ');
    } else {
      return 'SELECT Id';
    }
  };

  buildConditions = () => {
    const condList = [];

    this.conditions.forEach(({ field, operator, value }) => {
      condList.push(`${field} ${operator} '${value}'`);
    });

    if (this.conditions.length !== 0) {
      return 'WHERE ' + condList.join(' AND ');
    } else {
      return '';
    }
  };

  build = () => {
    const queryParts = [];

    queryParts.push(this.buildSelect());
    queryParts.push('FROM ' + this.fromText);

    if (this.conditions.length !== 0) {
      queryParts.push(this.buildConditions());
    }

    if (this.numberOfRows) {
      queryParts.push('LIMIT ' + this.numberOfRows);
    }

    if (typeof this.numberOfRowsToSkip === 'number') {
      queryParts.push('OFFSET ' + this.numberOfRowsToSkip);
    }

    return queryParts.join(' ');
  };
}

import * as dynamoose from 'dynamoose';

export const tableName = process.env.DB_TABLE_CONFIGURATION;
export const hashKey = Symbol('category');
export const rangeKey = Symbol('keyRange');
export const fields = {
  key: hashKey,
  range: rangeKey,
  value: Symbol('value'),
};
export type fields = {
  key: string,
  range: string,
  value: object,
};
export type key = {
  [hashKey]: string,
  [rangeKey]: string,
};

const schemaFields = {
  [hashKey]: {
    type: String,
    required: true,
    hashKey: true,
  },

  [rangeKey]: {
    type: String,
    required: true,
    rangeKey: true,
  },

  [fields.value]: {
    type: String,
    required: true,
  },
};

const schemaOptions = {
  timestamps: true,
};

const configurationSchema = new dynamoose.Schema(schemaFields, schemaOptions);

configurationSchema.static('getValue', async function getValue(key, range) {
  const configurationItem = await this.get({ [hashKey]: key, [rangeKey]: range });

  if (!configurationItem) {
    return undefined;
  }

  return configurationItem[fields.value];
});

interface ConfigurationModel<DataSchema, KeySchema> extends dynamoose.ModelConstructor<DataSchema, KeySchema> {
  getValue: (key: string, range: string) => Promise<object>;
}

export default dynamoose.model(tableName, configurationSchema) as ConfigurationModel<fields, key>;

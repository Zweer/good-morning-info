import * as dynamoose from 'dynamoose';

export const tableName = process.env.DB_TABLE_CONFIGURATION;
export const fields = {
  key: 'key',
  value: 'value',
};
export type fields = {
  key: string,
  value: object,
};
export const hashKey = fields.key;
export type key = string;

const schemaFields = {
  [hashKey]: {
    type: String,
    required: true,
    hashKey: true,
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

configurationSchema.static('getValue', async function getValue(key) {
  const configurationItem = await this.get({ [hashKey]: key });

  if (!configurationItem) {
    return undefined;
  }

  return configurationItem[fields.value];
});

interface ConfigurationModel<DataSchema, KeySchema> extends dynamoose.ModelConstructor<DataSchema, KeySchema> {
  getValue: (key: string) => Promise<object>;
}

export default dynamoose.model(tableName, configurationSchema) as ConfigurationModel<fields, key>;

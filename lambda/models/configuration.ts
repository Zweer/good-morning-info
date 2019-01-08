import { Schema, model } from 'dynamoose';

export const tableName = process.env.TABLE_CONFIGURATION;
export const fields = {
  key: 'key',
  value: 'value',
};
export const hashKey = fields.key;

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

const configurationSchema = new Schema(schemaFields, schemaOptions);

configurationSchema.static('getValue', async function getValue(key) {
  const configurationItem = await this.get({ [hashKey]: key });

  if (!configurationItem) {
    return undefined;
  }

  return configurationItem[fields.value];
});

export default model(tableName, configurationSchema);

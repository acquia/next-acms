import { expect } from '@jest/globals';
import { DrupalClient } from 'next-drupal';
import { testApiCompatibility } from '../src/test-api-compatibility';

const createMockClient = (contentTypes: Array<string>) => {
  const links = {};
  contentTypes.forEach((contentType) => {
    links[contentType] = { href: `http://🐈/jsonapi/${contentType}` };
  });

  return jest
    .spyOn(DrupalClient.prototype, 'getIndex')
    .mockImplementation(() => {
      return Promise.resolve({
        jsonapi: {
          version: '1.0',
          meta: [],
        },
        meta: {
          count: 0,
        },
        data: [],
        errors: [],
        links: links,
      });
    });
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('testApiCompatibility', () => {
  test('it should not throw for identical data model', async () => {
    const contentTypes = ['node--test'];
    createMockClient(contentTypes);
    const client = new DrupalClient('http://🐈');
    await testApiCompatibility(contentTypes, client);
    expect(client.getIndex).toBeCalledTimes(1);
  });

  test('it should throw for invalid data model', async () => {
    createMockClient([]);
    const client = new DrupalClient('http://🐈');
    await expect(
      async () => await testApiCompatibility(['node--test'], client),
    ).rejects.toThrow('Content type node--test does not exist in the backend.');
    expect(client.getIndex).toBeCalledTimes(1);
  });

  test('it should not throw for content type not supported by client', async () => {
    createMockClient(['node--test', 'node--cats']);
    const client = new DrupalClient('http://🐈');
    await testApiCompatibility(['node--test'], client);
    expect(client.getIndex).toBeCalledTimes(1);
  });

  test('it should throw for failed fetch', async () => {
    jest.spyOn(DrupalClient.prototype, 'getIndex').mockImplementation(() => {
      throw new Error('Failed for testing purposes.');
    });
    const client = new DrupalClient('http://🐈');
    await expect(
      async () => await testApiCompatibility([], client),
    ).rejects.toThrow('Failed to connect to the backend.');
    expect(client.getIndex).toBeCalledTimes(1);
  });

  test('it should not throw with zero content types', async () => {
    createMockClient([]);
    const client = new DrupalClient('http://🐈');
    await testApiCompatibility([], client);
    expect(client.getIndex).toBeCalledTimes(1);
  });
});

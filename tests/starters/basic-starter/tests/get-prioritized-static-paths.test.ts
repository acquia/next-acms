import { expect } from '@jest/globals';
import { DrupalClient } from 'next-drupal';
import { getPrioritizedStaticPathsFromContext } from 'next-acms-basic-starter/lib/get-prioritized-static-paths';

const context = { locales: null, defaultLocale: null };

const ENTITY_TYPES = ['node--article', 'node--place'];

afterEach(() => {
  jest.restoreAllMocks();
});
const client = new DrupalClient('http://🐈');

const pathsFromContext = [
  { params: { slug: [''] } },
  { params: { slug: ['article', '1'] } },
  { params: { slug: ['article', '2'] } },
  { params: { slug: ['article', '3'] } },
  { params: { slug: ['place', 'boston', 'south', '1'] } },
  { params: { slug: ['place', 'london', '2'] } },
];

const pathsFromContextNoSlug = [
  { params: { slug: ['article', '1'] } },
  { params: { slug: ['article', '2'] } },
  { params: { slug: ['article', '3'] } },
  { params: { slug: ['place', 'boston', 'south', '1'] } },
  { params: { slug: ['place', 'london', '2'] } },
];

describe('generate paths on build with menu links prioritization', () => {
  test('menu links are part of the paths from context', async () => {
    jest
      .spyOn(DrupalClient.prototype, 'getStaticPathsFromContext')
      .mockImplementation(() => {
        return Promise.resolve(pathsFromContext);
      });
    jest.spyOn(DrupalClient.prototype, 'getMenu').mockImplementation(() => {
      return Promise.resolve({
        items: [
          { url: '/' },
          { url: '/articles' },
          { url: '/place/boston/south/1' },
          { url: '/place/london/2' },
        ],
        tree: [
          { url: '/' },
          { url: '/articles' },
          { url: '/place/boston/south/1' },
          { url: '/place/london/2' },
        ],
      });
    });
    expect(
      await getPrioritizedStaticPathsFromContext(context, ENTITY_TYPES),
    ).toStrictEqual([
      { params: { slug: ['place', 'london', '2'] } },
      { params: { slug: ['place', 'boston', 'south', '1'] } },
      { params: { slug: ['article', '1'] } },
      { params: { slug: ['article', '2'] } },
      { params: { slug: ['article', '3'] } },
    ]);
    expect(client.getStaticPathsFromContext).toBeCalledTimes(1);
    expect(client.getMenu).toBeCalledTimes(1);
  });

  test('menu links are not part of the paths from context', async () => {
    jest
      .spyOn(DrupalClient.prototype, 'getStaticPathsFromContext')
      .mockImplementation(() => {
        return Promise.resolve(pathsFromContext);
      });

    jest.spyOn(DrupalClient.prototype, 'getMenu').mockImplementation(() => {
      return Promise.resolve({
        items: [{ url: '/' }, { url: '/articles' }, { url: '/places' }],
        tree: [{ url: '/' }, { url: '/articles' }, { url: '/places' }],
      });
    });
    expect(
      await getPrioritizedStaticPathsFromContext(context, ENTITY_TYPES),
    ).toStrictEqual(pathsFromContextNoSlug);
    expect(client.getStaticPathsFromContext).toBeCalledTimes(1);
    expect(client.getMenu).toBeCalledTimes(1);
  });

  test('no menu links', async () => {
    jest
      .spyOn(DrupalClient.prototype, 'getStaticPathsFromContext')
      .mockImplementation(() => {
        return Promise.resolve(pathsFromContext);
      });

    jest.spyOn(DrupalClient.prototype, 'getMenu').mockImplementation(() => {
      return Promise.resolve({
        items: [],
        tree: [],
      });
    });
    expect(
      await getPrioritizedStaticPathsFromContext(context, ENTITY_TYPES),
    ).toStrictEqual(pathsFromContextNoSlug);
    expect(client.getStaticPathsFromContext).toBeCalledTimes(1);
    expect(client.getMenu).toBeCalledTimes(1);
  });
});

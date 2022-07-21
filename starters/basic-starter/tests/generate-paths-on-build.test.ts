import { expect } from '@jest/globals';
import { DrupalClient } from 'next-drupal';
import { generatePathsForBuild } from '../pages/[...slug]';

const context = { locales: null, defaultLocale: null };

afterEach(() => {
  jest.restoreAllMocks();
});
const client = new DrupalClient('http://🐈');

describe('generate paths on build with menu links prioritization', () => {
  test('menu links are part of the paths from context', async () => {
    jest
      .spyOn(DrupalClient.prototype, 'getPathsFromContext')
      .mockImplementation(() => {
        return Promise.resolve([
          { params: { slug: ['article, 1'] } },
          { params: { slug: ['article, 2'] } },
          { params: { slug: ['article, 3'] } },
          { params: { slug: ['place, boston, south, 1'] } },
          { params: { slug: ['place, london, 2'] } },
        ]);
      });
    jest.spyOn(DrupalClient.prototype, 'getMenu').mockImplementation(() => {
      return Promise.resolve({
        items: [
          { url: '/' },
          { url: 'place/boston/south/1' },
          { url: 'place/london/2' },
        ],
        tree: [
          { url: '/' },
          { url: 'place/boston/south/1' },
          { url: 'place/london/2' },
        ],
      });
    });
    expect(async () => await generatePathsForBuild(context)).toBe([
      { params: { slug: ['place, boston, south, 1'] } },
      { params: { slug: ['place, london, 2'] } },
      { params: { slug: ['article, 1'] } },
      { params: { slug: ['article, 2'] } },
      { params: { slug: ['article, 3'] } },
    ]);
    expect(client.getPathsFromContext).toBeCalledTimes(1);
    expect(client.getMenu).toBeCalledTimes(1);
  });

  test('menu links are not part of the paths from context', async () => {
    jest
      .spyOn(DrupalClient.prototype, 'getPathsFromContext')
      .mockImplementation(() => {
        return Promise.resolve([
          { params: { slug: ['article, 1'] } },
          { params: { slug: ['article, 2'] } },
          { params: { slug: ['article, 3'] } },
          { params: { slug: ['place, boston, south, 1'] } },
          { params: { slug: ['place, london, 2'] } },
        ]);
      });

    jest.spyOn(DrupalClient.prototype, 'getMenu').mockImplementation(() => {
      return Promise.resolve({
        items: [{ url: '/' }, { url: '/articles' }, { url: '/places' }],
        tree: [{ url: '/' }, { url: '/articles' }, { url: '/places' }],
      });
    });
    expect(async () => await generatePathsForBuild(context)).toBe([
      { params: { slug: ['article, 1'] } },
      { params: { slug: ['article, 2'] } },
      { params: { slug: ['article, 3'] } },
      { params: { slug: ['place, boston, south, 1'] } },
      { params: { slug: ['place, london, 2'] } },
    ]);
    expect(client.getPathsFromContext).toBeCalledTimes(1);
    expect(client.getMenu).toBeCalledTimes(1);
  });

  test('no menu links', async () => {
    jest
      .spyOn(DrupalClient.prototype, 'getPathsFromContext')
      .mockImplementation(() => {
        return Promise.resolve([
          { params: { slug: ['article, 1'] } },
          { params: { slug: ['article, 2'] } },
          { params: { slug: ['article, 3'] } },
          { params: { slug: ['place, boston, south, 1'] } },
          { params: { slug: ['place, london, 2'] } },
        ]);
      });

    jest.spyOn(DrupalClient.prototype, 'getMenu').mockImplementation(() => {
      return Promise.resolve({
        items: [],
        tree: [],
      });
    });
    expect(async () => await generatePathsForBuild(context)).toBe([
      { params: { slug: ['article, 1'] } },
      { params: { slug: ['article, 2'] } },
      { params: { slug: ['article, 3'] } },
      { params: { slug: ['place, boston, south, 1'] } },
      { params: { slug: ['place, london, 2'] } },
    ]);
    expect(client.getPathsFromContext).toBeCalledTimes(1);
    expect(client.getMenu).toBeCalledTimes(1);
  });
});

beforeEach(() => {
  cy.visit('/');
});

describe('Basic Starter', () => {
  it('has a navigation menu', () => {
    cy.get('header nav').should('exist.and.be.visible');
  });
  it('can navigate through the menu links', () => {
    cy.get('header > div > nav > ul > li:nth-child(2) > a').click();
    cy.location('pathname').should('match', /\/articles$/);
    cy.contains('main h1', 'Articles').should('be.visible');

    cy.get('header > div > nav > ul > li:nth-child(3) > a').click();
    cy.location('pathname').should('match', /\/events$/);
    cy.contains('main h1', 'Events').should('be.visible');

    cy.get('header > div > nav > ul > li:nth-child(4) > a').click();
    cy.location('pathname').should('match', /\/people$/);
    cy.contains('main h1', 'People').should('be.visible');

    cy.get('header > div > nav > ul > li:nth-child(5) > a').click();
    cy.location('pathname').should('match', /\/places$/);
    cy.contains('main h1', 'Places').should('be.visible');

    cy.get('header > div > nav > ul > li:nth-child(1) > a').click();
    cy.location('pathname').should('equal', '/');
    cy.contains('main h1', 'A headless Next.js site').should('be.visible');
  });
});

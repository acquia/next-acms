beforeEach(() => {
  cy.visit('/');
});

describe('Basic Starter', () => {
  it('has a navigation menu', () => {
    cy.get('header nav').should('exist.and.be.visible');
  });

  it('has working nav menu links', () => {
    const pages = ['Home', 'Articles', 'Events', 'People', 'Places'];
    pages.forEach((page) => {
      cy.get(`[data-cy="${page}"]`)
        .should('have.text', page)
        .invoke('attr', 'href')
        .then((href) => {
          cy.request(href);
        });
    });
  });
});

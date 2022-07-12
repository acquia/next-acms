beforeEach(() => {
  cy.visit('/');
});

describe('Basic Starter', () => {
  it('has a navigation menu', () => {
    cy.get('header nav').should('exist.and.be.visible');
  });

  it('has working nav menu links', () => {
    const links = ['Home', 'Articles', 'Events', 'People', 'Places'];
    links.forEach((link) => {
      cy.get('.nav-menu')
        .contains(link)
        .should('have.text', link)
        .invoke('attr', 'href')
        .then((href) => {
          cy.request(href);
        });
    });
  });
});

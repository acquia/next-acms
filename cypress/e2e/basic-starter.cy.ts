beforeEach(() => {
  cy.visit('/');
});

describe('Basic Starter', () => {
  it('has a navigation menu', () => {
    cy.get('.nav-menu').should('exist.and.be.visible');
  });

  it('has working nav menu links', () => {
    const links = ['Home', 'Articles', 'Events', 'People', 'Places'];
    links.forEach((link) => {
      cy.get('.nav-menu')
        .contains(link)
        .invoke('attr', 'href')
        .then((href) => {
          cy.visit(href);
          cy.title().should('eq', `${link} - Acquia CMS`);
        });
    });
  });
});

describe('Taxonomy term page', () => {
  it('should render articles for Design', () => {
    cy.visit('/taxonomy/term/2');
    cy.get('h1').should('contain.text', 'Design');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('p.summary')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should still render for a taxonomy term with no nodes', () => {
    cy.visit('/taxonomy/term/12');
    cy.get('h1').should('contain.text', 'Software');
    cy.get('article').should('have.length', 0);
    cy.get('p').should('contain.text', 'No content found.');
  });
});

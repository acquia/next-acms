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
  it('should render articles for Blog (article type)', () => {
    cy.visit('/taxonomy/term/1');
    cy.get('h1').should('contain.text', 'Blog');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('[data-cy="summary"]')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should render people for Management (person type)', () => {
    cy.visit('/taxonomy/term/3');
    cy.get('h1').should('contain.text', 'Management');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('.media__content')
      .should('exist');
    cy.get('article').find('h2').should('exist');
  });

  it('should render events for Webinar (event type)', () => {
    cy.visit('/taxonomy/term/7');
    cy.get('h1').should('contain.text', 'Webinar');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('p')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should render places for Office (place type)', () => {
    cy.visit('/taxonomy/term/13');
    cy.get('h1').should('contain.text', 'Office');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('h2')
      .should(($h2) => {
        expect($h2.first()).to.contain('Boston Head Office');
      });
    cy.get('article').find('.media__content').should('exist');
  });

  it('should still render for a taxonomy term with no nodes', () => {
    cy.visit('/taxonomy/term/12');
    cy.get('h1').should('contain.text', 'Software');
    cy.get('article').should('have.length', 0);
    cy.get('p').should('contain.text', 'No content found.');
  });
});

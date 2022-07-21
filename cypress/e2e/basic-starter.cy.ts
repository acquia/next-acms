beforeEach(() => {
  cy.visit('/');
});

describe('Basic Starter', () => {
  it('should have a navigation menu', () => {
    cy.get('[data-cy="nav-menu"]').should('exist.and.be.visible');
  });

  it('should have working nav menu links', () => {
    const links = ['Home', 'Articles', 'Events', 'People', 'Places'];
    links.forEach((link) => {
      cy.get('[data-cy="nav-menu"]')
        .contains(link)
        .invoke('attr', 'href')
        .then((href) => {
          cy.visit(href);
          cy.title().should('eq', `${link} - Acquia CMS`);
        });
    });
  });

  it('should have working footer menu links', () => {
    const links = ['Home', 'Articles', 'Events', 'People', 'Places'];
    links.forEach((link) => {
      cy.get('[data-cy="footer-menu"]')
        .contains(link)
        .invoke('attr', 'href')
        .then((href) => {
          cy.visit(href);
          cy.title().should('eq', `${link} - Acquia CMS`);
        });
    });
  });

  it('should have featured events on the home page', () => {
    cy.get('[data-cy="featured-events"] > article')
      .should('have.length', 3)
      .find('h2')
      .each(($h2) => {
        expect($h2.text()).contains('Event');
      });
  });

  it('should have contact us information on the home page', () => {
    cy.get('[data-cy="contact-us"] > article')
      .should('have.length.greaterThan', 1)
      .find('h2')
      .should(($h2) => {
        expect($h2.first()).to.contain('Boston Head Office');
      });
  });

  it('should render /articles page', () => {
    cy.visit('/articles');
    cy.get('h1').should('contain.text', 'Articles');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('[data-cy="summary"]')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should render /events page', () => {
    cy.visit('/events');
    cy.get('h1').should('contain.text', 'Events');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('p')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should render /people page', () => {
    cy.visit('/people');
    cy.get('h1').should('contain.text', 'People');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('.media__content')
      .should('exist');
    cy.get('article').find('h2').should('exist');
  });

  it('should render /places page', () => {
    cy.visit('/places');
    cy.get('h1').should('contain.text', 'Places');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('h2')
      .should(($h2) => {
        expect($h2.first()).to.contain('Boston Head Office');
      });
    cy.get('article').find('.media__content').should('exist');
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
});

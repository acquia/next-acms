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
    cy.visit('/blog');
    cy.get('h1').should('contain.text', 'Blog');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('[data-cy="summary"]')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should render people for Management (person type)', () => {
    cy.visit('/person_type/management');
    cy.get('h1').should('contain.text', 'Management');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('.media__content')
      .should('exist');
    cy.get('article').find('h2').should('exist');
  });

  it('should render events for Webinar (event type)', () => {
    cy.visit('/event_type/webinar');
    cy.get('h1').should('contain.text', 'Webinar');
    cy.get('article')
      .should('have.length.greaterThan', 1)
      .find('p')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should render places for Office (place type)', () => {
    cy.visit('/place_type/office');
    cy.get('h1').should('contain.text', 'Office');
    cy.get('article').should('have.length.greaterThan', 1);
    cy.get('article h2').should('contain.text', 'Boston Head Office');
    cy.get('article').find('.media__content').should('exist');
  });
});

describe('Node page', () => {
  it('should render an article node', () => {
    cy.visit('/article/blog/article-ten-medium-length-placeholder-heading');
    cy.get('h1').should(
      'contain.text',
      'Article ten medium length placeholder heading.',
    );
    cy.get('article')
      .should('have.length', 1)
      .find('.prose')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should render an event node', () => {
    cy.visit('/events');
    cy.contains('Event two medium length placeholder heading.')
      .should('contain.text', 'Event two medium length placeholder heading.')
      .click();
    cy.get('h1')
      .should('be.visible')
      .should('contain.text', 'Event two medium length placeholder heading.');
    cy.get('article')
      .should('have.length', 1)
      .find('.prose')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should render a person node', () => {
    cy.visit('/person/operations/alex-kowen');
    cy.get('h1').should('contain.text', 'Alex Kowen');
    cy.get('article')
      .should('have.length', 1)
      .find('.prose')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });

  it('should render a place node', () => {
    cy.visit('/place/office/boston-head-office');
    cy.get('h1').should('contain.text', 'Boston Head Office');
    cy.get('article')
      .should('have.length', 1)
      .find('.prose')
      .should(($p) => {
        expect($p.first()).to.contain.text('This is placeholder text.');
      });
  });
});

describe('An image using a consumer image style', () => {
  it('has the image style source', () => {
    const imageStyle = 'coh_medium';
    cy.visit('/events');
    cy.contains('Event two medium length placeholder heading.')
      .should('contain.text', 'Event two medium length placeholder heading.')
      .should('be.visible')
      .click();
    cy.get('h1')
      .should('be.visible')
      .should('contain.text', 'Event two medium length placeholder heading.');
    cy.get('.media__content')
      .find('img')
      .should('have.attr', 'src')
      .and('match', /^\/_next\/image\?/)
      .and('contain', `styles%2F${imageStyle}`);
  });
});

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

  it('has working footer menu links', () => {
    const links = ['Home', 'Articles', 'Events', 'People', 'Places'];
    links.forEach((link) => {
      cy.get('.footer-menu')
        .contains(link)
        .invoke('attr', 'href')
        .then((href) => {
          cy.visit(href);
          cy.title().should('eq', `${link} - Acquia CMS`);
        });
    });
  });

  it('has featured events on the home page', () => {
    cy.get('.featured-events > article')
      .should('have.length', 3)
      .find('h2')
      .each(($h2) => {
        expect($h2.text()).contains('Event');
      });
  });

  it('has a contact us on the home page', () => {
    const places = [
      'Boston Head Office',
      'Brighton Office',
      'London sales and support office',
    ];
    cy.get('.contact-us > article')
      .should('have.length', 3)
      .find('h2')
      .each(($h2) => {
        expect(places).contains($h2.text());
      });
  });

  it('has demo content on the articles page', () => {
    const bodyText =
      'This is placeholder text. If you are reading this, it is here by mistake and we would appreciate it if you could email us with a link to the page you found it on.';
    cy.visit('/articles');
    cy.get('article')
      .should('have.length', 16)
      .find('p.summary')
      .each(($p) => {
        expect($p.text()).contains(bodyText);
      });
  });

  it('has demo content on the events page', () => {
    const bodyText =
      'This is placeholder text. If you are reading this, it is here by mistake and we would appreciate it if you could email us with a link to the page you found it on.';
    cy.visit('/events');
    cy.get('article')
      .should('have.length', 20)
      .find('p')
      .each(($p) => {
        expect($p.text()).contains(bodyText);
      });
  });

  it('has demo content on the people page', () => {
    const roles = [
      'Product Owner',
      'Financial Controller',
      'Sales Executive',
      'Manager',
      'Head of Operations',
      'Office Manager',
      'Finance Manager',
      'Logistics Manager',
      'Operations Manager',
      'Head of Sales',
      'IT Manager',
    ];
    cy.visit('/people');
    cy.get('article')
      .should('have.length', 14)
      .find('p')
      .each(($p) => {
        expect(roles).contains($p.text());
      });
  });

  it('has demo content on the places page', () => {
    const places = [
      'Boston Head Office',
      'Brighton Office',
      'London sales and support office',
    ];
    cy.visit('/places');
    cy.get('article')
      .should('have.length', 3)
      .find('h2')
      .each(($h2) => {
        expect(places).contains($h2.text());
      });
  });
});

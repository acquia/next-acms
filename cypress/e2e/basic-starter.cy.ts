describe('Basic Starter', () => {
  it('has a navigation menu', () => {
    cy.visit('/').get('header nav').should('exist.and.be.visible');
  });
});

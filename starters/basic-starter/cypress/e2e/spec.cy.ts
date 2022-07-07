describe('Basic Starter', () => {
  it('has a navigation menu', () => {
    cy.visit('http://localhost:3000')

    cy.get('header nav').should('exist.and.be.visible')
  })
})
context('E2E tests', () => {
  it('fills the input, select the first suggestion and show the result page', function() {
    cy.visit('/')
    cy.getByPlaceholderText('find package')
      .click()
      .type('react-easy-crop')

    cy.getAllByText(/A React component to crop images/i)
      .first()
      .click()

    cy.url().should('include', '/result?p=react-easy-crop')
  })

  it('shows the right data for react-easy-crop@1.14.0', function() {
    cy.visit('/result?p=react-easy-crop@1.14.0')

    // stats card
    cy.getByLabelText('minified').contains('34.7kB')
    cy.getByLabelText(/minified \+ gzipped/i).contains('12.4kB')
    cy.getByLabelText(/2g edge/i).contains('415ms')
    cy.getByLabelText(/emerging 3g/i).contains('249ms')

    // history card
    cy.get('[data-testid="package-history"] > div').should('have.length', 4)

    // treemap
    cy.getAllByTestId('composition-rectangle').should('have.length.gt', 5)
  })
})

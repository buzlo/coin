/// <reference types="cypress" />

describe('Кошелёк Coin', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('label').contains('Логин').find('input').type('developer');
    cy.get('label').contains('Пароль').find('input').type('password');
    cy.get('button').contains('Войти').click();
  });

  it('Просмотр списка счетов, создание нового счёта', () => {
    cy.get('.accounts__item')
      .its('length')
      .then((initLength) => {
        cy.get('button').contains('Создать новый').click();
        cy.get('.accounts__item').should('have.length', initLength + 1);
      });
  });

  it('Перевод средств со счета на счет', () => {
    cy.get('.accounts__item').first().find('a').contains('Открыть').click();
    cy.contains('Баланс')
      .parent()
      .contains('₽')
      .as('balance')
      .invoke('text')
      .then((text) => {
        const initBalance = extractFloat(text);

        cy.contains(/Номер.*получателя/)
          .find('input')
          .type('17307867273606026235887604');
        cy.contains(/Сумма.*перевода/)
          .find('input')
          .type('1000');

        cy.intercept('transfer-funds').as('transferDone');

        cy.get('button').contains('Отправить').click();

        cy.wait('@transferDone').then(() => {
          cy.get('@balance').should((element) => {
            expect(extractFloat(element.text())).to.eq(initBalance - 1000);
          });
        });
      });
  });

  function extractFloat(string) {
    return Number(string.replace(',', '.').replace(/[^\d.]/g, ''));
  }
});

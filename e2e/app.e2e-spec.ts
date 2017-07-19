import { BuzzDashboardPage } from './app.po';

describe('buzz-dashboard App', () => {
  let page: BuzzDashboardPage;

  beforeEach(() => {
    page = new BuzzDashboardPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

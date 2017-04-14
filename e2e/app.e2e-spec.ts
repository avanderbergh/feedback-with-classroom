import { BrilliantBadgerPage } from './app.po';

describe('brilliant-badger App', () => {
  let page: BrilliantBadgerPage;

  beforeEach(() => {
    page = new BrilliantBadgerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

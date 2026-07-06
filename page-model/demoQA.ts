import { Page, Browser } from '@playwright/test';
import { Header } from './common/header';
import { LeftSidebar } from './common/left-sidebar';
import { TextBoxPage } from './elements/text-box-page';
import { CheckBoxPage } from './elements/check-box-page';
import { RadioButtonPage } from './elements/radio-button-page';
import { ButtonsPage } from './elements/buttons-page';
import { LinksPage } from './elements/links-page';
import { PracticeFormPage } from './forms/practice-form-page';
import { DatePickerPage } from './widgets/date-picker-page';
import { SliderPage } from './widgets/slider-page';

/**
 * DemoQA - Main facade for all page models
 * Provides lazy-loaded access to all pages via getters
 */
export class DemoQA {
  private _header?: Header;
  private _sidebar?: LeftSidebar;

  // Elements pages
  private _textBoxPage?: TextBoxPage;
  private _checkBoxPage?: CheckBoxPage;
  private _radioButtonPage?: RadioButtonPage;
  private _buttonsPage?: ButtonsPage;
  private _linksPage?: LinksPage;

  // Forms pages
  private _practiceFormPage?: PracticeFormPage;

  // Widgets pages
  private _datePickerPage?: DatePickerPage;
  private _sliderPage?: SliderPage;

  constructor(
    readonly page: Page,
    protected readonly browser: Browser
  ) {}

  /**
   * Common Components
   */
  get header(): Header {
    return (this._header ??= new Header(this.page));
  }

  get sidebar(): LeftSidebar {
    return (this._sidebar ??= new LeftSidebar(this.page));
  }

  /**
   * Elements Pages
   */
  get textBoxPage(): TextBoxPage {
    return (this._textBoxPage ??= new TextBoxPage(this.page));
  }

  get checkBoxPage(): CheckBoxPage {
    return (this._checkBoxPage ??= new CheckBoxPage(this.page));
  }

  get radioButtonPage(): RadioButtonPage {
    return (this._radioButtonPage ??= new RadioButtonPage(this.page));
  }

  get buttonsPage(): ButtonsPage {
    return (this._buttonsPage ??= new ButtonsPage(this.page));
  }

  get linksPage(): LinksPage {
    return (this._linksPage ??= new LinksPage(this.page));
  }

  /**
   * Forms Pages
   */
  get practiceFormPage(): PracticeFormPage {
    return (this._practiceFormPage ??= new PracticeFormPage(this.page));
  }

  /**
   * Widgets Pages
   */
  get datePickerPage(): DatePickerPage {
    return (this._datePickerPage ??= new DatePickerPage(this.page));
  }

  get sliderPage(): SliderPage {
    return (this._sliderPage ??= new SliderPage(this.page));
  }

  override toString(): string {
    return 'DemoQA';
  }
}

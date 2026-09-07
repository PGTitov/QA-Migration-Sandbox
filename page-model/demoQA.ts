import { Page, Browser } from '@playwright/test';
import { Header } from './common/header';
import { LeftSidebar } from './common/left-sidebar';
import { TextBoxPage } from './elements/text-box-page';
import { CheckBoxPage } from './elements/check-box-page';
import { RadioButtonPage } from './elements/radio-button-page';
import { WebTablesPage } from './elements/web-tables-page';
import { ButtonsPage } from './elements/buttons-page';
import { LinksPage } from './elements/links-page';
import { BrokenLinksImagesPage } from './elements/broken-links-images-page';
import { UploadDownloadPage } from './elements/upload-download-page';
import { DynamicPropertiesPage } from './elements/dynamic-properties-page';
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
  private _webTablesPage?: WebTablesPage;
  private _buttonsPage?: ButtonsPage;
  private _linksPage?: LinksPage;
  private _brokenLinksImagesPage?: BrokenLinksImagesPage;
  private _uploadDownloadPage?: UploadDownloadPage;
  private _dynamicPropertiesPage?: DynamicPropertiesPage;

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

  get webTablesPage(): WebTablesPage {
    return (this._webTablesPage ??= new WebTablesPage(this.page));
  }

  get buttonsPage(): ButtonsPage {
    return (this._buttonsPage ??= new ButtonsPage(this.page));
  }

  get linksPage(): LinksPage {
    return (this._linksPage ??= new LinksPage(this.page));
  }

  get brokenLinksImagesPage(): BrokenLinksImagesPage {
    return (this._brokenLinksImagesPage ??= new BrokenLinksImagesPage(this.page));
  }

  get uploadDownloadPage(): UploadDownloadPage {
    return (this._uploadDownloadPage ??= new UploadDownloadPage(this.page));
  }

  get dynamicPropertiesPage(): DynamicPropertiesPage {
    return (this._dynamicPropertiesPage ??= new DynamicPropertiesPage(this.page));
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

  toString(): string {
    return 'DemoQA';
  }
}

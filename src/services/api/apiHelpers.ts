
import { ApprovedRadio } from '../firebase/types';
import { RadioStation } from './types';

// Base URL for radio-browser.info API
export const BASE_URL = 'https://de1.api.radio-browser.info/json';

// Helper function to map ApprovedRadio to RadioStation
export const mapApprovedRadioToStation = (radio: ApprovedRadio): RadioStation => ({
  changeuuid: radio.id,
  stationuuid: radio.id,
  name: radio.radioName,
  url: radio.streamUrl,
  url_resolved: radio.streamUrl,
  homepage: radio.websiteUrl || '',
  favicon: radio.logoUrl || '',
  tags: radio.tags,
  country: radio.country,
  countrycode: '',
  language: radio.language,
  votes: 0,
  codec: '',
  bitrate: 0,
  lastcheckok: 1,
  lastchecktime: '',
  lastcheckoktime: '',
  clicktimestamp: '',
  clickcount: 0,
  clicktrend: 0,
  hls: 0,
  lastchangetime: '',
  lastlocalchecktime: ''
});

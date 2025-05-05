
// Common types used across radio API files

export interface RadioStation {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  language: string;
  votes: number;
  codec: string;
  bitrate: number;
  lastcheckok: number;
  lastchecktime: string;
  lastcheckoktime: string;
  clicktimestamp: string;
  clickcount: number;
  clicktrend: number;
  hls: number;
  lastchangetime: string;
  lastlocalchecktime: string;
}

export interface Country {
  name: string;
  iso_3166_1: string;
  stationcount: number;
}

export interface Language {
  name: string;
  stationcount: number;
}

export interface Tag {
  name: string;
  stationcount: number;
}

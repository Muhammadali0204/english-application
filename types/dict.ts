export type DictionaryDataResponse = {
  words_count: number;
  words_in_one_unit: number;
  units_in_one_book: number;
  books_count: number;
}

export enum UnitStatus {
  enable = 'enable',
  current = 'current',
  disable = 'disable'
}

export type WordsResponse = {
  book: number,
  unit: number,
  words: Word[],
}

export type Word = {
  data: {
    en: Array<string>,
    uz: Array<string>
  }
}

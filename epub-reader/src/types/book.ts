type Book = {
  book?: any;
  bookId?: string;
  coverURL: string;
  title: string;
  description: string;
  published_date: string;
  modified_date: string;
  author: string;
  publisher: string;
  language: string;
  wordCount?: number;
};

export type BookStyle = {
  fontSize: number;
  lineHeight: number;
};

export type BookFlow = 'paginated' | 'scrolled';

export type BookOption = {
  flow: BookFlow,
  resizeOnOrientationChange: boolean,
  spread: 'auto' | 'none' | 'always'
};

export default Book;
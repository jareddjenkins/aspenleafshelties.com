export interface DogPageDocument {
  slug: string;
  displayName: string;
  dogIds: string[];
  legacyPageName?: string;
}

export interface PageAssignment {
  dogId: string;
  pageName: string;
  sortId: number;
}

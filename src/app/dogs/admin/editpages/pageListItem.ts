import { Dog } from '../../model/dog';

export interface PageListItem {
  dog: Dog;
  sortId: number;
  pageName: string;
  dogId: string;
}

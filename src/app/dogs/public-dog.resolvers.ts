import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { DogService } from '../dog.service';
import { DogpagesService } from '../dogpages.service';
import { Dog } from './model/dog';

export const boysPageResolver: ResolveFn<Dog[]> = () =>
  inject(DogpagesService).getDogsForPage('boys');

export const girlsPageResolver: ResolveFn<Dog[]> = () =>
  inject(DogpagesService).getDogsForPage('girls');

export const showPuppiesResolver: ResolveFn<Dog[]> = () =>
  inject(DogpagesService).getDogsForPage('showavailable');

export const companionPuppiesResolver: ResolveFn<Dog[]> = () =>
  inject(DogpagesService).getDogsForPage('available');

export const availableAdultsResolver: ResolveFn<Dog[]> = () =>
  inject(DogpagesService).getDogsForPage('adultavailable');

export const dogDetailResolver: ResolveFn<Dog | undefined> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    return undefined;
  }

  return inject(DogService).getDog(id);
};

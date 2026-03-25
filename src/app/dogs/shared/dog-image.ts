import { Dog } from '../model/dog';

export const DEFAULT_DOG_IMAGE_URL = 'assets/images/dog-photo-unavailable-square.png';

export function isUsableDogImageUrl(imageUrl: string | null | undefined): imageUrl is string {
  return typeof imageUrl === 'string' && imageUrl.trim().length > 0;
}

export function getPreferredDogImage(dog: Dog | undefined, variant: 'card' | 'detail' = 'card'): string {
  if (!dog) {
    return '';
  }

  if (variant === 'detail') {
    return dog.profileDetailImageUrl || dog.profileCardImageUrl || dog.profileImageUrl || '';
  }

  return dog.profileCardImageUrl || dog.profileDetailImageUrl || dog.profileImageUrl || '';
}

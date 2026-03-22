export type DogStatus = 'reserved' | 'sold' | null;

export interface Dog {
  id: string;
  cname: string;
  comments: string;
  dob: Date | null;
  damId: string | null;
  damName: string;
  sireName: string;
  sireId: string | null;
  gender: boolean;
  profileImageUrl: string;
  rname: string;
  status: DogStatus;
}
